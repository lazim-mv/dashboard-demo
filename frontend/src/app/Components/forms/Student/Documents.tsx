import React, { useState } from "react";
import { Button, Form, message, Row } from "antd";
import DocumentsForm from "./documentsForm/DocumentsForm";
import Comments from "./personalInformation/Comments";
import { axiosInstance } from "@/app/configs/axios";

type StudentDetailsProps = {
  goToNextTab: () => void;
};

const Documents: React.FC<StudentDetailsProps> = ({ goToNextTab }) => {
  // const [workDetailsInfoForm] = Form.useForm();
  const [commentsForm] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);


  const handleContinue = async () => {
    try {
      setButtonLoading(true);
      // const workDetailsInfoValues = await workDetailsInfoForm.validateFields();
      const commentsValues = await commentsForm.validateFields();

      const allValues = {
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
        message.success("Document details saved successfully");
        goToNextTab();
      } else {
        message.error("Error while saving document details")
      }

    } catch (error) {
      console.log(error);
      message.error("Please upload all required fields");
    } finally {
      setButtonLoading(false);
    }
  };
  return (
    <>
      <DocumentsForm />
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

export default Documents;
