"use client";
import React, { useEffect, useState } from "react";
import { message, Space, Table, Tooltip } from "antd";
import type { TableProps, PaginationProps } from "antd";
import { fetchCourses, Course } from "../api/fetchCourses";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import Filters from "@/app/Components/common/Filters";
import { axiosInstance } from "@/app/configs/axios";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";



const Page: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [courseData, setCourseData] = useState<Course[]>([]);
    const [pageSkip, setPageSkip] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [totalCourses, setTotalCourses] = useState<number>(0);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const courseResponse = await fetchCourses({ take: pageSize, skip: pageSkip });
            if (courseResponse) {
                setCourseData(courseResponse.data.courses);
                setTotalCourses(courseResponse.data.meta.total);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoading(true);
            await axiosInstance.delete(`/course/${id}`);
            message.success("Course deleted successfully!");
            loadCourses();
        } catch (error) {
            console.error("Error deleting course:", error);
            message.error("Failed to delete course.");
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange: PaginationProps["onChange"] = (page) => {
        const skip = (page - 1) * pageSize;
        setCurrentPage(page);
        setPageSkip(skip);
    };

    useEffect(() => {
        loadCourses();
    }, [pageSkip, pageSize]);



    const columns: TableProps<Course>["columns"] = [
        {
            title: "No",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
            sortDirections: ["descend", "ascend"],
            defaultSortOrder: "descend",
        },
        {
            title: "Course Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Tuition Fee",
            dataIndex: "tution_fee",
            key: "tution_fee",
            sorter: (a, b) => parseFloat(a.tution_fee) - parseFloat(b.tution_fee),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            sorter: (a, b) => a.subject.localeCompare(b.subject),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Level",
            dataIndex: "level",
            key: "level",
            sorter: (a, b) => a.level.localeCompare(b.level),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Action",
            key: "action",
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <MdEdit
                            size={18}
                            style={{ cursor: "pointer" }}
                            onClick={() => router.push(`/courses/list/${record.id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <RiDeleteBin6Line
                            size={18}
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(record.id)
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleSearch = () => {
        console.log("Handle Search");
    };

    return (
        <>
            <BorderContainer mt="0" bg="#fff" pd="20px 24px" brdrRd="8px">
                <FormTitle
                    fontSize="20px"
                    mb="24px"
                    title="List"
                    bg="#fff"
                    padding="0 0 20px 0"
                    borderBottom="1px solid #F0F0F0"
                />
                <Filters createBtnTxt="Create New" route="/courses/list/form" nameSearch={handleSearch} />

                <Table<Course>
                    columns={columns}
                    dataSource={courseData}
                    bordered
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        onChange: handleTableChange,
                        total: totalCourses,
                        showSizeChanger: false,
                    }}
                    loading={loading}
                    rowKey="id"
                />
            </BorderContainer>
        </>
    );
};

export default Page;
