import { PartialType } from '@nestjs/swagger';
import { CreateLeadFromAdminDto } from './create-lead.dto';

export class UpdateLeadDto extends PartialType(CreateLeadFromAdminDto) {}
