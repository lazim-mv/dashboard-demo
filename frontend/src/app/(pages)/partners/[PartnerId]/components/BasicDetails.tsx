import ActionButton from '@/app/Components/common/ActionButton'
import BorderContainer from '@/app/Components/common/BorderContainer'
import FormTitle from '@/app/Components/common/FormTitle'
import InputString from '@/app/Components/form/InputString'
import { axiosInstance } from '@/app/configs/axios'
import { Col, Form, message, Row } from 'antd'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useGetByIdPartners from '../../hooks/useGetByIdPartners'
import FormLoading from '@/app/Components/common/FormLoading'
import { AxiosError } from 'axios'


type PartnerFormValues = {
    first_name?: string;
    last_name?: string;
    email?: string;
    confirm_email?: string;
    mobile_no?: string;
    whatsapp_no?: string;
    password?: string;
    confirm_password?: string;
};

interface ErrorResponse {
    message: string;
}

const BasicDetails = () => {
    const router = useRouter()
    const { PartnerId } = useParams() as { PartnerId: string };
    const searchParams = useSearchParams();
    const action = searchParams.get('action');

    const { partnerData, loading } = useGetByIdPartners();
    const [form] = Form.useForm()
    const [buttonLoading, setButtonLoading] = useState<string | null>(null);


    console.log(PartnerId, "PartnerId");

    useEffect(() => {
        if (partnerData) {
            form.setFieldsValue({
                first_name: partnerData.first_name,
                last_name: partnerData.last_name,
                email: partnerData.email,
                mobile_no: partnerData.mobile_no,
                whatsapp_no: partnerData.whatsapp_no,
                confirm_email: partnerData.email,
            })
        }
    }, [partnerData])


    const handleFinish = async (values: PartnerFormValues) => {
        setButtonLoading("save");
        console.log(values, "clicked");
        try {
            if (values.email !== values.confirm_email) {
                form.setFields([
                    {
                        name: 'address2',
                        errors: ['Email and confirm email do not match']
                    }
                ]);
                setButtonLoading(null);
                message.warning('Email and confirm email do not match');
                return;
            }

            if (values.password !== undefined || values.confirm_password) {
                if (values.password !== values.confirm_password) {
                    form.setFields([
                        {
                            name: 'confirm_password',
                            errors: ['Passwords do not match']
                        }
                    ]);
                    setButtonLoading(null);
                    message.warning('Passwords do not match');
                    return;
                }
            }

            const payload = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                mobile_no: values.mobile_no,
                whatsapp_no: values.whatsapp_no,
                password: values.password,
            };

            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined || payload[key] === '') {
                    delete payload[key];
                }
            });

            const response = await axiosInstance.patch(`/partners/${PartnerId}`, payload);

            if (response.status === 200) {
                message.success('Partner details updated successfully');
                router.push('/partners');
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorResponse = error.response?.data as ErrorResponse | undefined;
                message.error(errorResponse?.message || "Failed to update details");
            } else {
                message.error("An unexpected error occurred");
            }
        }
        finally {
            setButtonLoading(null);
        }
    };

    return (
        <>
            <BorderContainer>
                <FormTitle title='Baisic Details' />
                <Form
                    form={form}
                    layout="vertical"
                    className="formStyles"
                // onFinish={handleFinish}
                >
                    {loading ? <FormLoading numFields={6} /> :
                        <Row gutter={[24, 16]}>
                            <Col span={8}>
                                <InputString label="First Name" name="first_name" size="large" placeHolder="Enter First Name" required={false} />
                            </Col>
                            <Col span={8}>
                                <InputString label="Last Name" name="last_name" size="large" placeHolder="Enter Last Name" required={false} />
                            </Col>
                            <Col span={8}>
                                <InputString label="Email" name="email" placeHolder="Enter Email" required={false} />
                            </Col>
                            <Col span={8}>
                                <InputString label="Confirm Email" name="confirm_email" placeHolder="Confirm Email" required={false} />
                            </Col>
                            <Col span={8}>
                                <InputString label="Mobile No" name="mobile_no" placeHolder="Enter Mobile No" required={false} />
                            </Col>
                            <Col span={8}>
                                <InputString label="Whatsapp No" name="whatsapp_no" placeHolder="Enter Whatsapp No" required={false} />
                            </Col>
                        </Row>
                    }
                </Form>
            </BorderContainer>

            <BorderContainer>
                <FormTitle title='Update Password' />
                <Form
                    form={form}
                    layout="vertical"
                    className="formStyles"
                // onFinish={handleFinish}
                >
                    {loading ? <FormLoading numFields={2} /> :
                        <Row gutter={[24, 16]}>
                            <Col span={12}>
                                <InputString label="Password" name="password" size="large" placeHolder="Enter Password" required={false} />
                            </Col>
                            <Col span={12}>
                                <InputString label="Confirm Password" name="confirm_password" size="large" placeHolder="Confirm Password" required={false} />
                            </Col>
                        </Row>
                    }
                </Form>
            </BorderContainer>

            {action === 'edit' &&
                <Row justify="end" style={{ marginTop: "24px" }}>
                    <ActionButton
                        shape="round"
                        btnText="Save"
                        htmlType="submit"
                        buttonLoading={buttonLoading === "save"}
                        handleClick={() => handleFinish(form.getFieldsValue())}
                    />
                </Row>
            }
        </>
    )
}

export default BasicDetails