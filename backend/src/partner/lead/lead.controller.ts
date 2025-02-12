import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeadStatus } from '@prisma/client';
import { LeadService } from './lead.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateLeadDto, CreateLeadFromAdminDto } from './dto/create-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';

@Controller('partners/leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  //SUPER ADMIN ONLY
  @Post('lead-sources')
  @Roles({ role: 'SUPER_ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createLeadSource(@Body('name') name: string) {
    return await this.leadService.createLeadSource(name);
  }

  //SUPER ADMIN ONLY
  @Get('lead-sources')
  @Roles({ role: 'SUPER_ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getLeadSources() {
    return await this.leadService.getLeadSources();
  }

  //Open to anyone
  @Post()
  async createLead(@Body() body: CreateLeadDto) {
    return await this.leadService.createLead(body);
  }

  //SUPER ADMIN ONLY
  @Post('lead-from-admin')
  @Roles({ role: 'SUPER_ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createLeadFromAdmin(@Body() body: CreateLeadFromAdminDto) {
    return await this.leadService.createLeadFromAdmin(body);
  }

  //SUPER ADMIN ONLY
  @Get()
  @Roles({ role: 'SUPER_ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllLeads(@Query() query: LeadQueryDto) {
    return await this.leadService.getAllLeads(query);
  }

  //SUPER ADMIN ONLY
  @Get(':id')
  @Roles({ role: 'SUPER_ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.leadService.getById(id);
  }

  //SUPER ADMIN ONLY
  @Patch('status/:id')
  @Roles({ role: 'SUPER_ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateLeadStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('newStatus') newStatus: LeadStatus,
  ) {
    return await this.leadService.updateLeadStatus(id, newStatus);
  }

  //SUPER ADMIN ONLY
  @Patch(':id')
  @Roles({ role: 'SUPER_ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateLead(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateLeadDto,
  ) {
    return await this.leadService.updateLead(id, body);
  }
}
