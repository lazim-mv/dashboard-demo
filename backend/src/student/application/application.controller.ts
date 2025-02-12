import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { PARTNER_SUPER_ADMIN_ROLE } from 'src/partner/entity/partner.entity';
import { ShortlistDto } from './dto/shortlist.dto';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApplyDto } from './dto/apply.dto';

@Controller('students/:id/applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('shortlist')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addToShortlist(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ShortlistDto,
  ) {
    return await this.applicationService.addToShortlist(
      user.partner_id,
      id,
      body,
    );
  }

  @Get('shortlist')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getStudentShortlist(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.applicationService.getStudentCourseShortlist(
      user.partner_id,
      id,
    );
  }

  @Delete('shortlist/:shortlist_id')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeFromShortlist(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Param('shortlist_id', ParseIntPipe) shortlist_id: number,
  ) {
    return await this.applicationService.removeFromShortlist(
      user.partner_id,
      id,
      shortlist_id,
    );
  }

  @Post('apply')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async apply(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApplyDto,
  ) {
    return await this.applicationService.apply(user.partner_id, id, body);
  }

  @Get('apply')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['READ'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getStudentApplications(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.applicationService.getStudentCourseApplications(
      user.partner_id,
      id,
    );
  }

  @Delete('apply/:application_id')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeApplication(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Param('application_id', ParseIntPipe) application_id: number,
  ) {
    return await this.applicationService.removeApplication(
      user.partner_id,
      id,
      application_id,
    );
  }
}
