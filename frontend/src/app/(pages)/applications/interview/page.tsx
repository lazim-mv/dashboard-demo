import ProcessSteps from "@/app/Components/processsteps/ProcessSteps";
import { Row, Space } from "antd";
import React from "react";
import InterviewComponent from "./components/InterviewComponent";

const page = () => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row gutter={[16, 16]}>
        <ProcessSteps />
        <InterviewComponent />
      </Row>
    </Space>
  );
};

export default page;
