import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApplicationRootService } from './application-root.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { FastifyRequest } from 'fastify';
import { Paginator } from 'src/paginator/entity/paginator.entity';

@Controller('applications')
export class ApplicationRootController {
  constructor(private readonly applicationService: ApplicationRootService) {}

  @Get('admin')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getApplicationsForAdmin(@Query() query: Paginator) {
    return await this.applicationService.getApplicationsForAdmin(query);
  }

  @Get('partner')
  @Roles({
    role: 'PARTNER_SUPER_ADMIN',
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['READ'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getApplicationsForPartner(
    @AuthUser() user: FastifyRequest['user'],
    @Query() query: Paginator,
  ) {
    return await this.applicationService.getApplicationsForPartner(
      user.partner_id,
      query,
    );
  }
}
