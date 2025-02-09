import { Button, Form, message, Row } from "antd";
import { useState } from "react";
import RecentGraduate from "./educationDetails/RecentGraduate";
import AcademicInterest from "./educationDetails/AcademicInterest";
import LanguageProficiency from "./educationDetails/LanguageProficiency";
import Comments from "./personalInformation/Comments";
import { axiosInstance } from "@/app/configs/axios";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";

type EducationProps = {
  goToNextTab: () => void;
  studentsData: Student | null;
  loading: boolean;
  refetch?: () => void;
};

const Education: React.FC<EducationProps> = ({ goToNextTab, studentsData, loading, refetch }) => {
  const [RecentGraduateForm] = Form.useForm();
  const [LanguageProficiencyForm] = Form.useForm();
  const [AcademicInterestForm] = Form.useForm();
  const [commentsForm] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setButtonLoading(true);
      const RecentGraduateValues = await RecentGraduateForm.validateFields();
      const AcademicInterestValues = await AcademicInterestForm.validateFields();
      const LanguageProficiencyValues = await LanguageProficiencyForm.validateFields();
      const commentsValues = await commentsForm.validateFields();
      const allValues = {
        ...(RecentGraduateValues && { recentGraduate: RecentGraduateValues }),
        ...(AcademicInterestValues && { academicInterest: AcademicInterestValues }),
        ...(LanguageProficiencyValues && { languageProficiency: LanguageProficiencyValues }),
        ...(commentsValues && { comments: commentsValues.comment }),
      };

      // AcademicInterestForm.submit();


      console.log(allValues, "fdkslafjkls");
      const studentId = localStorage.getItem("studentId");
      const payload = {
        comment: commentsValues.comment,
        tab_status: "EDUCATION"
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
      <RecentGraduate form={RecentGraduateForm} loading={loading} studentsData={studentsData} refetch={refetch} />
      <AcademicInterest form={AcademicInterestForm} loading={loading} studentsData={studentsData} refetch={refetch} />
      <LanguageProficiency form={LanguageProficiencyForm} loading={loading} studentsData={studentsData} refetch={refetch} />
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

export default Education;
