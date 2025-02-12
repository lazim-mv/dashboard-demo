"use client";
import React from "react";
import { Alert, Button, Space, Table } from "antd";
// import type { TableProps, PaginationProps } from "antd";
import type { TableProps } from "antd";
// import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import Filters from "@/app/Components/common/Filters";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import useLoadRoles from "./api/useLoadRoles";


export interface Permission {
    id: number;
    type: string;
    resource: string;
    actions: string[];
    created_at: string;
    updated_at: string;
    role_id: number;
}

interface UserRoles {
    id: number;
    name: string;
    permissions: Permission[];
    partner_id: number;
}

const columns: TableProps<UserRoles>["columns"] = [
    {
        title: "No",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "Role Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Permissions",
        key: "permissions",
        render: (record) => (
            <Space direction="vertical">
                {record.permissions?.map((permission: Permission) => (
                    <div key={permission.id}>
                        <strong style={{ color: "#4880FF", fontWeight: "500" }}>{permission.resource}:</strong>{" "}
                        ({permission.actions.join(", ")})
                    </div>
                ))}
            </Space>
        ),
    },
    {
        title: "Action",
        key: "action",
        render: () => (
            <Space size="middle">
                <Button
                    icon={<RiDeleteBin6Line color="#FF4D4F" />}>
                </Button>
            </Space>
        ),
    },
];

const Page: React.FC = () => {
    // const router = useRouter();
    const { rolesData, errorMessage, loading } = useLoadRoles();





    // const handleTableChange: PaginationProps['onChange'] = (page) => {
    //     const skip = (page - 1) * pageSize;
    //     setCurrentPage(page);
    //     setPageSkip(skip);
    // };

    const handleSearch = () => {
        console.log("search");
    }

    return (
        <>
            <BorderContainer mt="0" bg="#fff" pd="20px 24px" brdrRd="8px" >
                <FormTitle fontSize="20px" mb="24px" title="Role Management" bg="#fff" padding="0 0 20px 0" borderBottom="1px solid #F0F0F0" />
                <Filters createBtnTxt="Create Role" route="/administrator/rolemanagement/form" nameSearch={handleSearch} />

                {errorMessage.length > 0 ? (
                    <Alert
                        message={errorMessage}
                        type="error"
                        showIcon
                        className="mb-4"
                        closable
                    />
                ) :
                    <Table<UserRoles>
                        columns={columns}
                        dataSource={rolesData}
                        bordered
                        loading={loading}
                    // rowKey="id"
                    />
                }
            </BorderContainer>
        </>
    );
};

export default Page;
