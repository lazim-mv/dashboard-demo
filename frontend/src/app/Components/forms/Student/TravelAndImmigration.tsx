import React, { useState } from "react";
import { Button, Form, message, Row } from "antd";
import TravelHistory from "./travelAndImmigration/TravelHistory";
import ImmigrationHistory from "./travelAndImmigration/Immigration history";
import VisaRejection from "./travelAndImmigration/VisaRejection";
import HealthDetails from "./travelAndImmigration/HealthDetails";
import Comments from "./personalInformation/Comments";
import { axiosInstance } from "@/app/configs/axios";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";

type TravelImmigrationProp = {
  goToNextTab: () => void;
  studentsData: Student | null;
  loading: boolean;
  refetch?: () => void;
};

const TravelAndImmigration: React.FC<TravelImmigrationProp> = ({
  goToNextTab,
  studentsData,
  loading,
  refetch,
}) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [TravelHistoryForm] = Form.useForm();
  const [ImmigrationHistoryForm] = Form.useForm();
  const [VisaRejectionForm] = Form.useForm();
  const [HealthDetailstForm] = Form.useForm();
  const [commentsForm] = Form.useForm();

  const handleContinue = async () => {


    try {
      setButtonLoading(true);
      const TravelHistoryValues = await TravelHistoryForm.validateFields();
      const ImmigrationHistoryValues = await ImmigrationHistoryForm.validateFields();
      const VisaRejectionValues = await VisaRejectionForm.validateFields();
      const HealthDetailsValues = await HealthDetailstForm.validateFields();
      const commentsValues = await commentsForm.validateFields();

      const allValues = {
        ...TravelHistoryValues,
        ...ImmigrationHistoryValues,
        ...VisaRejectionValues,
        ...HealthDetailsValues,
        ...commentsValues,
      };

      console.log("All Form Values:", allValues, TravelHistoryValues);

      const studentId = localStorage.getItem("studentId");
      const payload = {
        comment: commentsValues.comment,
        tab_status: "TRAVEL_IMMIGRATION"
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
      <TravelHistory form={TravelHistoryForm} loading={loading} studentsData={studentsData} refetch={refetch} />
      <ImmigrationHistory form={ImmigrationHistoryForm} loading={loading} studentsData={studentsData} refetch={refetch} />
      <VisaRejection form={VisaRejectionForm} loading={loading} studentsData={studentsData} refetch={refetch} />
      <HealthDetails form={HealthDetailstForm} loading={loading} studentsData={studentsData} refetch={refetch} />
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

export default TravelAndImmigration;
