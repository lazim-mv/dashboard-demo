import { Form, Input } from "antd";
import { Rule } from "antd/es/form";
import React from "react";

type FieldType = {
  // PersonalDetails
  name?: string;
  password?: string;
  remember?: string;
  surname?: string;
  email?: string;
  passport_number?: string;
  skype_id?: string;
  phone_no?: string;
  alternate_phone_no?: string;
  //Permanent Address
  address1?: string;
  address2?: string;
  post_code?: string;
  //Current Address
  address1currentaddress?: string;
  address2currentaddress?: string;
  postcodecurrentaddress?: string;
  // Emergency Contact Details
  emergency_contact_name?: string;
  emergency_contact_email?: string;
  emergency_contact_relation?: string;
  emergency_contact_address?: string;
  emergency_contact_no?: string;
  // Comment
  comment?: string;
  // Education Start
  // institutionEducation?: string;
  institution: string;
  course: string;
  result_percent: number;
  courseEducation?: string;
  resultinfo?: string;
  experiencelanguage?: string;
  years_of_experience?: string;
  programme?: string;

  // Health Details
  healthcondition?: string;
  health_issue_details?: string;

  // Refererre Details
  // Referee Details
  referee_name?: string;
  title?: string;
  organisation?: string;
  referee_position?: string;
  referee_work_email?: string;
  organisation_address?: string;
  position?: string;
  mobile_no?: string;
  address?: string;
  // Work Details
  // Work Details Info
  work_info_title?: string;
  work_info_name_of_organisation?: string;
  work_info_Address_of_Organisation?: string;
  work_info_email?: string;


  // Post University
  description?: string;
  location?: string;

  // Post courses
  duration?: string;
  tution_fee?: string;


  // Partner
  first_name?: string;
  last_name?: string;
  whatsapp_no?: string;
  confirm_email?: string;
  confirm_password?: string;
  company_name?: string;
  website?: string;
  country?: string;
  city?: string;
};


type DynamicFieldName = keyof FieldType | `${keyof FieldType}${number}`;

// type ValidatorRule = {
//   validator: (
//     rule: { field?: string; fullField?: string },
//     value: string
//   ) => Promise<void>;
//   message?: string;
// };

// type RequiredRule = {
//   required: boolean;
//   message: string;
// };



type InputStringProps = {
  label: string;
  name: DynamicFieldName;
  size?: "large" | "middle" | "small";
  rules?: Rule[];
  placeHolder?: string | undefined;
  required?: boolean;
};

const InputString: React.FC<InputStringProps> = ({
  label,
  name,
  size = "large",
  rules = [],
  placeHolder = undefined,
  required = true,
}) => {
  const defaultRules = [{ required: required, message: `Please input your ${label}` }];

  return (
    <Form.Item<FieldType>
      label={<span style={{ fontWeight: "500" }}>{label}</span>}
      name={name as keyof FieldType}
      rules={[...defaultRules, ...rules]}
      required={required}
    >
      <Input size={size} placeholder={placeHolder} />
    </Form.Item>
  );
};

export default InputString;