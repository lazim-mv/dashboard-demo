"use client"
import React, { useState } from 'react'
import PartnerTabs from './components/PartnerTabs';
import BorderContainer from '@/app/Components/common/BorderContainer';
import FormTitle from '@/app/Components/common/FormTitle';
import { message, Row } from 'antd';
import ActionButton from '@/app/Components/common/ActionButton';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { axiosInstance } from '@/app/configs/axios';

const page = () => {
    const router = useRouter();
    const { PartnerId } = useParams() as { PartnerId: string };
    const [buttonLoading, setButtonLoading] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const action = searchParams.get('action');


    const handleUpdateStatus = async (status: string, buttonName: string) => {
        setButtonLoading(buttonName);
        try {
            const res = await axiosInstance.patch(`/partners/${PartnerId}/status`, { newStatus: status });
            if (res.status === 200) {
                message.success('Partner status updated successfully');
                router.push('/partners');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setButtonLoading(null);
        }
    }

    return (
        <BorderContainer mt="0" bg="#fff" pd="20px 24px" brdrRd="8px" >
            <FormTitle fontSize="20px" mb="24px" title={action === 'EditAndApprove' ? "Partner Details" : "Edit Partner"} bg="#fff" padding="0 0 20px 0" borderBottom="1px solid #F0F0F0" />
            <PartnerTabs />
            {action === 'EditAndApprove' &&
                <Row justify="end" style={{ marginTop: "24px", width: '100%', gap: '16px' }}>
                    <ActionButton
                        shape="round"
                        btnText="Edit"
                        buttonLoading={buttonLoading === "edit"}
                        handleClick={() => router.push(`/partners/${PartnerId}/?action=edit`)
                        }
                    />
                    <ActionButton
                        shape="round"
                        btnText="Resubmit"
                        bgColor='#1C4874'
                        buttonLoading={buttonLoading === "resubmit"}
                        handleClick={() => handleUpdateStatus("RESUBMISSION", "resubmit")}
                    />
                    <ActionButton
                        shape="round"
                        btnText="Reject"
                        bgColor='#FF4D4F'
                        buttonLoading={buttonLoading === "reject"}
                        handleClick={() => handleUpdateStatus("BLOCKED", "reject")}
                    />
                    <ActionButton
                        shape="round"
                        btnText="Approve"
                        bgColor='#52C41A'
                        buttonLoading={buttonLoading === 'approve'}
                        handleClick={() => handleUpdateStatus('CREATED', "approve")}
                    />
                </Row>
            }
        </BorderContainer>
    )
}

export default page