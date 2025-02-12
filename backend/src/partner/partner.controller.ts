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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { Roles } from 'src/auth/roles.decorator';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnerQueryDto } from './dto/partner-query.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FastifyRequest } from 'fastify';
import { File, FileFieldsInterceptor } from '@nest-lab/fastify-multer';
import { RolesGuard } from 'src/auth/roles.guard';
import { PARTNER_SUPER_ADMIN_ROLE } from './entity/partner.entity';
import { UpdatePartnerStatusDto } from './dto/update-partner-status.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get('check/:uuid')
  async canCreatePartner(@Param('uuid') uuid: string) {
    return await this.partnerService.canCreatePartner(uuid);
  }

  @Post('create/:uuid')
  async createPartner(
    @Param('uuid') uuid: string,
    @Body() body: CreatePartnerDto,
  ) {
    return await this.partnerService.createPartner(uuid, body);
  }

  @Get('authed')
  @UseGuards(JwtAuthGuard)
  async getAuthedParter(@Req() req: FastifyRequest) {
    return await this.partnerService.getAuthedPartner(req.user.id);
  }

  //SUPER ADMIN ONLY
  @Get()
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllPartners(@Query() query: PartnerQueryDto) {
    return await this.partnerService.getAllPartners(query);
  }

  @Get(':id')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getPartnerById(@Param('id', ParseIntPipe) id: number) {
    return await this.partnerService.getPartnerById(id);
  }

  @Patch(':id')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePartner(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePartnerDto,
  ) {
    return await this.partnerService.updatePartner(id, body);
  }

  @Post('upload-docs')
  @Roles({ role: PARTNER_SUPER_ADMIN_ROLE })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pan_card', maxCount: 1 },
      { name: 'cancelled_cheque', maxCount: 1 },
      { name: 'gst_letter', maxCount: 1 },
    ]),
  )
  async uploadDocs(
    @UploadedFiles()
    files: {
      pan_card: File[];
      cancelled_cheque: File[];
      gst_letter: File[];
    },
    @Req() req: FastifyRequest,
  ) {
    return await this.partnerService.uploadDocs(req.user.partner_id, files);
  }

  @Post(':id/get-docs-url')
  @Roles({ role: 'SUPER_ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDocsUrl(@Param('id', ParseIntPipe) id: number) {
    return await this.partnerService.getDocs(id);
  }

  @Patch(':id/status')
  @Roles({ role: 'SUPER_ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async approvePartner(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePartnerStatusDto,
  ) {
    return await this.partnerService.updatePartnerStatus(id, body);
  }
}
