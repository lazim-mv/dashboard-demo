export enum LeadStatusEnum {
  NEW_LEAD = 'NEW_LEAD',
  CONTACTED = 'CONTACTED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
  BLOCKED = 'BLOCKED',
}

export class CreateLeadDto {
  name: string;
  phone_no: string;
  email: string;
  company: string;
}

export class CreateLeadFromAdminDto {
  name: string;
  phone_no: string;
  email: string;
  company: string;
  source_id: number;
}
