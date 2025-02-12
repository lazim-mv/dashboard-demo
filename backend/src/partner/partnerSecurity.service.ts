import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PARTNER_SUPER_ADMIN_ROLE } from './entity/partner.entity';

@Injectable()
export class PartnerSecurityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * throws BadRequestException() if the specified role doesn't
   * belong to the specified partner or if the role that is begin
   * attached to the user is {PARTNER_SUPER_ADMIN}
   */
  async isValidRole(roleId: number, partnerId: number) {
    const requiredRole = await this.prisma.role.findUnique({
      select: { name: true, partner_id: true },
      where: {
        id: roleId,
      },
    });
    if (
      !requiredRole ||
      requiredRole.partner_id !== partnerId ||
      requiredRole.name === PARTNER_SUPER_ADMIN_ROLE
    ) {
      throw new BadRequestException(
        'The role to be added to the user is invalid.',
      );
    }
  }
}
