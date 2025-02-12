"use client"
import FormTitle from '@/app/Components/common/FormTitle';
import { Col, Form, Input, Row } from 'antd';
import React from 'react'


interface InterviewComponent {
    application_fee: string;
    interview_link: string;
}

const InterviewComponent = () => {
    const [form] = Form.useForm();

    const onFinish = async (values: InterviewComponent) => {
        console.log("Values :", values);
    }
    // const onFinishFailed = async (errorInfo: any) => { }

    return (
        <>
            <Row style={{ width: "100%" }}>
                <Col span={24}>
                    <FormTitle title='Interviews' bg='#fff' borderBottom='1px solid #F0F0F0' />
                </Col>
                <Form
                    form={form}
                    name="add_user"
                    layout="vertical"
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    style={{
                        background: "#fff",
                        padding: "40px",
                        width: "100%"
                    }}
                >
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <Form.Item
                                label={<span style={{ fontWeight: "500" }}>Application Fee</span>}
                                name="application_fee"
                                rules={[{ required: true, message: "Please fill all the fields" }]}
                            >
                                <Input size="large" placeholder="Enter Applicatoin Fee Url" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label={<span style={{ fontWeight: "500" }}>Interview Link</span>}
                                name="interview_link"
                                rules={[{ required: true, message: "Enter Interview Link URL" }]}
                            >
                                <Input size="large" placeholder="Enter name" />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Row>
        </>
    )
}

export default InterviewComponent