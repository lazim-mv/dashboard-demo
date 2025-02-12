import { Form, InputNumber } from "antd";
import React from "react";

type FieldType = {
  phone_no?: number;
  alternate_phone_no?: number;
  emergency_contact_no?: number;

  // referee Details
  referee_phone_number?: number;

  // Work Details
  work_info_phone_number?: number;
};

type InputStringProps = {
  label: string;
  name: keyof FieldType;
  size?: "large" | "middle" | "small";
};

const InputInt: React.FC<InputStringProps> = ({
  label,
  name,
  size = "large",
}) => {
  return (
    <Form.Item<FieldType>
      label={<span style={{ fontWeight: "500" }}>{label}</span>}
      name={name}
      rules={[{ required: true, message: `Please input your ${label}` }]}
    >
      <InputNumber size={size} style={{ width: "100%" }} />
    </Form.Item>
  );
};

export default InputInt;
