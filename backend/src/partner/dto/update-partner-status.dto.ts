import { PartnerStatusEnum } from '../entity/enums';

export class UpdatePartnerStatusDto {
  newStatus: PartnerStatusEnum;
  resubmit_note: string;
}
