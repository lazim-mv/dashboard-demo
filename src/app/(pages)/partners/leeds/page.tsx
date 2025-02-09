"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Dropdown, message, Space, Table, Tooltip } from "antd";
import type { TableProps, PaginationProps } from "antd";
import { useRouter } from "next/navigation";
import { ApiError, fetchPartners } from "@/app/api/partner/fetchPartners";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import Filters from "@/app/Components/common/Filters";
// import ActionButton from "@/app/Components/common/ActionButton";
import { IoIosArrowDropdown, IoMdShare } from "react-icons/io";
// import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { RxExclamationTriangle } from "react-icons/rx";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { axiosInstance } from "@/app/configs/axios";

interface PartnerType {
    id?: number;
    key: string;
    first_name?: string;
    mobile_no?: string;
    email?: string;
    company_name?: string;
    source?: string;
    address: string;
    status?: string;
    tags?: string[];
}

// type status = ["NEW_LEAD", "CONTACTED", "CONVERTED", "LOST", "BLOCKED",]
// type status = ["Lost", "Converted", "Contacted", "Blocked", "New Lead"]

const statusColors: Record<string, string> = {
    NEW_LEAD: "#37CBCB",
    CONTACTED: "#1C4874",
    CONVERTED: "#52C41A",
    LOST: "#FF4D4F",
    BLOCKED: "#FF4D4F"
};

const statusLabels: Record<string, string> = {
    NEW_LEAD: "New Lead",
    CONTACTED: "Contacted",
    CONVERTED: "Converted",
    LOST: "Lost",
    BLOCKED: "Blocked"
};



const Page: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [partnerData, setPartnerData] = useState<PartnerType[]>([]);
    const [pageSkip, setPageSkip] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const loadPartners = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const data = await fetchPartners({ route: "/partners/leads" });
            console.log(data, "fkaldsjfksl");
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
    };


    const handleStatusChange = async (leadId: number | undefined, status: string) => {
        console.log(status, leadId, "statusstatus");

        try {
            const payload = {
                newStatus: status
            }
            const response = await axiosInstance.patch(`/partners/leads/status/${leadId}`, payload);
            if (response.status === 200) {
                loadPartners();
                message.success("Status updated successfully");
            } else {
                message.error("Failed to update status");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (id: string) => {
        console.log(id);
    }

    const shareLeads = (urlId: string, phoneNo: string) => {
        const shareLink = `http://195.201.235.173/landing/${urlId}`;
        // const message = `Check this out: ${shareLink}`;
        const whatsappUrl = `https://wa.me/${phoneNo}?text=${encodeURIComponent(shareLink)}`;
        window.open(whatsappUrl, "_blank");
    };

    const columns: TableProps<PartnerType>["columns"] = [
        {
            title: "No",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Partner Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Phone Number",
            dataIndex: "phone_no",
            key: "phone_no",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Company Name",
            dataIndex: "company",
            key: "company",
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
            render: (record) => {
                return (
                    <span>{record ? record.toUpperCase() : "not found"}</span>
                )
            }
        },
        {
            title: "Status",
            dataIndex: "lead_status",
            key: "lead_status",
            render: (leadStatus, record) => {
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
                                style={{ background: statusColors[leadStatus] || "#000000", color: "#fff", border: "none" }}
                                icon={<IoIosArrowDropdown size={15} />}
                                size="small"
                            >
                                {statusLabels[leadStatus] || leadStatus || "Select Status"}
                            </Button>
                        </Dropdown>
                    </Col>
                );
            },
        },
        {
            title: "Action",
            key: "action",
            render: (record) => {
                console.log(record, "record");
                return (
                    <Space size="middle" >
                        <Tooltip title="Edit">
                            <MdEdit
                                size={18}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    router.push(`/partners/leeds/${record.id}/viewdetails?edit=true`);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="View">
                            <FaRegEye
                                size={18}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    router.push(`/partners/leeds/${record.id}/viewdetails`);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Share">
                            <IoMdShare
                                size={18}
                                style={{ cursor: "pointer" }}
                                onClick={() => shareLeads(record.url_id, record.phone_no)}
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
                )
            },
        },
    ];

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
                <FormTitle fontSize="20px" mb="24px" title="Leads" bg="#fff" padding="0 0 20px 0" borderBottom="1px solid #F0F0F0" />
                <Filters route="/partners/leeds/form" createBtnTxt="Create New" nameSearch={handleSearch} />
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
