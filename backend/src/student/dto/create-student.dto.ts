import { PartialType } from '@nestjs/swagger';

export enum StudentStatusEnum {
  INITIATED = 'INITIATED',
  SUBMISSION_COMPLETED = 'SUBMISSION_COMPLETED',
  INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
  OFFER_LETTER_GRANTED = 'OFFER_LETTER_GRANTED',
  VFS_COMPLETED = 'VFS_COMPLETED',
  VISA_GRANTED = 'VISA_GRANTED',
}

export enum StudentGenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class CreateStudentDto {
  name: string;
  status: StudentStatusEnum;
  surname: string;
  email: string;
  phone_no: string;
  dob: string;
  gender: StudentGenderEnum;
  nationality: string;
  birth_country: string;
  native_language?: string;
  passport_number: string;
  passport_issue_location: string;
  issue_date: Date;
  expiry_date: Date;
  skype_id?: string;
  alternate_phone_no?: string;
}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}

export class StudentAddressDto {
  city: string;
  post_code: string;
  country: string;
  address1: string;
  address2: string;
  state: string;
}

export class AddEmergencyContactDto {
  comment?: string;
  emergency_contact_name?: string;
  emergency_contact_no?: string;
  emergency_contact_email?: string;
  emergency_contact_relation?: string;
  emergency_contact_address?: string;
}
