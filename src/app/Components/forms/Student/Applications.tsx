import React from "react";
import ApplicationTable from "./application/ApplicationTable";
// import Comments from "./personalInformation/Comments";
import { Button, Row } from "antd";

type StudentDetailsProps = {
  goToNextTab: () => void;
};



const Applications: React.FC<StudentDetailsProps> = ({ goToNextTab }) => {

  const handleContinue = () => {
    goToNextTab();
  };

  return (
    <>
      <ApplicationTable />
      {/* <Comments form={commentsForm} /> */}
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

export default Applications;
