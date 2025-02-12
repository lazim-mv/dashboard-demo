import { StudentTabStatus } from '@prisma/client';

export enum StudentTabStatusEnum {
  PERSONAL_DETAILS = 'PERSONAL_DETAILS',
  EDUCATION = 'EDUCATION',
  TRAVEL_IMMIGRATION = 'TRAVEL_IMMIGRATION',
  REFEREE_DETAILS = 'REFEREE_DETAILS',
  WORK_DETAILS = 'WORK_DETAILS',
  DOCUMENTS = 'DOCUMENTS',
  SHORT_LIST_APPLY = 'SHORT_LIST_APPLY',
  APPLICATIONS = 'APPLICATIONS',
  MESSAGE = 'MESSAGE',
}

export class NextTabDto {
  comment: string;
  tab_status: StudentTabStatusEnum;
}
