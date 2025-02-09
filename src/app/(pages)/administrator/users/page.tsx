"use client";
import React from "react";
import { Alert, Button, Space, Table } from "antd";
import type { TableProps } from "antd";
// import { useRouter } from "next/navigation";
// import ActionButton from "@/app/Components/common/ActionButton";
import Filters from "@/app/Components/common/Filters";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import useLoadPartners from "./api/useLoadPartners";
import Link from "next/link";

interface Role {
    name: string;
}

interface UserRole {
    role: Role;
}

interface UserDataType {
    id: number;
    email: string;
    user_roles: UserRole[];
    errorMessage?: string;
}

const columns: TableProps<UserDataType>["columns"] = [
    {
        title: "No",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Role Name",
        key: "user_roles",
        render: (record) => {
            console.log(record, "fdkljasfkls");
            return (<Space direction="vertical">
                {record?.user_roles[0]?.role.name}
            </Space>)
        },
    },
    // {
    //     title: "Status",
    //     dataIndex: "status",
    //     key: "status",
    //     render: (_, record) => {
    //         return (
    //             <Tag color={record.status === "active" ? "green" : "volcano"}>
    //                 {record.status.toUpperCase()}
    //             </Tag>
    //         );
    //     },
    // },
    {
        title: "Action",
        key: "action",
        render: (record) => (
            <Space size="middle">
                <Button icon={<RiDeleteBin6Line color="#FF4D4F" />}>
                </Button>
                <Link href={`/administrator/users/${record.id}`}>
                    <Button
                        icon={<MdOutlineEdit />
                        }>
                    </Button>
                </Link>
            </Space>
        ),
    },
];

const Page: React.FC = () => {
    // const router = useRouter();
    const { userData, errorMessage, loading } = useLoadPartners();

    const handleSearch = () => {
        console.log("search");
    }

    return (
        <>
            <BorderContainer mt="0" bg="#fff" pd="20px 24px" brdrRd="8px">
                <FormTitle
                    fontSize="20px"
                    mb="24px"
                    title="Users"
                    bg="#fff"
                    padding="0 0 20px 0"
                    borderBottom="1px solid #F0F0F0"
                />
                <Filters
                    createBtnTxt="Create User"
                    route="/administrator/users/form"
                    nameSearch={handleSearch}
                />
                {errorMessage.length > 0 ? (
                    <Alert
                        message={errorMessage}
                        type="error"
                        showIcon
                        className="mb-4"
                        closable
                    />
                ) : (
                    <Table<UserDataType>
                        columns={columns}
                        dataSource={userData}
                        bordered
                        loading={loading}
                        rowKey="id"
                    />
                )}
            </BorderContainer>
        </>
    );

};

export default Page;
