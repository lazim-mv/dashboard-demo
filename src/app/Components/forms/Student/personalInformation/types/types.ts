export type PersonalInformationFormValues = {
  name: string;
  surname: string;
  email: string;
  phone_no: number;
  dob: Date;
  gender: string;
  nationality: string;
  birth_country: string;
  native_language: string;
  passport_issue_location: string;
  passport_number: string;
  issue_date: Date;
  expiry_date: Date;
  skype_id: string;
  alternate_phone_no: number;
};

export type PermanentAddressFormValues = {
  country: string;
  address1: string;
  address2: string;
  post_code: string;
  state: string;
  city: string;
};

export type CurrentAddressFormValues = {
  countryofresidence: string;
  address1currentaddress: string;
  address2currentaddress: string;
  postcodecurrentaddress: number;
  territorycurrentaddress: string;
  citycurrentaddress: string;
};

export type EmergencyContactFormValues = {
  emergency_contact_name: string;
  emergency_contact_no: number;
  emergency_contact_email: string;
  emergency_contact_relation: string;
  emergency_contact_address: string;
};
