import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles, RolesDecoratorInputType } from './roles.decorator';
import { FastifyRequest } from 'fastify';
import { PARTNER_SUPER_ADMIN_ROLE } from 'src/partner/entity/partner.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (roles instanceof Array) {
    }
    // console.log('INSIDE ROLES GURARD');
    console.log(roles.permissions);
    if (
      !roles ||
      (!roles.role && (!roles.permissions || roles.permissions.length === 0))
    ) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: FastifyRequest['user'] = request.user;

    //if user is a super admin allow access
    if (roles.role === 'SUPER_ADMIN') {
      if (user.parent_role === 'SUPER_ADMIN') return true;
    }

    //if role specified to access the route is present in user roles
    if (user.user_roles.find((r) => r.name === roles.role)) {
      return true;
    }

    return validateUserPermission(user, roles);
  }
}

function validateUserPermission(
  user: FastifyRequest['user'],
  roles: RolesDecoratorInputType,
) {
  console.log('INSIDE VALIDATE');
  // Check if roles permissions are provided
  if (!roles.permissions) {
    return false;
  }
  console.log('INSIDE VALIDATE AFTER PERMISSIONS CHECK');

  //allow if every permission in permissions array in roles guard is satisfied
  return roles.permissions.every((permission) => {
    return user.user_roles.some((userRole) => {
      const requiredPermissionInUser = userRole.permissions.find(
        (userPermission) => {
          return (
            userPermission.resource === permission.resource &&
            userPermission.type === 'NORMAL'
          );
        },
      );
      if (!requiredPermissionInUser) return false;
      const retVal = permission.actions.every((action) =>
        requiredPermissionInUser.actions.includes(action),
      );
      return retVal;
    });
  });

  //allow if any permission in permissions array in roles guard is satisfied
  return user.user_roles.some((userRole) => {
    return userRole.permissions.some((userPermission) => {
      if (userPermission.type !== 'NORMAL') return false;

      const requiredPermission = roles.permissions.find(
        (permission) => permission.resource === userPermission.resource,
      );

      if (!requiredPermission) return false;
      return requiredPermission.actions.every((action) =>
        userPermission.actions.includes(action),
      );
    });
  });
}
