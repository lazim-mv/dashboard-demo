import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdministrationService } from './administration.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { FastifyRequest } from 'fastify';
import { Roles } from 'src/auth/roles.decorator';
import { PARTNER_SUPER_ADMIN_ROLE } from '../entity/partner.entity';
import { CreatePartnerUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdatePartnerUserDto } from './dto/update-user.dto';

@Controller('partners/administration')
export class AdministrationController {
  constructor(private readonly adminService: AdministrationService) {}

  @Get('screens')
  @Roles({ role: PARTNER_SUPER_ADMIN_ROLE })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getScreens() {
    return await this.adminService.getScreens();
  }

  @Post('roles')
  @Roles({ role: PARTNER_SUPER_ADMIN_ROLE })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createRole(@Body() body: CreateRoleDto, @Req() req: FastifyRequest) {
    return await this.adminService.createRole(req.user.partner_id, body);
  }

  @Get('roles')
  @Roles({ role: PARTNER_SUPER_ADMIN_ROLE })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getRoles(@Req() req: FastifyRequest) {
    return await this.adminService.getRoles(req.user.partner_id);
  }

  @Post('users')
  @Roles({ role: PARTNER_SUPER_ADMIN_ROLE })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createUser(
    @Body() body: CreatePartnerUserDto,
    @Req() req: FastifyRequest,
  ) {
    return await this.adminService.createUser(req.user.partner_id, body);
  }

  @Get('users')
  @Roles({ role: PARTNER_SUPER_ADMIN_ROLE })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUsers(@Req() req: FastifyRequest) {
    return await this.adminService.getUsers(req.user.partner_id);
  }

  @Patch('users/:id')
  @Roles({ role: PARTNER_SUPER_ADMIN_ROLE })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Req() req: FastifyRequest,
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: UpdatePartnerUserDto,
  ) {
    return await this.adminService.updateUser(
      req.user.partner_id,
      userId,
      body,
    );
  }
}
