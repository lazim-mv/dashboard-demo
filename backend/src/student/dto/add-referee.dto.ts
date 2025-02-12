export class RefereeDetails {
  name: string;
  position: string;
  email: string;
  mobile_no: string;
  address: string;
}

export class AddRefereeDetailsDto {
  referee_details: RefereeDetails[];
}
