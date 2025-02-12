"use client";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import Uploader from "@/app/Components/form/Uploader";
import { Button, Col, Form, Row, message } from "antd";
import React, { useState } from "react";
import type { UploadFile } from "antd";
import { axiosInstance } from "@/app/configs/axios";
import { useRouter } from "next/navigation";

interface FileState {
  [key: string]: UploadFile[];
}

const Onboarding = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<FileState>({});
  const [isLoading, setIsLoading] = useState(false);



  const handleFileChange = (files: UploadFile[], key: string) => {
    setFileList(prev => ({
      ...prev,
      [key]: files
    }));
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();


      Object.entries(fileList).forEach(([key, files]) => {
        if (files && files[0]?.originFileObj) {
          formData.append(key, files[0].originFileObj);
        }
      });

      const response = await axiosInstance.post("/partners/upload-docs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 201) {
        throw new Error('Upload failed');
      }

      if (response.status === 201) {
        router.push("/onboarding/underreview")
        message.success('All documents uploaded successfully');
      }

      console.log('Uploaded files:', fileList);

    } catch (error) {
      message.error('Failed to upload documents');
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginFormStyles">
      <BorderContainer>
        <FormTitle
          title="Documents"
          bg="transparent"
          borderBottom="1px solid #F0F0F0"
        />
        <Form
          form={form}
          layout="vertical"
          className="formStyles"
          onFinish={handleFinish}
        >
          <Row gutter={[16, 16]} style={{ width: "100%" }}>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentName="Pan Card"
                restrainMessage="Maximum file size is 700KB"
                uploadItemsCount={1}
                documentKey="pan_card"
                onChange={handleFileChange}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentName="Cancelled Cheque"
                restrainMessage="Maximum file size is 700KB"
                uploadItemsCount={1}
                documentKey="cancelled_cheque"
                onChange={handleFileChange}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentName="GST/ Spice Letter"
                restrainMessage="Maximum file size is 700KB"
                uploadItemsCount={1}
                documentKey="gst_letter"
                onChange={handleFileChange}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }} justify="end">
            <Button size="large" shape="round" type="primary" htmlType="submit" loading={isLoading}
              disabled={isLoading}>
              {isLoading ? "Uploading" : "Submit"}
            </Button>
          </Row>
        </Form>
      </BorderContainer>
    </div>
  );
};

export default Onboarding;