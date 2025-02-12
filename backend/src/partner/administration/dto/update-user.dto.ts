import { PartialType } from '@nestjs/swagger';
import { CreatePartnerUserDto } from './create-user.dto';

export class UpdatePartnerUserDto extends PartialType(CreatePartnerUserDto) {}
