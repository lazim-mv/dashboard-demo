import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import InputSelect from "@/app/Components/form/InputSelect";
import { Button, Col, Form, Row } from "antd";
import React from "react";
import { BiSearch } from "react-icons/bi";

const CourseSearch = () => {
  // const [form] = Form.useForm();
  return (
    <BorderContainer>
      <FormTitle title="Course Search" />
      <Form
        // ref={formRef}
        layout="vertical"
        className="formStyles"
        // onFinish={(values) => {
        //   handleFormFinish({ ...values, index });
        // }}
        onFinishFailed={(errorInfo) => {
          console.log("Failed:", errorInfo);
        }}
        // initialValues={initialValues}
      >
        <Row gutter={[24, 16]}>
          <Col span={8}>
            <InputSelect label="Country" name="birth_country" size="large" />
          </Col>
          <Col span={8}>
            <InputSelect label="Location" name="location" size="large" />
          </Col>
          <Col span={8}>
            <InputSelect label="Level" name="level" size="large" />
          </Col>
          <Col span={8}>
            <InputSelect label="Subject" name="subject" size="large" />
          </Col>
          <Col span={8}>
            <InputSelect label="University" name="university" size="large" />
          </Col>
          <Col span={8}>
            <InputSelect label="Intake Year" name="intake" size="large" />
          </Col>
        </Row>
        <Row justify={"end"}>
          <Button
            shape="round"
            size="large"
            type="primary"
            icon={<BiSearch color="#fff" />}
          >
            Search
          </Button>
        </Row>
      </Form>
    </BorderContainer>
  );
};

export default CourseSearch;
