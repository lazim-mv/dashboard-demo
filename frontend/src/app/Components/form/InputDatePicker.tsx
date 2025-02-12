import React from "react";
import { Form, DatePicker } from "antd";

type InputDatePickerProps = {
  label: string;
  name: string;
  size?: "large" | "middle" | "small";
};

const InputDatePicker: React.FC<InputDatePickerProps> = ({
  label,
  name,
  size = "large",
}) => {
  return (
    <Form.Item
      label={<span style={{ fontWeight: "500" }}>{label}</span>}
      name={name}
      rules={[{ required: true, message: `Please select your ${label}` }]}
    >
      <DatePicker size={size} style={{ width: "100%" }} />
    </Form.Item>
  );
};

export default InputDatePicker;
