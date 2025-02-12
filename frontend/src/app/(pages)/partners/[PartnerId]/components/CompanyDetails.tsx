import ActionButton from '@/app/Components/common/ActionButton'
import BorderContainer from '@/app/Components/common/BorderContainer'
import FormTitle from '@/app/Components/common/FormTitle'
import InputString from '@/app/Components/form/InputString'
import { axiosInstance } from '@/app/configs/axios'
import { Col, Form, message, Row, UploadFile } from 'antd'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useGetByIdPartners from '../../hooks/useGetByIdPartners'
import FormLoading from '@/app/Components/common/FormLoading'
import { AxiosError } from 'axios'
import Uploader from '@/app/Components/form/Uploader'
import useGetByIdPartnersDocs from '../../hooks/useGetByIdPartnerDocs'

type PartnerFormCompanyValues = {
    company_name: string,
    website: string,
    address: string,
    city: string,
    country: string,
    post_code: string,
}

interface FileState {
    [key: string]: UploadFile[];
}

interface ErrorResponse {
    message: string;
}

const CompanyDetails = () => {
    const router = useRouter()
    const { PartnerId } = useParams() as { PartnerId: string };
    const { partnerData, loading } = useGetByIdPartners();
    const { partnerDocs } = useGetByIdPartnersDocs();
    const [fileList, setFileList] = useState<FileState>({});
    const searchParams = useSearchParams();
    const action = searchParams.get('action');


    useEffect(() => {
        console.log(fileList, "fileListCompany");
        if (partnerData) {
            form.setFieldsValue({
                company_name: partnerData.company_name,
                website: partnerData.website,
                address: partnerData.address,
                city: partnerData.city,
                country: partnerData.country,
                post_code: partnerData.post_code
            })
        }
    }, [partnerData])

    const handleFinish = async (values: PartnerFormCompanyValues) => {
        setButtonLoading(true);
        console.log(values, "clicked");
        try {

            const payload = {
                company_name: values.company_name,
                website: values.website,
                address: values.address,
                city: values.city,
                post_code: values.post_code,
            };

            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined || payload[key] === '') {
                    delete payload[key];
                }
            });

            const response = await axiosInstance.patch(`/partners/${PartnerId}`, payload);

            if (response.status === 200) {
                message.success('Company details updated successfully');
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
            setButtonLoading(false);
        }
    };

    const handleFileChange = (files: UploadFile[], key: string) => {
        setFileList(prev => ({
            ...prev,
            [key]: files
        }));
    };

    const [form] = Form.useForm()
    const [buttonLoading, setButtonLoading] = React.useState(false)
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
                                <InputString label="Company" name="company_name" size="large" placeHolder="Enter company name" required={false} />
                            </Col>
                            <Col span={8}>
                                <InputString label="Website" name="website" size="large" placeHolder="Enter website url" required={false} />
                            </Col>
                            <Col span={8}>
                                <InputString label="Address" name="address" placeHolder="Enter address" required={false} />
                            </Col>
                            <Col span={8}>
                                <InputString label="City" name="city" placeHolder="Confirm city" required={false} />
                            </Col>
                            <Col span={8}>
                                <InputString label="Post Code" name="post_code" placeHolder="Enter post code" required={false} />
                            </Col>
                            <Col span={8}>
                                <InputString label="Country" name="country" placeHolder="Enter country" required={false} />
                            </Col>
                        </Row>
                    }
                </Form>
            </BorderContainer>

            <BorderContainer>
                <FormTitle title='Update Documents' />
                <Form
                    form={form}
                    layout="vertical"
                    className="formStyles"
                // onFinish={handleFinish}
                >
                    {loading ? <FormLoading numFields={2} /> :
                        <Row gutter={[24, 16]}>
                            <Col style={{ width: "100%" }}>
                                <Uploader
                                    documentName="Pan Card"
                                    restrainMessage="Maximum file size is 700KB"
                                    uploadItemsCount={1}
                                    documentKey="pan_card"
                                    onChange={handleFileChange}
                                    existingDocumentUrl={partnerDocs?.pan_card_url}
                                />
                            </Col>
                            <Col style={{ width: "100%" }}>
                                <Uploader
                                    documentName="Cancelled Cheque"
                                    restrainMessage="Maximum file size is 700KB"
                                    uploadItemsCount={1}
                                    documentKey="cancelled_cheque"
                                    onChange={handleFileChange}
                                    existingDocumentUrl={partnerDocs?.cancelled_cheque_url}
                                />
                            </Col>
                            <Col style={{ width: "100%" }}>
                                <Uploader
                                    documentName="GST/ Spice Letter"
                                    restrainMessage="Maximum file size is 700KB"
                                    uploadItemsCount={1}
                                    documentKey="gst_letter"
                                    onChange={handleFileChange}
                                    existingDocumentUrl={partnerDocs?.gst_spice_letter_url}
                                />
                            </Col>
                        </Row>
                    }
                </Form>
            </BorderContainer>
            {action === "edit" &&
                <Row justify="end" style={{ marginTop: "24px" }}>
                    <ActionButton
                        shape="round"
                        btnText="Save"
                        htmlType="submit"
                        buttonLoading={buttonLoading}
                        handleClick={() => handleFinish(form.getFieldsValue())}
                    />
                </Row>
            }
        </>
    )
}

export default CompanyDetails