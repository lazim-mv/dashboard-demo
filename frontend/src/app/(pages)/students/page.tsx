"use client";
import React, { useEffect } from "react";
import { Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import useGetAllStudents from "./hooks/useGetAllStudents";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa6";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import Filters from "@/app/Components/common/Filters";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";
import { RxExclamationTriangle } from "react-icons/rx";
import { AiOutlineExclamationCircle } from "react-icons/ai";





interface StudentDataType {
  key: number;
  fullName: string;
  course: string;
  university: string;
  email: string;
  phoneNumber: string;
  id: number;
  status: string;
}

const Page: React.FC = () => {
  const router = useRouter();


  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("studentId");
    }
  }, [])


  const { studentsData, errorMessage, loading } = useGetAllStudents();
  const transformedData: StudentDataType[] = studentsData.map((student) => ({
    key: student.id,
    fullName: `${student.name} ${student.surname}`,
    course: "Course Name",
    university: "University Name",
    email: student.email,
    phoneNumber: student.phone_no,
    id: student.id,
    status: student.status,
  }));

  const columns: ColumnsType<StudentDataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "ACTIVE" ? "green" : "volcano";
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Lock">
            <IoIosLock
              size={18}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                console.log("clicked");
              }}
            />
          </Tooltip>
          <Tooltip title="Messages">
            <IoChatboxEllipsesOutline
              size={18}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                console.log("clicked");
              }}
            />
          </Tooltip>
          <Tooltip title="View">
            <FaRegEye
              size={18}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/students/${record.key}/view`);
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

  const handleDelete = (key: number) => {
    console.log(`Delete record with key: ${key}`);
  };

  const handleSearch = () => {
    console.log("search");
  }

  return (
    <>
      <BorderContainer mt="0" bg="#fff" pd="20px 24px" brdrRd="8px" >
        <FormTitle fontSize="20px" mb="24px" title="All Students" bg="#fff" padding="0 0 20px 0" borderBottom="1px solid #F0F0F0" />
        <Filters createBtnTxt="Create New" route="/students/form" nameSearch={handleSearch} />

        <Table<StudentDataType>
          columns={columns}
          dataSource={errorMessage ? [] : transformedData} // Empty dataSource on error
          loading={loading}
          bordered
          style={{ cursor: "pointer" }}
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
          onRow={(record) => ({
            onClick: () => {
              router.push(`/students/${record.key}`);
            },
          })}
        />
      </BorderContainer>
    </>
  );
};

export default Page;
