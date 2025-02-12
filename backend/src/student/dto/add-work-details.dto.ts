export class WorkDetails {
  title: string;
  organisation: string;
  organisation_address: string;
  phone_no: string;
  email: string;
  from_date: Date;
  to_date: Date;
}

export class AddWorkDetailsDto {
  work_details: WorkDetails[];
}
