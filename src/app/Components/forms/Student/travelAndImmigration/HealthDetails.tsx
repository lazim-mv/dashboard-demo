// import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import InputString from "@/app/Components/form/InputString";
import { axiosInstance } from "@/app/configs/axios";
import { Button, Col, Form, FormInstance, message, Radio, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";

type FormProps = {
  form: FormInstance;
  studentsData?: Student | null;
  loading?: boolean;
  refetch?: () => void;
};

interface healthInfo {
  health_issue: boolean;
  health_issue_details: string;
}

const HealthDetails: React.FC<FormProps> = ({ form, studentsData, loading }) => {
  const [hasHealthIssue, setHasHealthIssue] = useState<boolean | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);

  // const { studentsData, loading } = useGetByIdStudents();

  console.log(studentId, "studentsData");

  useEffect(() => {
    if (studentsData) {
      setStudentId(studentsData?.id);
      localStorage.setItem('studentId', studentsData?.id.toString());
      const hasHealthIssues = studentsData.travel_immigration?.has_health_issues ?? false;
      form.setFieldsValue({
        health_issue: studentsData.travel_immigration?.has_health_issues ?? false,
        health_issue_details: studentsData.travel_immigration?.health_issue_details ?? ""
      });
      setHasHealthIssue(hasHealthIssues);
    }
  }, [studentsData])


  const handleFinish = (values: healthInfo) => {
    console.log("Form Values Emergency contact values:", values);
    submitData(values)
  };

  const handleRadioChange = (value: boolean) => {
    setHasHealthIssue(value);
    form.setFieldsValue({ health_issue: value });

    if (!value) {
      submitData({ health_issue: false, health_issue_details: "" });
    }
  };

  const submitData = async (values: healthInfo) => {
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
        <FormTitle title="Health Details Info" />
        <div style={{ padding: '24px' }}>
          <Skeleton
            active
            paragraph={{ rows: 4 }}
            title={{ width: '30%' }}
          />
        </div>
      </BorderContainer>
    )
  }

  return (
    <BorderContainer>
      <FormTitle title="Health Details Info" />
      <Form
        form={form}
        layout="vertical"
        className="formStyles"
        onFinish={handleFinish}
      >
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <span style={{ fontWeight: "500", fontSize: "16px" }}>
              Lorem ipsum dolor sit amet sectetur adipiscing diam faucibus
              volutpat?
            </span>
          </Col>
          <Col span={24} style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="health_issue"
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
          {hasHealthIssue &&
            <Col span={24}>
              <InputString label="Details" name="health_issue_details" />
            </Col>
          }
        </Row>
        {hasHealthIssue &&
          <Row justify="end" style={{ marginTop: "24px" }}>
            <Button htmlType="submit" type="primary" shape="round" size="large">Save</Button>
          </Row>
        }
      </Form>
    </BorderContainer>
  );
};

export default HealthDetails;
