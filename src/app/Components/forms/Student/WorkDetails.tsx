import React, { useState } from "react";
import { Button, Form, message, Row } from "antd";
import Comments from "./personalInformation/Comments";
import WorkDetailsInfo from "./workDetails/WorkDetailsInfo";
import { axiosInstance } from "@/app/configs/axios";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";

type StudentDetailsProps = {
  goToNextTab: () => void;
  studentsData?: Student | null;
  loading?: boolean;
  refetch?: () => void;
};

const WorkDetails: React.FC<StudentDetailsProps> = ({ goToNextTab, studentsData, loading, refetch }) => {
  const [workDetailsInfoForm] = Form.useForm();
  const [commentsForm] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);



  const handleContinue = async () => {
    try {
      setButtonLoading(true);
      const workDetailsInfoValues = await workDetailsInfoForm.validateFields();
      const commentsValues = await commentsForm.validateFields();

      const allValues = {
        ...workDetailsInfoValues,
        ...commentsValues,
      };

      console.log("All Form Values:", allValues);
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
      <WorkDetailsInfo form={workDetailsInfoForm} studentsData={studentsData} loading={loading} refetch={refetch} />
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

export default WorkDetails;
