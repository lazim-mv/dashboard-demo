import React, { useEffect, useMemo } from "react";
import { message, Space, Table, Tooltip } from "antd";
import type { TableProps } from "antd";
import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";
import { axiosInstance } from "@/app/configs/axios";
import countries from 'world-countries';
import { IoMdClose } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";

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
  onRefetchComplete?: () => void;
};

type removeShortlistPayload = {
  course_id: number,
  intake: string,
}

const ShortlistTable: React.FC<componentProps> = ({ shouldRefetch, onRefetchComplete }) => {
  const { studentsData, loading, refetch } = useGetByIdStudents();

  // Create a memoized mapping of country codes to full names
  const countryMap = useMemo(() => {
    return countries.reduce((acc, country) => {
      acc[country.cca2] = country.name.common;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  useEffect(() => {
    if (shouldRefetch) {
      const performRefetch = async () => {
        await refetch();
        if (onRefetchComplete) {
          onRefetchComplete();
        }
      };

      performRefetch();
    }
  }, [shouldRefetch, refetch, onRefetchComplete]);

  const handleApply = async (id: string) => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        message.error("No studentId found for user. Please login again.");
        return;
      }

      const payload = { shortlist_id: parseInt(id) }

      const response = await axiosInstance.post(`/students/${studentId}/applications/apply`, payload)
      if (response.status === 201) {
        message.success("Application submitted successfully");
        refetch()
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to submit application");
    }
  }

  const handleRemoveShortlist = async (shortListId: string, courseId: number, intake: string) => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        message.error("No studentId found for user. Please login again.");
        return;
      }


      const payload = {
        course_id: courseId,
        intake: intake.toUpperCase(),
      }


      const response = await axiosInstance.delete<removeShortlistPayload>(`/students/${studentId}/applications/shortlist/${shortListId}`, { data: payload })
      if (response.status === 200) {
        message.success("Application removed successfully");
        refetch()
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to remove application");
    }
  }


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
      render: (record) => {
        console.log(record, "recoords");
        return (
          <Space size="middle">
            {/* <Button type="primary" size="middle" onClick={() => handleApply(record.key)}>
            Apply
          </Button> */}
            <Tooltip title="Apply">
              <IoCheckmark
                color="#52C41A"
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => handleApply(record.key)}
              />
            </Tooltip>
            <Tooltip title="Remove">
              <IoMdClose
                color="#FF4D4F"
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveShortlist(record.key, record.course_id, record.intake)}
              />
            </Tooltip>
          </Space>
        )
      },
    },
  ];

  const dataSource = studentsData?.course_shortlist?.map((item: CourseShortlist) => ({
    key: item.id.toString(),
    course_id: item?.course_id,
    course_name: item.course?.name || "N/A",
    level: item.course?.level || "N/A",
    university: item.course?.university?.university_name || "N/A",
    country: item.course?.university?.country || "N/A",
    intake: item.intake,
    course: item.course,
  }));

  return (
    <Table<DataType>
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      bordered
      pagination={{ pageSize: 5 }}
    />
  );
};

export default ShortlistTable;