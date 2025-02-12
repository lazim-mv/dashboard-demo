"use client"
import FormTitle from "@/app/Components/common/FormTitle";
import InputSelect from "@/app/Components/form/InputSelect";
import InputString from "@/app/Components/form/InputString";
import { axiosInstance } from "@/app/configs/axios";

import { Form, Input, Button, Row, Col, message, UploadFile } from "antd";
import React, { useState } from "react";
import UploadComponent from "../components/UploadComponent";

interface UserFormValues {
    university_name: string;
    country: string;
    location: string;
    description: string;
}


interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}


const Page: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm<UserFormValues>();
    // const [uploaded, setUploaded] = useState<UploadFile[] | null>(null);
    const [imageUploadId, setImageUploadId] = useState<number | null>(null);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [fileList, setFileList] = useState<{
        university_logo?: UploadFile[];
        university_document?: UploadFile[];
    }>({
        university_logo: [],
        university_document: [],
    });

    console.log(selectedState);

    console.log(imageUploadId);

    // const handleUpload = (files: UploadFile[], type: 'university_logo' | 'university_document') => {
    //     console.log('Handle Upload:', {
    //         files,
    //         type
    //     });

    //     setFileList(prev => {
    //         const updated = {
    //             ...prev,
    //             [type]: files
    //         };
    //         console.log('Updated FileList:', updated);
    //         return updated;
    //     });
    // };


    const uploadFiles = async (universityId: string) => {
        try {
            const formData = new FormData();
            console.log("uploadfjkdlasjfklasjfkl");

            // Add university logo if exists
            if (fileList.university_logo && fileList.university_logo.length > 0) {
                const logoFile = fileList.university_logo[0].originFileObj || fileList.university_logo[0];
                if (logoFile instanceof File) {
                    formData.append('university_logo', logoFile);
                }
            }

            console.log(fileList, "fjkdaslfjkl");
            console.log(formData, "uploadfjkdlasjfklasjfkl");


            // Add university document if exists
            if (fileList.university_document && fileList.university_document.length > 0) {
                const documentFile = fileList.university_document[0].originFileObj || fileList.university_document[0];
                if (documentFile instanceof File) {
                    formData.append('university_document', documentFile);
                }
            }

            // Log FormData contents for debugging
            for (const [key, value] of formData.entries()) {
                console.log(`FormData Entry - ${key}:`, value);
            }

            // Check if there are any files to upload
            if (formData.keys().next().done) {
                console.warn('No files to upload');
                return;
            }

            console.log(formData, "formDataaa");

            // Send the files to the specific university upload endpoint
            const response = await axiosInstance.post(`/university/upload-docs/${universityId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                message.success("Files uploaded successfully");
                return response;
            }
        } catch (error) {
            console.error("Error uploading files:", error);
            message.error("Failed to upload files");
        }
    };

    const onFinish = async (values: UserFormValues) => {
        if (imageUploadId === null) {
            try {
                setLoading(true);
                const response = await axiosInstance.post("/university", values);

                if (response.data && response.status === 201) {
                    console.log(response, "jfldksajfklsa");
                    message.success("University created successfully");
                    setImageUploadId(response.data.data.id)
                    await uploadFiles(response.data.data.id);
                    // form.resetFields();
                }
            } catch (error: unknown) {
                const apiError = error as ApiError;
                message.error(apiError.response?.data?.message || "Failed to create university");
            } finally {
                setLoading(false);
            }
        } else {
            console.log(imageUploadId, "imageUploadId");
            uploadFiles(String(imageUploadId));
        }
    };




    return (
        <>
            <FormTitle title='Add New University' bg='#fff' borderBottom='1px solid #F0F0F0' />
            <Form
                form={form}
                name="add_user"
                layout="vertical"
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                style={{
                    background: "#fff",
                    padding: "40px",
                }}
            >
                <Row gutter={[24, 24]}>
                    <Col span={8}>
                        <Form.Item
                            layout="vertical"
                            label={<span style={{ fontWeight: "500" }}>University Name</span>}
                            name="university_name"
                            rules={[{ required: true, message: "Please enter the university name!" }]}
                        >
                            <Input size="large" placeholder="Enter name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <InputSelect label="Country"
                            name="country"
                            size="large"
                            type="country"
                            onCountryChange={setSelectedCountry}
                        />
                    </Col>
                    <Col span={8}>
                        <InputSelect
                            label="State/Province"
                            name="location"
                            type="state"
                            selectedCountry={selectedCountry}
                            onStateChange={setSelectedState}
                        />
                    </Col>
                    {/* <Col span={8}>
                        <InputSelect
                            label="City"
                            name="city"
                            type="city"
                            selectedCountry={selectedCountry}
                            selectedState={selectedState}
                        />
                    </Col> */}
                    <Col span={24}>
                        <InputString name="description" label="Description" placeHolder="Enter description" />
                    </Col>
                    <Col span={24}>
                        {/* Add upload ui */}
                        <Row>
                            <Col span={6}>
                                <UploadComponent
                                    handleUpload={(files, fieldName) => {
                                        setFileList((prevState) => {
                                            return {
                                                ...prevState,
                                                [fieldName]: files,
                                            };
                                        });
                                    }}
                                    fieldName="university_logo"
                                    label="Upload University Logo"
                                    acceptedFileTypes="image/*"
                                />
                            </Col>
                            <Col span={6}>
                                <UploadComponent
                                    handleUpload={(files, fieldName) => {
                                        console.log('Files:', files);
                                        console.log('Field Name:', fieldName);
                                        setFileList(prevState => ({
                                            ...prevState,
                                            [fieldName]: files
                                        }));
                                    }}
                                    fieldName="university_document"
                                    label="Upload University Doc"
                                    acceptedFileTypes="pdf/*"
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Row justify="end">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    size="large"
                                    shape="round"
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Page;