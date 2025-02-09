import React from "react";
import { Button, Form, Row } from "antd";
import Comments from "./personalInformation/Comments";
import SearchComponent from "@/app/(pages)/courses/coursesearch/components/SearchComponent";
// import CourseSearch from "./shortlistandApply/CourseSearch";

type StudentDetailsProps = {
  goToNextTab: () => void;
};

const ShortlistAndApply: React.FC<StudentDetailsProps> = ({ goToNextTab }) => {
  const [workDetailsInfoForm] = Form.useForm();
  const [commentsForm] = Form.useForm();

  const handleContinue = () => {
    const workDetailsInfoValues = workDetailsInfoForm.getFieldsValue();
    const commentsValues = commentsForm.getFieldsValue();

    const allValues = {
      ...workDetailsInfoValues,
      ...commentsValues,
    };

    console.log("All Form Values:", allValues);
    goToNextTab();
  };
  return (
    <>
      <SearchComponent page={true} />
      <Comments form={commentsForm} />
      <Row justify="end" style={{ marginTop: "24px" }}>
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={handleContinue}
        >
          Continue to next section
        </Button>
      </Row>
    </>
  );
};

export default ShortlistAndApply;
