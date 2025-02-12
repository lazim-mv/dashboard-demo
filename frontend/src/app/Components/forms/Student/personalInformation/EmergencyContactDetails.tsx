import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
// import InputInt from "@/app/Components/form/InputInt";
import InputString from "@/app/Components/form/InputString";
import { Col, Form, FormInstance, message, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import type { EmergencyContactFormValues } from "./types/types";
import { axiosInstance } from "@/app/configs/axios";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";
import ActionButton from "@/app/Components/common/ActionButton";
// import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";

type FormProps = {
  form: FormInstance;
  studentsData: Student | null;
  loading: boolean;
  refetch?: () => void;
};

const EmergencyContactDetails: React.FC<FormProps> = ({ form, studentsData, loading, refetch }) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  // const { studentsData, loading } = useGetByIdStudents();

  useEffect(() => {
    if (studentsData) {
      form.setFieldsValue({
        emergency_contact_name: studentsData.emergency_contact_name,
        emergency_contact_no: studentsData.emergency_contact_no,
        emergency_contact_email: studentsData.emergency_contact_email,
        emergency_contact_relation: studentsData.emergency_contact_relation,
        emergency_contact_address: studentsData.emergency_contact_address,
      })
    }
  }, [studentsData])

  const handleFinish = async (values: EmergencyContactFormValues) => {
    try {
      setButtonLoading(true)
      const studentId = localStorage.getItem("studentId");
      const response = await axiosInstance.post(`/students/${studentId}/emergency-contact`, values)
      if (response.status === 201) {
        message.success("Emergency contact details saved successfully");
        console.log(response, "address Response");
      } else {
        message.error("Error while saving emergency contact details");
      }

    } catch (error) {
      console.log(error)
    } finally {
      setButtonLoading(false);
      if (refetch) {
        refetch();
      }
    }
  };

  if (!studentsData && loading) {
    return (
      <BorderContainer>
        <FormTitle title="Emergency contact details" />
        <div style={{ padding: '24px' }}>
          <Skeleton
            active
            paragraph={{ rows: 6 }}
            title={{ width: '30%' }}
          />
        </div>
      </BorderContainer>
    )
  }

  return (
    <>
      <BorderContainer>
        <FormTitle title="Emergency contact details" />
        <Form
          form={form}
          layout="vertical"
          className="formStyles"
          onFinish={handleFinish}
        >
          <Row gutter={[24, 16]}>
            <Col span={8}>
              <InputString label="Name" name="emergency_contact_name" placeHolder="Enter Name" />
            </Col>
            <Col span={8}>
              <InputString label="Phone Number" name="emergency_contact_no" placeHolder="Enter Phone Number" />
            </Col>
            {/* <Col span={8}>
              <InputInt label="Phone Number" name="emergency_contact_no" />
            </Col> */}
            <Col span={8}>
              <InputString label="Email" name="emergency_contact_email" placeHolder="Enter Email" />
            </Col>
            <Col span={8}>
              <InputString
                label="Relationship"
                name="emergency_contact_relation"
                placeHolder="Enter Relationship"
              />
            </Col>
            <Col span={8}>
              <InputString label="Address" name="emergency_contact_address" placeHolder="Enter Address" />
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: "24px" }}>
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
    </>
  );
};

export default EmergencyContactDetails;
