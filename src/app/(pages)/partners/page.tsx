"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Dropdown, Space, Table, Tooltip } from "antd";
import type { TableProps, PaginationProps } from "antd";
import { useRouter } from "next/navigation";
import { fetchPartners } from "@/app/api/partner/fetchPartners";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import Filters from "@/app/Components/common/Filters";
import { RxExclamationTriangle } from "react-icons/rx";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { ApiError } from "../courses/api/fetchCourseById";

interface PartnerType {
    id?: number;
    key: string;
    first_name: string;
    mobile_no: string;
    email: string;
    company_name: string;
    source: string;
    address: string;
    status: string;
    tags: string[];
}

const statusColors: Record<string, string> = {
    CREATED: "#37CBCB",
    PENDING: "#1C4874",
    RESUBMISSION: "#52C41A",
    ACTIVE: "#FF4D4F",
    BLOCKED: "#FF4D4F"
};

const statusLabels: Record<string, string> = {
    CREATED: "Created",
    PENDING: "Pending",
    RESUBMISSION: "Resubmimssion",
    ACTIVE: "Active",
    BLOCKED: "Blocked"
};


const Page: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [partnerData, setPartnerData] = useState<PartnerType[]>([]);
    const [pageSkip, setPageSkip] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleDelete = (id: string) => {
        console.log(id);
    }

    const handleStatusChange = (id: number | undefined, status: string) => {
        console.log(id, status);
    }

    const columns: TableProps<PartnerType>["columns"] = [
        {
            title: "No",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id && b.id !== undefined ? a.id - b.id : 0,
            defaultSortOrder: "descend",
        },
        {
            title: "Partner Name",
            dataIndex: "first_name",
            key: "first_name",
        },
        {
            title: "Phone Number",
            dataIndex: "mobile_no",
            key: "mobile_no",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Company Name",
            dataIndex: "company_name",
            key: "company_name",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (partnerStatus, record) => {
                console.log(record, partnerStatus, "fjkakldsjfl");
                // const formattedStatus = record?.toUpperCase();
                // const color = statusColors[record] || "#000000";
                // const label = statusLabels[record] || formattedStatus;
                const dropdownItems = Object.entries(statusLabels).map(([key, label]) => ({
                    key: key,
                    label: label,
                }));
                return (
                    <Col>
                        <Dropdown
                            menu={{
                                items: dropdownItems,
                                onClick: ({ key }) => {
                                    handleStatusChange(record?.id, key);
                                }
                            }}
                            trigger={["hover"]}
                        >
                            <Button
                                style={{ background: statusColors[partnerStatus] || "#000000", color: "#fff", border: "none" }}
                                icon={<IoIosArrowDropdown size={15} />}
                                size="small"
                            >
                                {statusLabels[partnerStatus] || partnerStatus || "Select Status"}
                            </Button>
                        </Dropdown>
                    </Col>
                );
            },
        },
        {
            title: "Action",
            key: "action",
            render: (record) => (
                <Space size="middle" >
                    <Tooltip title="Edit">
                        <MdEdit
                            size={18}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                router.push(`/partners/${record.id}/?action=edit`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="View">
                        <FaRegEye
                            size={18}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                router.push(`/partners/${record.id}/?action=EditAndApprove`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <RiDeleteBin6Line
                            size={18}
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(record.key);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];


    const loadPartners = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const data = await fetchPartners({ route: "/partners", take: pageSize, skip: pageSkip });
            if (data) {
                setPartnerData(data.data);
                setHasMore(data.hasMore);
                setLoading(false);
            }
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "message" in error) {
                setErrorMessage((error as ApiError).message || "Failed to load data.");
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }

    }


    useEffect(() => {
        loadPartners();
    }, [pageSkip, pageSize]);

    const handleTableChange: PaginationProps['onChange'] = (page) => {
        const skip = (page - 1) * pageSize;
        setCurrentPage(page);
        setPageSkip(skip);
    };

    const handleSearch = () => {
        console.log("Handle Search");
    }

    return (
        <>
            <BorderContainer mt="0" bg="#fff" pd="20px 24px" brdrRd="8px" >
                <FormTitle fontSize="20px" mb="24px" title="Partners" bg="#fff" padding="0 0 20px 0" borderBottom="1px solid #F0F0F0" />
                <Filters route="/administrator/rolemanagement/form" nameSearch={handleSearch} />


                <Table<PartnerType>
                    columns={columns}
                    dataSource={partnerData}
                    bordered
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        onChange: handleTableChange,
                        total: hasMore ? (currentPage * pageSize) + 1 : currentPage * pageSize,
                        showSizeChanger: false,
                    }}
                    locale={{
                        emptyText: errorMessage ? (
                            <div style={{ textAlign: "center", color: "#505050", opacity: 0.5, marginTop: "24px", cursor: "none" }}>
                                <RxExclamationTriangle style={{ fontSize: "48px", marginBottom: "8px" }} />
                                <p style={{ fontWeight: 600, fontSize: "16px" }}>{errorMessage}</p>
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", color: "#505050", opacity: 0.5, marginTop: "24px", cursor: "none" }}>
                                <AiOutlineExclamationCircle style={{ fontSize: "48px", marginBottom: "8px" }} />
                                <p style={{ fontWeight: 600, fontSize: "16px" }}>No Data Available</p>
                            </div>
                        ),
                    }}
                    loading={loading}
                // rowKey="id"
                />
            </BorderContainer>
        </>

    );
};

export default Page;
