import { Module } from '@nestjs/common';
import { AdministrationController } from './administration.controller';
import { AdministrationService } from './administration.service';
import { PartnerSecurityService } from '../partnerSecurity.service';

@Module({
  controllers: [AdministrationController],
  providers: [AdministrationService, PartnerSecurityService],
})
export class AdministrationModule {}
