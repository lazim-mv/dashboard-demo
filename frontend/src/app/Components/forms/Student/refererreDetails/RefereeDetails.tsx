import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import InputString from "@/app/Components/form/InputString";
import { Button, Col, Form, FormInstance, Row, Skeleton, message } from "antd";
import React, { useEffect, useState } from "react";
import type { RefereeDetailsFormValues } from "./types/types";
import { FaCirclePlus } from "react-icons/fa6";
import { IoRemoveCircle, IoTrashOutline } from "react-icons/io5";
// import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";
import { axiosInstance } from "@/app/configs/axios";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";
import ActionButton from "@/app/Components/common/ActionButton";

interface referee_details {
  id?: string; // Added optional id field
  name: string;
  email: string;
  address: string;
  position: string;
  mobile_no: string;
}

interface FormData {
  referee_details?: referee_details[];
  form?: FormInstance;
  studentsData?: Student | null;
  loading?: boolean;
  refetch?: () => void;
}

const RefereeDetails: React.FC<FormData> = ({ form, studentsData, loading, refetch }) => {
  const [formCount, setFormCount] = useState(1);
  const [existingReferees, setExistingReferees] = useState<referee_details[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);

  // const { studentsData, loading, refetch } = useGetByIdStudents();

  useEffect(() => {
    if (studentsData && studentsData.referee_details && studentsData.referee_details.length > 0) {
      setExistingReferees(studentsData.referee_details.map(ref => ({
        id: ref.id.toString(),
        name: ref.name,
        email: ref.email,
        address: ref.address,
        position: ref.position,
        mobile_no: ref.mobile_no
      })));

      setFormCount(studentsData.referee_details.length);
      const fieldsToSet: Record<string, string> = {};

      studentsData.referee_details.forEach((referee, index) => {
        const indexSuffix = index > 0 ? index : '';

        fieldsToSet[`name${indexSuffix}`] = referee.name;
        fieldsToSet[`position${indexSuffix}`] = referee.position;
        fieldsToSet[`email${indexSuffix}`] = referee.email;
        fieldsToSet[`mobile_no${indexSuffix}`] = referee.mobile_no;
        fieldsToSet[`address${indexSuffix}`] = referee.address;
      });
      form?.setFieldsValue(fieldsToSet);
    }
  }, [studentsData]);

  const handleAddNew = () => {
    setFormCount(prevCount => prevCount + 1);
  };

  const handleRemoveItem = () => {
    if (formCount === 1) return;
    setFormCount(prevCount => prevCount - 1);
  };

  const handleDeleteReferee = async (index: number) => {
    try {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        message.error("Student ID not found");
        return;
      }

      const refereeId = existingReferees[index]?.id;

      if (refereeId) {
        const response = await axiosInstance.delete(`/students/${studentId}/referee/${refereeId}`);

        if (response.status === 200) {
          setExistingReferees(prev => prev.filter(referee => referee.id !== refereeId));
          setFormCount(prev => Math.max(1, prev - 1));
          message.success("Referee deleted successfully");
          if (refetch) {
            refetch()
          }
        } else {
          message.error("Failed to delete referee");
        }
      }
    } catch (error) {
      console.error("Error deleting referee:", error);
      message.error("An error occurred while deleting the referee");
    }
  };

  const handleFinish = async (values: RefereeDetailsFormValues) => {
    console.log("Form Values Referee details:", values);
    try {
      setButtonLoading(true);
      const transformedData: FormData = {
        referee_details: []
      };

      for (let i = existingReferees.length; i < formCount; i++) {
        transformedData?.referee_details?.push({
          name: values[`name${i > 0 ? i : ''}`],
          position: values[`position${i > 0 ? i : ''}`],
          email: values[`email${i > 0 ? i : ''}`],
          mobile_no: values[`mobile_no${i > 0 ? i : ''}`],
          address: values[`address${i > 0 ? i : ''}`]
        });
      }

      console.log(transformedData, "transformedData");

      const studentId = localStorage.getItem("studentId");
      const response = await axiosInstance.post(`/students/${studentId}/referee`, transformedData)
      if (response.status === 201) {
        message.success("Referee details saved successfully");
        if (refetch) {
          refetch();
        }
      } else {
        message.error("Failed to save referee details")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading) {
    return (
      <BorderContainer>
        <FormTitle title="Referee Details" />
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
      <FormTitle title="Referee Details" />
      <Form
        form={form}
        layout="vertical"
        className="formStyles"
        onFinish={handleFinish}
      >
        {[...Array(formCount)].map((_, index) => (
          <div key={index} style={{
            marginBottom: '24px',
            border: '1px solid #d9d9d9',
            padding: '16px',
            borderRadius: '8px',
            position: 'relative'
          }}>
            {existingReferees[index] && existingReferees[index].id && (
              <Button
                type="text"
                icon={<IoTrashOutline size={20} color="#FF4848" />}
                onClick={() => handleDeleteReferee(index)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  zIndex: 10
                }}
                title="Delete Referee"
              />
            )}
            <Row gutter={[24, 16]}>
              <Col span={8}>
                <InputString label="Name" name={`name${index > 0 ? index : ''}`} placeHolder="Enter Name" />
              </Col>
              <Col span={8}>
                <InputString label="Position" name={`position${index > 0 ? index : ''}`} placeHolder="Enter Position" />
              </Col>
              <Col span={8}>
                <InputString label="Work Email" name={`email${index > 0 ? index : ''}`} placeHolder="Enter Work Email" />
              </Col>
              <Col span={8}>
                <InputString label="Mobile Number" name={`mobile_no${index > 0 ? index : ''}`} placeHolder="Enter Mobile Number" />
              </Col>
              <Col span={8}>
                <InputString label="Address" name={`address${index > 0 ? index : ''}`} placeHolder="Enter Address" />
              </Col>
            </Row>
          </div>
        ))}

        <Row justify="space-between" style={{ marginTop: "24px" }} align="middle">
          <Row>
            <Button
              onClick={handleAddNew}
              icon={<FaCirclePlus size={25} color="#4880FF" />}
              type="text"
              size="large"
              shape="round"
            >
              Add New
            </Button>
            {formCount > 1 && studentsData === null &&
              <Button
                icon={<IoRemoveCircle size={25} color="#FF4848" />}
                onClick={handleRemoveItem}
                type="text"
                size="large"
                shape="round"
              >
                Remove
              </Button>
            }
          </Row>
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

export default RefereeDetails;