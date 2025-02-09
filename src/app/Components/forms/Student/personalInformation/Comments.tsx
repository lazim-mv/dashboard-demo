import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import InputString from "@/app/Components/form/InputString";
import { Col, Form, FormInstance, Row } from "antd";
import React from "react";

type FormProps = {
  form: FormInstance;
};

const Comments: React.FC<FormProps> = ({ form }) => {
  //   const [form] = Form.useForm();

  const handleFinish = (values: string) => {
    console.log("Form Values:", values);
  };

  return (
    <>
      <BorderContainer>
        <FormTitle title="Comments" />
        <Form
          form={form}
          layout="vertical"
          className="formStyles"
          onFinish={handleFinish}
        >
          <Row gutter={[24, 16]}>
            <Col span={24}>
              <InputString label="Comments" name="comment" placeHolder="Enter Remarks" />
            </Col>
          </Row>
        </Form>
      </BorderContainer>
    </>
  );
};

export default Comments;
