import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import Uploader from "@/app/Components/form/Uploader";
import { axiosInstance } from "@/app/configs/axios";
import { Col, Form, message, Row, UploadFile } from "antd";
// import Uploader from "@/app/Components/form/Uploader";
// import { Form } from "antd";
import React, { useEffect, useState } from "react";


interface FileState {
  [key: string]: UploadFile[];
}

const DocumentsForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<FileState>({});
  const [previewImages, setPreviewImages] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadPreviewImages();
  }, [])

  const loadPreviewImages = async () => {
    try {
      const studentId = localStorage.getItem("studentId") || '';
      if (!studentId) {
        message.error('Student ID is missing. Please log in again.');
        return;
      }

      const response = await axiosInstance.get(`/students/${studentId}/docs`)

      if (response.status === 200) {
        setPreviewImages(response.data.data)
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleFileChange = async (files: UploadFile[], key: string) => {
    setLoading(true);
    console.log(fileList);
    console.log("Uploader onChange called for key:", key);

    try {
      if (!files || files.length === 0) {
        message.warning('Please select a file');
        return;
      }

      const studentId = localStorage.getItem("studentId") || '';
      if (!studentId) {
        message.error('Student ID is missing. Please log in again.');
        return;
      }

      setFileList(prev => ({
        ...prev,
        [key]: files
      }));

      const formData = new FormData();
      const file = files[0]?.originFileObj;

      if (!file) {
        message.warning('Invalid file selected');
        return;
      }



      const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
      if (file.size > MAX_FILE_SIZE) {
        message.error(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        return;
      }


      formData.append("file", file);




      const response = await axiosInstance.post(
        `/students/${studentId}/upload?file_name=${encodeURIComponent(key)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // onUploadProgress: (progressEvent) => {
          //   const percentCompleted = Math.round(
          //     (progressEvent.loaded * 100) / progressEvent.total
          //   );
          //   // You could update a progress state here if needed
          //   console.log(`Upload progress: ${percentCompleted}%`);
          // }
        }
      );

      if (response.status === 201) {
        message.success(`${key} uploaded successfully`);
        setLoading(false)
      } else {
        message.error(`Error uploading ${key}. Please try again later`);
        setLoading(false)

      }
      return response.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);

    }
  }

  // console.log(fileList, "fileListForm");

  return (
    <>
      <BorderContainer>
        <FormTitle title="Documents" />
        <Form
          form={form}
          layout="vertical"
          className="formStyles"
        //   onFinish={handleFinish}
        >
          <p>
            Please upload a copy of the student&apos;s original documents.
            Accepted formats are PDF, DOC, DOCX, PNG, JPEG, and JPG. Maximum
            file size is 5MB.
          </p>
          <Row gutter={[16, 16]} style={{ width: "100%" }}>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentName="Photo"
                restrainMessage="Maximum file size is 5MB"
                uploadItemsCount={1}
                documentKey="photo"
                onChange={handleFileChange}
                existingDocumentUrl={previewImages?.photo}
                loading={loading}
              />

            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="passport"
                onChange={handleFileChange}
                documentName="Passport"
                restrainMessage="Maximum file size is 700KB"
                uploadItemsCount={1}
                existingDocumentUrl={previewImages?.passport}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="pg"
                onChange={handleFileChange}
                documentName="PG"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.pg}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="pg_marksheet"
                onChange={handleFileChange}
                documentName="PG Marksheet"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.pg_marksheet}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="ug"
                onChange={handleFileChange}
                documentName="UG"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.ug}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="ug_marksheet"
                onChange={handleFileChange}
                documentName="UG Marksheet"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.ug_marksheet}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="higher_sec"
                onChange={handleFileChange}
                documentName="12th"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.higher_sec}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="tenth"
                onChange={handleFileChange}
                documentName="10th"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.tenth}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="lor"
                onChange={handleFileChange}
                documentName="LOR"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.lor}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="moi"
                onChange={handleFileChange}
                documentName="MOI"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.moi}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="cv"
                onChange={handleFileChange}
                documentName="CV"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.cv}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="exp_cert"
                onChange={handleFileChange}
                documentName="Experience Certificate"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.exp_cert}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="sop"
                onChange={handleFileChange}
                documentName="SOP"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.sop}
              />
            </Col>
            {/* <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="other_diploma_cert"
                onChange={handleFileChange}
                documentName="Photo"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
              />
            </Col> */}
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="other_diploma_cert"
                onChange={handleFileChange}
                documentName="Other Certificate of Diplomas"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.other_diploma_cert}
              />
            </Col>
            <Col style={{ width: "100%" }}>
              <Uploader
                documentKey="others"
                onChange={handleFileChange}
                documentName="Others"
                restrainMessage="Maximum number of documents allowed is two (2)"
                uploadItemsCount={2}
                existingDocumentUrl={previewImages?.others}
              />
            </Col>
          </Row>
        </Form>
      </BorderContainer>
    </>
  );
};

export default DocumentsForm;
