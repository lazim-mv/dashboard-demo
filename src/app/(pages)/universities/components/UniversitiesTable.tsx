"use client";
import React, { useState } from "react";
import { Button, Col, message, Pagination, Row, Skeleton } from "antd";
// import type { TableProps, PaginationProps } from "antd";
// import { useRouter } from "next/navigation";
import Filters from "@/app/Components/common/Filters";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import Image from "next/image";
import { FaDeleteLeft } from "react-icons/fa6";
import { axiosInstance } from "@/app/configs/axios";
import { useRouter } from "next/navigation";
import useLoadUniversities from "../hooks/useGetUniversities";
import uniLogo from "../../../../../public/columbia.webp"


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

interface UniverityRow {
    id: number;
    university_name: string;
    country: string;
    location: string;
    description: string;
    document_url?: null | string;
    logo_url?: null | string;
    reload?: () => void;
}



const UniversityRow: React.FC<UniverityRow> = ({ id, university_name, country, location, description, document_url, logo_url, reload }) => {
    const router = useRouter();
    const handleDelete = async (universityId: number) => {
        try {
            const res = await axiosInstance.delete(`university/${universityId}`);

            if (res.status === 200) {
                message.success("University deleted successfully");
                if (reload) reload()
            } else {
                message.error("Error deleting university");
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleViewCourse = async (universityId: number) => {
        router.push(`/courses/coursesearch?university=${encodeURIComponent(universityId)}`);
    }

    console.log(id, description, document_url);
    return (
        <>
            <BorderContainer brdrRd="8px" pd="20px 24px">
                <Row justify="space-between">
                    {/* Left Side */}
                    <Col span={18}>
                        <Row gutter={[16, 16]}>
                            <Col span={8} style={{ border: "1px solid #f0f0f0", borderRadius: "8px", alignContent: "center", maxHeight: "100px" }}>
                                <Image
                                    src={logo_url ? logo_url : uniLogo}
                                    alt={university_name || ""}
                                    width={280} height={95}
                                    style={{ width: "100%", height: "85%", objectFit: "contain" }}
                                />
                            </Col>
                            <Col style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "column", marginLeft: "32px" }}>
                                <Title level={4}>{university_name}</Title>
                                <Title level={5}>{country} {location}</Title>
                            </Col>
                        </Row>
                        <Row gutter={[12, 12]} align="middle" style={{ marginTop: "12px" }}>
                            <Col>
                                <Title style={{ marginBottom: "0px" }} level={5}>IELTS waiver available: Standard XII: 65%/70% in English Language for undergraduate and postgraduate.</Title>
                            </Col>
                            <Col>
                                <Link href={document_url ? document_url : ""} target="_blank">
                                    View Document
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                    {/* Right Side */}
                    <Col span={6} style={{ display: "flex", justifyContent: "flex-end", alignItems: 'center' }}>
                        <Row gutter={[12, 12]} justify="end" align="middle">
                            <Col>
                                <Button type="text" size="large" onClick={() => handleDelete(id)} icon={<FaDeleteLeft color="#FF4D4F" size={25} />}>
                                </Button>
                            </Col>
                            <Col>
                                <Button type="text" size="large" onClick={() => router.push(`/universities/${id}`)} icon={<CiEdit color="#4880FF" size={25} />}>
                                </Button>
                            </Col>
                            <Col>
                                <Button type="primary" size="large" onClick={() => handleViewCourse(id)} shape="round">View Course</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </BorderContainer>

        </>
    )
}

const UniversitiesTable: React.FC = () => {
    const { universityData, loading, refetch } = useLoadUniversities();

    const [current, setCurrent] = useState(1);
    const pageSize = 3;


    const handlePaginationChange = (page: number) => {
        setCurrent(page);
    };


    const paginatedData = universityData.slice((current - 1) * pageSize, current * pageSize);

    if (loading) {
        return (
            <BorderContainer>
                <FormTitle title="Universities" />
                <div style={{ padding: "24px" }}>
                    <Skeleton active paragraph={{ rows: 6 }} title={{ width: "30%" }} />
                </div>
            </BorderContainer>
        );
    }

    return (
        <div style={{ background: "#fff", borderRadius: "8px", padding: "20px 24px" }}>
            <FormTitle fontSize="20px" mb="24px" title="Universities" bg="#fff" padding="0 0 20px 0" borderBottom="1px solid #F0F0F0" />
            <Filters createBtnTxt="Add New" route="/universities/form" nameSearch={() => console.log("search")} />

            {!loading && paginatedData.length > 0 && paginatedData.map((university: UniverityRow) => (
                <UniversityRow
                    key={university.id}
                    id={university.id}
                    country={university.country}
                    university_name={university.university_name}
                    location={university.location}
                    description={university.description}
                    document_url={university.document_url}
                    logo_url={university.logo_url}
                    reload={refetch}
                />
            ))}
            <Row justify="end" style={{ marginTop: "16px", textAlign: "center" }}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={universityData.length}
                    onChange={handlePaginationChange}
                />
            </Row>
        </div>
    );
};

export default UniversitiesTable;
