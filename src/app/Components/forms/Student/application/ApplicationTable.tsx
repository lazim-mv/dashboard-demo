import React, { useEffect, useMemo, useRef } from "react";
import { Space, Table, Tooltip } from "antd";
import type { TableProps } from "antd";
import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";
// import { axiosInstance } from "@/app/configs/axios";
import countries from 'world-countries';
import { IoMdClose } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";

interface University {
  id?: number;
  university_name?: string;
  location: string;
  country: string;
  description?: string;
  logo_url?: string | null;
  document_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface Course {
  id: number;
  name: string;
  level: string;
  intake: string[];
  subject: string;
  duration: string;
  awards: string[];
  document_url: string | null;
  tution_fee: string;
  requirements: string[];
  university_id: number;
  created_at: string;
  updated_at: string;
  university: University | null;
}

interface CourseShortlist {
  id: number;
  course_id: number;
  intake: string;
  student_id: number;
  created_at: string;
  updated_at: string;
  course: Course | null;
}

interface DataType {
  key: string;
  course_name: string;
  level: string;
  university: string;
  country: string;
  intake: string;
  course: Course | null;
}

type componentProps = {
  shouldRefetch?: boolean;
};

const ApplicationTable: React.FC<componentProps> = ({ shouldRefetch }) => {
  const { studentsData, loading, refetch } = useGetByIdStudents();
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            refetch();
          }
        });
      },
      {
        root: null,
        threshold: 0.1
      }
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => {
      if (tableRef.current) {
        observer.unobserve(tableRef.current);
      }
    };
  }, []);

  const countryMap = useMemo(() => {
    return countries.reduce((acc, country) => {
      acc[country.cca2] = country.name.common;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  useEffect(() => {
    if (shouldRefetch) {
      refetch()
    }
  }, [shouldRefetch])

  // const handleApply = async (id: string) => {
  //   try {
  //     const studentId = localStorage.getItem("studentId");
  //     if (!studentId) {
  //       message.error("No studentId found for user. Please login again.");
  //       return;
  //     }

  //     const payload = { shortlist_id: parseInt(id) }

  //     const response = await axiosInstance.post(`/students/${studentId}/applications/apply`, payload)
  //     if (response.status === 201) {
  //       message.success("Application submitted successfully");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     message.error("Failed to submit application");
  //   }
  // }

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
      render: (_, record) => (
        <a>{record.course ? record.course.name : "N/A"}</a>
      ),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (_, record) => <span>{record.course ? record.course.level : "N/A"}</span>,
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
      render: (_, record) => (
        <span>{record.course ? record?.course?.university?.university_name : "N/A"}</span>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (_, record) => {
        const countryCode = record.course?.university?.country;
        const fullCountryName = countryCode ? countryMap[countryCode] || countryCode : "N/A";
        return <span>{fullCountryName}</span>;
      },
    },
    {
      title: "Intake",
      dataIndex: "intake",
      key: "intake",
      render: (_, record) => <span>{record.intake}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Tooltip title="Remove">
            <IoMdClose
              color="#FF4D4F"
              size={18}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                console.log(record, "clicked");
              }}
            />
          </Tooltip>
          <Tooltip title="View">
            <FaRegEye
              size={18}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                // router.push(`/students/${record.key}/view`);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const dataSource = studentsData?.applications?.map((item: CourseShortlist) => ({
    key: item.id.toString(),
    course_name: item.course?.name || "N/A",
    level: item.course?.level || "N/A",
    university: item.course?.university?.university_name || "N/A",
    country: item.course?.university?.country || "N/A",
    intake: item.intake,
    course: item.course,
  }));

  return (
    <div ref={tableRef}>
      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ApplicationTable;