// import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import { axiosInstance } from "@/app/configs/axios";
import { Col, Form, Row, Radio, message, Skeleton, FormInstance } from "antd";
import React, { useEffect } from "react";


interface TravelHistoryFormValues {
  applied_for_stay_permission?: boolean;
  form?: FormInstance;
  studentsData?: Student | null;
  loading?: boolean;
  refetch?: () => void;
}

const TravelHistory: React.FC<TravelHistoryFormValues> = ({ form, studentsData, loading }) => {

  // const { studentsData, loading } = useGetByIdStudents();

  useEffect(() => {
    if (studentsData) {
      localStorage.setItem('studentId', studentsData?.id.toString());
      form?.setFieldsValue({
        applied_for_stay_permission: studentsData.travel_immigration?.stay_permission_in_specific_countries ?? false,
      });
    }
  }, [studentsData])

  const handleFinish = (values: TravelHistoryFormValues) => {
    console.log("Travel History Form Values:", values);
  };

  const handleRadioChange = (value: boolean) => {
    form?.setFieldsValue({ applied_for_stay_permission: value });

    submitData({ applied_for_stay_permission: value })

    console.log(value, "fadsjklfj");
  };

  const submitData = async (values: TravelHistoryFormValues) => {
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
        <FormTitle title="Travel History" />
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
      <FormTitle title="Travel History" />
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
          <Col span={24}>
            <Form.Item
              name="applied_for_stay_permission"
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

export default TravelHistory;