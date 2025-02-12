"use client"
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import { axiosInstance } from "@/app/configs/axios";import { Form, Input, Button, Select, Row, Col, message } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

interface FormValues {
    name: string;
    [key: string]: string | string[];
}


const Page: React.FC = () => {
    const router = useRouter();
    const options = [
        { value: 'READ' },
        { value: 'WRITE' },
        { value: 'UPDATE' },
        // { value: 'DELETE' },
    ];

    const transformFormData = (values: FormValues) => {
        const { name, ...permissionFields } = values;

        console.log(name, permissionFields, "permissionsFields");

        const permissions = Object.entries(permissionFields)
            .filter(([, actions]) => Array.isArray(actions) && actions.length > 0)
            .map(([resource]) => ({
                resource,
                actions: permissionFields[resource] as string[]
            }));

        return {
            name,
            permissions,
            screen_ids: []
        };
    };

    const handleSubmit = async (values: FormValues) => {
        try {
            const payload = transformFormData(values);

            console.log(payload, "permissionsFields inside submit");

            const response = await axiosInstance.post('/partners/administration/roles', payload);

            if (response.status === 200 || response.status === 201) {
                message.success('Role created successfully');
                router.replace('/administrator/rolemanagement');
            }
        } catch (error) {
            console.error('Error creating role:', error);
            message.error('Failed to create role');
        }
    };

    return (
        <>
            <FormTitle title='Add New Role' bg='#fff' borderBottom='1px solid #F0F0F0' />

            <div style={{ padding: "40px", background: "#fff" }}>
                <Form
                    name="add_role"
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row style={{ marginBottom: "24px" }}>
                        <Col span={24}>
                            <Form.Item
                                label={<span style={{ fontWeight: "500" }}>Role Name</span>}
                                name="name"
                                rules={[{ required: true, message: "Please enter the role name!" }]}
                            >
                                <Input size="large" placeholder="Enter role name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <BorderContainer mt="0">
                        <FormTitle title="Permissions" />
                        <div style={{ padding: "24px 20px" }}>
                            <Row gutter={[24, 24]}>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontWeight: "500" }}>Dashboard</span>}
                                        name="DASHBOARD"
                                    >
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            options={options}
                                            maxCount={4}
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontWeight: "500" }}>Students</span>}
                                        name="STUDENTS"
                                    >
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            options={options}
                                            maxCount={4}
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        layout="vertical"
                                        label={<span style={{ fontWeight: "500" }}>Course Search</span>}
                                        name="COURSE_SEARCH"
                                    // rules={[{ required: true, message: "Please enter the user's name!" }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            options={options}
                                            maxCount={4}
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        layout="vertical"
                                        label={<span style={{ fontWeight: "500" }}>Notification</span>}
                                        name="NOTIFICATION"
                                    // rules={[{ required: true, message: "Please enter the user's name!" }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            options={options}
                                            maxCount={4}
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        layout="vertical"
                                        label={<span style={{ fontWeight: "500" }}>Administration</span>}
                                        name="ADMINISTRATION"
                                    // rules={[{ required: true, message: "Please enter the user's name!" }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            options={options}
                                            maxCount={4}
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        layout="vertical"
                                        label={<span style={{ fontWeight: "500" }}>Universities</span>}
                                        name="UNIVERSITIES"
                                    // rules={[{ required: true, message: "Please enter the user's name!" }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            options={options}
                                            maxCount={4}
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        layout="vertical"
                                        label={<span style={{ fontWeight: "500" }}>Partners</span>}
                                        name="PARTNERS"
                                    // rules={[{ required: true, message: "Please enter the user's name!" }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            options={options}
                                            maxCount={4}
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Row justify="end">
                                        <Form.Item>
                                            <Button type="primary" size="large" shape="round" htmlType="submit">
                                                Submit
                                            </Button>
                                        </Form.Item>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </BorderContainer>
                </Form>
            </div>
        </>
    );
};

export default Page;