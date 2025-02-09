// import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import { axiosInstance } from "@/app/configs/axios"; import { Col, Form, FormInstance, message, Radio, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";

type FormProps = {
  form: FormInstance;
  studentsData?: Student | null;
  loading?: boolean;
  refetch?: () => void;
};

interface VisaRejectionData {
  visa_rejections: boolean;
}


const VisaRejection: React.FC<FormProps> = ({ form, studentsData,loading }) => {
  const [visaRejection, setVisaRejection] = useState<boolean | null>(null);


  // const { studentsData, loading } = useGetByIdStudents();

  useEffect(() => {
    if (studentsData) {
      localStorage.setItem('studentId', studentsData?.id.toString());
      const hasVisaRejection = studentsData.travel_immigration?.visa_rejections_for_any_countries ?? false;
      form.setFieldsValue({
        visa_rejections: studentsData.travel_immigration?.visa_rejections_for_any_countries ?? false,
      });
      setVisaRejection(hasVisaRejection);
    }
  }, [studentsData])

  console.log(visaRejection);

  const handleFinish = (values: string) => {
    console.log("Form Values Emergency contact values:", values);
  };

  const handleRadioChange = (value: boolean) => {
    setVisaRejection(value);
    form.setFieldsValue({ visa_rejections: value });

    submitData({ visa_rejections: value });
  };

  const submitData = async (values: VisaRejectionData) => {
    try {
      const studentId = localStorage.getItem("studentId");

      const response = await axiosInstance.post(`/students/${studentId}/travel-visa-health`, values)
      if (response.status === 201) {
        console.log(response, "address Response");
        message.success("Health details saved successfully");
      } else {
        message.error("Something went wrong, please try again later")
      }

    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return (
      <BorderContainer>
        <FormTitle title="Visa rejections" />
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
      <FormTitle title="Visa rejections" />
      <Form
        form={form}
        layout="vertical"
        className="formStyles"
        onFinish={handleFinish}
      >
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <span style={{ fontWeight: "500", fontSize: "16px" }}>
              For any country has this student ever been refused permission to
              stay or remain, refused asylum or deported?
            </span>
          </Col>
          <Col style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="visa_rejections"
              rules={[{ required: true, message: 'Please select an option' }]}
            >
              <Radio.Group
                onChange={(e) => handleRadioChange(e.target.value)}
                size="large"
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </BorderContainer>
  );
};

export default VisaRejection;
