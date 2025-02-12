import { Reflector } from '@nestjs/core';
import {
  ParentUserRole,
  PermissionAction,
  PermissionResource,
  PermissionType,
} from '@prisma/client';
import { type PARTNER_SUPER_ADMIN_ROLE } from 'src/partner/entity/partner.entity';

type RoleType =
  | PARTNER_SUPER_ADMIN_ROLE
  | (typeof ParentUserRole)['SUPER_ADMIN'];

export type RolesDecoratorInputType = {
  role?: RoleType | RoleType[];
  permissions?: {
    resource: PermissionResource;
    actions: PermissionAction[];
    type?: PermissionType;
  }[];
};

export const Roles = Reflector.createDecorator<RolesDecoratorInputType>();
