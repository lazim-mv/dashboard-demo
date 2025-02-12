import { Paginator } from 'src/paginator/entity/paginator.entity';
import { LeadStatusEnum } from './create-lead.dto';

export class LeadQueryDto extends Paginator {
  lead_status: LeadStatusEnum;
}
