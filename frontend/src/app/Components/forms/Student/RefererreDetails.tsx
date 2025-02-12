import React, { useState } from "react";
import RefereeDetails from "./refererreDetails/RefereeDetails";
import { Button, Form, message, Row } from "antd";
import Comments from "./personalInformation/Comments";
import { axiosInstance } from "@/app/configs/axios";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";

type RefererreDetailsProps = {
  goToNextTab: () => void;
  studentsData: Student | null;
  loading: boolean;
  refetch?: () => void;
};

const RefererreDetails: React.FC<RefererreDetailsProps> = ({ goToNextTab, studentsData, loading, refetch }) => {
  const [RefereeDetailsForm] = Form.useForm();
  const [commentsForm] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setButtonLoading(true);
      const RefereeDetailsValues = await RefereeDetailsForm.validateFields();
      const commentsValues = await commentsForm.validateFields();

      const allValues = {
        ...RefereeDetailsValues,
        ...commentsValues,
      }

      console.log("All Form Values:", allValues, RefereeDetailsValues);
      const studentId = localStorage.getItem("studentId");
      const payload = {
        comment: commentsValues.comment,
        tab_status: "PERSONAL_DETAILS"
      }
      const response = await axiosInstance.post(`/students/${studentId}/next-tab`, payload)
      if (response.status === 201) {
        message.success("Student details saved successfully");
        goToNextTab();
      } else {
        message.error("Error while saving student details")
      }

    } catch (error) {
      console.log(error);
      message.error("Please fill all required fields");
    } finally {
      setButtonLoading(false);
    }
  };
  return (
    <>
      <RefereeDetails form={RefereeDetailsForm} studentsData={studentsData} loading={loading} refetch={refetch} />
      <Comments form={commentsForm} />
      <Row justify="end" style={{ marginTop: "24px" }}>
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={handleContinue}
          loading={buttonLoading}
        >
          Continue to next section
        </Button>
      </Row>
    </>
  );
};

export default RefererreDetails;
