"use client"
import FormTitle from "@/app/Components/common/FormTitle";
import { axiosInstance } from "@/app/configs/axios";
import { Form, Input, Button, Row, Col, message } from "antd";
import React, { useState } from "react";

interface UserFormValues {
    name: string;
    email: string;
    phone_no: string;
    comapny: string;
    source: string;
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export interface Permission {
    id: number;
    type: string;
    resource: string;
    actions: string[];
    created_at: string;
    updated_at: string;
    role_id: number;
}

// interface UserRoles {
//     id: number;
//     name: string;
//     permissions: Permission[];
//     partner_id: number;
// }

const Page: React.FC = () => {
    const [loading, setLoading] = useState(false);
    // const [rolesData, setRolesData] = useState<UserRoles[]>([]);
    const [form] = Form.useForm<UserFormValues>();

    const onFinish = async (values: UserFormValues) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post("/partners/lead-sources", values);

            if (response.data) {
                message.success("User created successfully");
                form.resetFields();
            }
        } catch (error: unknown) {
            const apiError = error as ApiError;
            message.error(apiError.response?.data?.message || "Failed to create lead");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <FormTitle title='Add New User' bg='#fff' borderBottom='1px solid #F0F0F0' />
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
                            rules={[{ required: true, message: "Please select a role!" }]}
                        >
                            <Input size="large" placeholder="Enter company" />

                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            layout="vertical"
                            label={<span style={{ fontWeight: "500" }}>Source</span>}
                            name="source_id"
                        // rules={[{ required: true, message: "Please select a role!" }]}
                        >
                            <Input size="large" placeholder="Enter company" />

                        </Form.Item>
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