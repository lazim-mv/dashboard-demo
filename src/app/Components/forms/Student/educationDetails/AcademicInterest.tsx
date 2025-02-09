import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import InputSelect from "@/app/Components/form/InputSelect";
import InputString from "@/app/Components/form/InputString";
import { Col, Form, FormInstance, message, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import type { AcademicInterestTypes } from "./types/types";
import { axiosInstance } from "@/app/configs/axios";
import ActionButton from "@/app/Components/common/ActionButton";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";

type FormProps = {
  form: FormInstance;
  studentsData?: Student | null;
  loading?: boolean;
  refetch?: () => void;
};




const AcademicInterest: React.FC<FormProps> = ({ form, studentsData, loading, refetch }) => {
  const [buttonLoading, setButtonLoading] = useState(false);

  // const { studentsData, loading } = useGetByIdStudents();

  useEffect(() => {
    if (studentsData) {
      // const {address1, address2, post_code, state, city} = studentsData.current_address;
      const academic_interest = studentsData?.education?.academic_interest;
      form.setFieldsValue({
        country: academic_interest?.country,
        level_of_study: academic_interest?.level_of_study,
        programme: academic_interest?.programme,
        intake: academic_interest?.intake,
        location: academic_interest?.location,
      })
    }
  }, [studentsData])



  const handleFinish = async (values: AcademicInterestTypes) => {
    try {
      setButtonLoading(true);
      const studentId = localStorage.getItem("studentId");

      const response = await axiosInstance.post(`/students/${studentId}/academic-interest`, values)
      if (response.status === 201 && refetch) {
        message.success("Academic Interest saved successfully");
        console.log(response, "address Response");
      } else {
        message.error("Error while saving Academic Interest");
      }

    } catch (error) {
      console.log(error)
    } finally {
      if (refetch)
        refetch();
        setButtonLoading(false);
    }
  };

  if (loading) {
    return (
      <BorderContainer>
        <FormTitle title="Academic Interest" />
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
    <BorderContainer>
      <FormTitle title="Academic Interest" />
      <Form
        form={form}
        layout="vertical"
        className="formStyles"
        onFinish={handleFinish}
      >
        <Row gutter={[24, 16]}>
          <Col span={8}>
            <InputSelect
              label="Country"
              name="country"
              size="large"
              type="country"
            />
          </Col>

          <Col span={8}>
            <InputSelect
              label="Level of study"
              name="level_of_study"
              size="large"
              options={[
                { value: "HIGHER_SECONDARY", label: "Higher Secondary" },
                { value: "UNDERGRADUATE", label: "Undergraduate" },
                { value: "GRADUATE", label: "Graduate" },
                { value: "DOCTORAL", label: "Doctoral" },
              ]}
            />
          </Col>



          <Col span={8}>
            <InputString label="Programme" name="programme" placeHolder="Enter Programme" />
          </Col>

          <Col span={8}>
            <InputSelect
              label="Intake"
              name="intake"
              size="large"
              options={[
                { value: "12", label: "12" },
                { value: "10", label: "10" },
                { value: "graduate", label: "Graduate" },
              ]}
            />
          </Col>
          <Col span={8}>
            <InputSelect
              label="location"
              name="location"
              size="large"
              type="country"
            />
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
  );
};

export default AcademicInterest;
