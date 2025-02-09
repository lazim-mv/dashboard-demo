"use client"
import FormTitle from "@/app/Components/common/FormTitle";
import { axiosInstance } from "@/app/configs/axios";
import { Form, Input, Row, Col, message } from "antd"; // Added Skeleton import
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useGetByIdLeads from "../../../hooks/useGetByIdLeads";
import ActionButton from "@/app/Components/common/ActionButton";
import FormLoading from "@/app/Components/common/FormLoading";

interface UserFormValues {
    name: string;
    email: string;
    phone_no: string;
    company: string;
    source_id: string | null;
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const Page: React.FC = () => {
    const [buttonLoading, setButtonLoading] = useState(false);
    const [form] = Form.useForm<UserFormValues>();
    const { leadData, loading } = useGetByIdLeads();
    const searchParams = useSearchParams();
    const edit = searchParams.get('edit');

    useEffect(() => {
        if (leadData) {
            form.setFieldsValue({
                name: leadData.name,
                email: leadData.email,
                phone_no: leadData.phone_no,
                company: leadData.company,
                source_id: leadData.source_id
            });
        }
    }, [leadData, form]);

    const onFinish = async (values: UserFormValues) => {
        try {
            setButtonLoading(true);
            const response = await axiosInstance.post("/partners/lead-sources", values);

            if (response.data) {
                message.success("User created successfully");
                form.resetFields();
            }
        } catch (error: unknown) {
            const apiError = error as ApiError;
            message.error(apiError.response?.data?.message || "Failed to create user");
        } finally {
            setButtonLoading(false);
        }
    };

    return (
        <>
            <FormTitle title={edit ? "Update Lead" : "Lead Details"} bg='#fff' borderBottom='1px solid #F0F0F0' />
            <div style={{
                background: "#fff",
                padding: "40px",
            }}>
                {loading ? (
                    <FormLoading numFields={5} />
                ) : (
                    <Form
                        form={form}
                        name="add_user"
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Row gutter={[24, 24]}>
                            <Col span={8}>
                                <Form.Item
                                    layout="vertical"
                                    label={<span style={{ fontWeight: "500" }}>Full Name</span>}
                                    name="name"
                                    rules={[{ required: true, message: "Please enter the user's name!" }]}
                                >
                                    <Input size="large" placeholder="Enter name" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    layout="vertical"
                                    label={<span style={{ fontWeight: "500" }}>Phone Number</span>}
                                    name="phone_no"
                                    rules={[
                                        { required: true, message: "Please enter a phone number" },
                                    ]}
                                >
                                    <Input size="large" placeholder="Enter phone number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    layout="vertical"
                                    label={<span style={{ fontWeight: "500" }}>Email</span>}
                                    name="email"
                                    rules={[
                                        { required: true, message: "Please enter a valid email!" },
                                        { type: "email", message: "The input is not a valid email!" },
                                    ]}
                                >
                                    <Input size="large" placeholder="Enter email" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    layout="vertical"
                                    label={<span style={{ fontWeight: "500" }}>Company Name</span>}
                                    name="company"
                                    rules={[{ required: true, message: "Please enter company name!" }]}
                                >
                                    <Input size="large" placeholder="Enter company" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    layout="vertical"
                                    label={<span style={{ fontWeight: "500" }}>Source</span>}
                                    name="source_id"
                                >
                                    <Input size="large" placeholder="Enter source" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Row justify="end">
                                    <ActionButton
                                        shape="round"
                                        btnText="Save"
                                        htmlType="submit"
                                        buttonLoading={buttonLoading}
                                        disabled={edit === null}
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                )}
            </div>
        </>
    );
};

export default Page;