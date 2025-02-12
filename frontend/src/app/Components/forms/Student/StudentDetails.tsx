import React, { useState } from "react";
import PersonalInformation from "./personalInformation/PersonalInformation";
import CurrentAddress from "./personalInformation/CurrentAddress";
import EmergencyContactDetails from "./personalInformation/EmergencyContactDetails";
import Comments from "./personalInformation/Comments";
import { Button, Row, Form, message } from "antd";
import { axiosInstance } from "@/app/configs/axios";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";

type StudentDetailsProps = {
  goToNextTab: () => void;
  studentsData: Student | null;
  loading: boolean;
  refetch?: () => void;
};

const StudentDetails: React.FC<StudentDetailsProps> = ({ goToNextTab, studentsData, loading, refetch }) => {
  const [permanentAddressForm] = Form.useForm();
  const [personalInfoForm] = Form.useForm();
  const [currentAddressForm] = Form.useForm();
  const [emergencyContactForm] = Form.useForm();
  const [commentsForm] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);


  // const { studentsData, loading } = useGetByIdStudents();


  const handleContinue = async () => {
    try {
      setButtonLoading(true);
      const personalInfoValues = await personalInfoForm.validateFields();
      const permanentAddressValues = await permanentAddressForm.validateFields();
      const emergencyContactValues = await emergencyContactForm.validateFields();
      const currentAddressValues = await currentAddressForm.validateFields();
      const commentsValues = await commentsForm.validateFields();

      const allValues = {
        ...(personalInfoValues && { personalInfo: personalInfoValues }),
        ...(permanentAddressValues && { permanentAdsress: permanentAddressValues }),
        ...(emergencyContactValues && { emergencyContact: emergencyContactValues }),
        ...(currentAddressValues && { currentAddress: currentAddressValues }),
        ...(commentsValues && { comments: commentsValues.comment }),
      };

      console.log(allValues, "fdklsafjkl");

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
      <PersonalInformation form={personalInfoForm} studentsData={studentsData} loading={loading} refetch={refetch} />
      <CurrentAddress form={currentAddressForm} studentsData={studentsData} loading={loading} />
      <EmergencyContactDetails form={emergencyContactForm} studentsData={studentsData} loading={loading} refetch={refetch} />
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

export default StudentDetails;
