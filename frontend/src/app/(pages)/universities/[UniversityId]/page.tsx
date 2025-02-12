"use client"
import FormTitle from "@/app/Components/common/FormTitle";
import InputSelect from "@/app/Components/form/InputSelect";
import InputString from "@/app/Components/form/InputString";
import { axiosInstance } from "@/app/configs/axios"; import { Form, Input, Button, Row, Col, message, UploadFile } from "antd";
import React, { useEffect, useState } from "react";
import useGetByIdUniversity from "../hooks/useGetByIdUniversity";
import FormLoading from "@/app/Components/common/FormLoading";
import UploadComponent from "../components/UploadComponent";
import { useParams } from "next/navigation";
// import UploadComponent from "../components/UploadComponent";

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


interface PageProps {
    params: {
        UniversityId: string;
    }
}

// const Page: React.FC<PageProps> = ({ params }) => {
const Page: React.FC<PageProps> = () => {
    const { UniversityId } = useParams() as { UniversityId: string };
    const { universityData, loading, refetch } = useGetByIdUniversity();
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);
    const [form] = Form.useForm<UserFormValues>();
    // const [uploaded, setUploaded] = useState<UploadFile[] | null>(null);
    const [imageUploadId, setImageUploadId] = useState<number | null>(null);
    const [fileList, setFileList] = useState<{
        university_logo?: UploadFile[];
        university_document?: UploadFile[];
    }>({
        university_logo: [],
        university_document: [],
    });

    console.log(typeof universityData, selectedState, "");

    useEffect(() => {
        if (universityData) {
            setSelectedCountry(universityData.country)
            form.setFieldsValue({
                university_name: universityData.university_name,
                country: universityData.country,
                location: universityData.location,
                description: universityData.description
            })
        }
    }, [universityData])

    // const handleUpload = (files: UploadFile[] | null) => {
    //     setUploaded(files);
    //     console.log('Uploaded files:', files, uploaded);
    // };

    // const handlePreview = (file: UploadFile) => {
    //     console.log('Previewing file:', file);
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
                setFileList({
                    university_logo: [],
                    university_document: [],
                })
                return response;
            }
        } catch (error) {
            console.error("Error uploading files:", error);
            message.error("Failed to upload files");
        }
    };

    const onFinish = async (values: UserFormValues) => {
        try {
            setButtonLoading(true);
            const response = await axiosInstance.patch(`/university/${UniversityId}`, values);

            if (response.data && response.status === 200) {
                message.success("University updated successfully");
                setImageUploadId(response.data.id);
                console.log(imageUploadId);
                await uploadFiles(response.data.data.id);
                form.resetFields();
            }
        } catch (error: unknown) {
            const apiError = error as ApiError;
            message.error(apiError.response?.data?.message || "Failed to update university");
        } finally {
            setButtonLoading(false);
            refetch();
        }
    };




    return (
        <>
            <FormTitle title='Edit University' bg='#fff' borderBottom='1px solid #F0F0F0' />
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
                {loading ? <FormLoading numFields={4} uploadCount={2} /> :
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
                        <Col span={24}>
                            <InputString name="description" label="Description" placeHolder="Enter description" />
                        </Col>
                        <Col span={24}>
                            {/* Add upload ui */}
                            <Row>
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
                                        fieldName="university_logo"
                                        label="University Logo"
                                        acceptedFileTypes="image/*"
                                        initialFileUrl={universityData?.logo_url ? universityData.logo_url : ""}
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
                                        label="University Doc"
                                        acceptedFileTypes="pdf/*"
                                        initialFileUrl={universityData?.document_url ? universityData.document_url : ""}
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
                                        loading={buttonLoading}
                                    >
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Row>
                        </Col>
                    </Row>
                }
            </Form>
        </>
    );
};

export default Page;