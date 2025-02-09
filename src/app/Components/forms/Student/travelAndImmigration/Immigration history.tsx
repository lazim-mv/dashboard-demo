import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import {
  Checkbox,
  CheckboxProps,
  Col,
  Form,
  FormInstance,
  message,
  Row,
  Skeleton,
} from "antd";
import React, { useEffect, useState } from "react";
import type { ImmigrationHistoryFormValues } from "./types/types";
import { axiosInstance } from "@/app/configs/axios";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";
import ActionButton from "@/app/Components/common/ActionButton";
// import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";

type FormProps = {
  form: FormInstance<ImmigrationHistoryFormValues>;
  studentsData?: Student | null;
  loading?: boolean;
  refetch?: () => void;
};

const ImmigrationHistory: React.FC<FormProps> = ({ form, studentsData, loading }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  console.log(studentId);

  // const { studentsData, loading } = useGetByIdStudents();

  useEffect(() => {
    if (studentsData) {
      // Set student ID in state and local storage
      const currentStudentId = studentsData?.id;
      setStudentId(currentStudentId);

      if (currentStudentId) {
        localStorage.setItem('studentId', currentStudentId.toString());
      }

      const need_visa_for_specific_countries =
        studentsData.travel_immigration?.need_visa_for_specific_countries || [];

      // Update both form values and selected state
      if (need_visa_for_specific_countries.length > 0) {
        form.setFieldsValue({ appliedCountries: need_visa_for_specific_countries });
        setSelected(need_visa_for_specific_countries);
      }
    }
  }, [studentsData, form]);

  const onChange: CheckboxProps["onChange"] = (e) => {
    const { value, checked } = e.target;
    const currentValues = form.getFieldValue("appliedCountries") || [];

    const updatedValues = checked
      ? [...currentValues, value]
      : currentValues.filter((country: string) => country !== value);

    form.setFieldsValue({ appliedCountries: updatedValues });
    setSelected(updatedValues);
  };

  const handleFinish = async () => {
    try {
      setButtonLoading(true);
      const studentId = localStorage.getItem("studentId");

      const payload = { need_visa_for_specific_countries: selected }
      const response = await axiosInstance.post(`/students/${studentId}/travel-history`, payload)

      if (response.status === 201) {
        message.success("Health details saved successfully");
      } else {
        message.error("Something went wrong, please try again later")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setButtonLoading(false);
    }
  }

  if (loading) {
    return (
      <BorderContainer>
        <FormTitle title="Immigration History" />
        <div style={{ padding: '24px' }}>
          <Skeleton
            active
            paragraph={{ rows: 2 }}
            title={{ width: '30%' }}
          />
        </div>
      </BorderContainer>
    )
  }

  return (
    <BorderContainer>
      <FormTitle title="Immigration history" />
      <Form
        form={form}
        layout="vertical"
        className="formStyles"
        onFinish={handleFinish}
      >
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <span style={{ fontWeight: "500", fontSize: "16px" }}>
              Has this student applied for permission to remain in any of the
              following countries in the past ten years?
            </span>
          </Col>
          {[
            { value: "united_kingdom", label: "United Kingdom" },
            { value: "ireland", label: "Ireland" },
            { value: "canada", label: "Canada" },
            { value: "united_arab_emirates", label: "United Arab Emirates" },
            { value: "united_states", label: "United States" },
            { value: "none", label: "None" }
          ].map(({ value, label }) => (
            <Col key={value} style={{ display: "flex", gap: "16px" }}>
              <Checkbox
                onChange={onChange}
                value={value}
                checked={selected.includes(value)}
              >
                {label}
              </Checkbox>
            </Col>
          ))}
        </Row>
        <Row justify="end">
          {/* <Button type="primary" htmlType="submit" size="large" shape="round">
            Save
          </Button> */}

          <ActionButton
            shape="round"
            btnText="Save"
            htmlType="submit"
            buttonLoading={buttonLoading}
          />
        </Row>
      </Form>
    </BorderContainer>
  );
};

export default ImmigrationHistory;