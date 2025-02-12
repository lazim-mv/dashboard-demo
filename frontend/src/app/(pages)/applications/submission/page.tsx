import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
// import ProcessSteps from "@/app/Components/processsteps/ProcessSteps";
import Tab from "@/app/Components/Tabs/Tab";
import { Row } from "antd";
import React from "react";

const page = () => {
  return (
    <BorderContainer mt="0" bg="#fff" pd="20px 24px" brdrRd="8px" >
      <FormTitle fontSize="20px" mb="24px" title="Create" bg="#fff" padding="0 0 20px 0" borderBottom="1px solid #F0F0F0" />
      <Row gutter={[16, 16]}>
        {/* <ProcessSteps />  */}
        <Tab />
      </Row>
    </BorderContainer>
  );
};

export default page;
