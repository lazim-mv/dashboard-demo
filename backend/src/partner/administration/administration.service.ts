import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePartnerUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PartnerSecurityService } from '../partnerSecurity.service';
import { PARTNER_SUPER_ADMIN_ROLE } from '../entity/partner.entity';
import { UpdatePartnerUserDto } from './dto/update-user.dto';

@Injectable()
export class AdministrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly securityService: PartnerSecurityService,
  ) {}

  async getScreens() {
    const data = await this.prisma.screen.findMany({
      where: { parent_screen_id: null },
    });
    return { data };
  }

  async createRole(partnerId: number, body: CreateRoleDto) {
    const data = await this.prisma.role.create({
      select: {
        name: true,
        permissions: { select: { resource: true, actions: true } },
      },
      data: {
        name: body.name,
        partner_id: partnerId,
        permissions: {
          createMany: {
            data: body.permissions.map((permission) => {
              return {
                type: 'NORMAL',
                resource: permission.resource,
                actions: permission.actions,
              };
            }),
          },
        },
        screens: {
          connect: body.screen_ids.map((id) => ({
            id,
          })),
        },
      },
    });

    return { data, message: 'Role created!' };
  }

  async getRoles(partnerId: number) {
    const data = await this.prisma.role.findMany({
      include: {
        permissions: true,
        screens: true,
      },
      where: {
        partner_id: partnerId,
        name: {
          not: PARTNER_SUPER_ADMIN_ROLE,
        },
      },
    });
    if (data.length === 0) {
      throw new NotFoundException();
    }
    return { data };
  }

  async createUser(partnerId: number, body: CreatePartnerUserDto) {
    await this.securityService.isValidRole(body.role_id, partnerId);

    const hashedPass = await bcrypt.hash(body.password, 10);
    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPass,
          parent_role: 'PARTNER_ADMIN',
          partner_id: partnerId,
        },
      });
      await tx.userRole.create({
        data: {
          user_id: user.id,
          role_id: body.role_id,
        },
      });
    });
    return { message: 'User created!' };
  }

  async getUsers(partnerId: number) {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        user_roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      where: {
        partner_id: partnerId,
      },
    });
    if (users.length === 0) {
      throw new NotFoundException();
    }
    return { data: users };
  }

  async updateUser(
    partnerId: number,
    userId: number,
    body: UpdatePartnerUserDto,
  ) {
    //checking if the user that is to be updated belogs to the partner super admin that is logged in
    //and  the partner super admin is not editing itself(ie it is not editing the user with role
    //PARTNER_SUPER_ADMIN).
    const user = await this.prisma.user.findUnique({
      include: {
        user_roles: true,
      },
      where: {
        id: userId,
        partner_id: partnerId,
        user_roles: {
          every: {
            role: {
              name: {
                not: PARTNER_SUPER_ADMIN_ROLE,
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //checking if new role to be added belongs to logged in partner and it is not the
    //PARTNER_SUPER_ADMIN role
    await this.securityService.isValidRole(body.role_id, partnerId);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        user_roles: {
          update: {
            where: {
              user_id_role_id: {
                user_id: userId,
                role_id: user.user_roles[0].role_id,
              },
            },
            data: {
              role_id: body.role_id,
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        user_roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return { data: updatedUser };
  }
}
