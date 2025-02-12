import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { UploadModule } from 'src/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { PartnerSecurityService } from './partnerSecurity.service';
import { LeadModule } from './lead/lead.module';
import { AdministrationModule } from './administration/administration.module';

@Module({
  controllers: [PartnerController],
  providers: [PartnerService, PartnerSecurityService],
  imports: [UploadModule, ConfigModule, LeadModule, AdministrationModule],
})
export class PartnerModule {}
