"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Dropdown, message, Space, Table, Tooltip } from "antd";
import type { TableProps, PaginationProps, TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import Filters from "@/app/Components/common/Filters";
import { RxExclamationTriangle } from "react-icons/rx";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { ApiError, Course } from "../courses/api/fetchCourseById";
import { fetchApplications } from "@/app/api/fetchApplications";
import { Student } from "../students/hooks/useGetByIdStudents";

interface ApplicationType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  status: string;
  whatsapp_no: string;
  company_name: string;
  website: string;
  address: string;
  city: string;
  post_code: string;
  country: string;
  can_upload_docs: boolean;
  resubmit_note: string | null;
  pan_card_url: string;
  cancelled_cheque_url: string;
  gst_spice_letter_url: string;
  student: Student;
  course: Course;
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


// interface DataType {
//   key: React.Key;
//   name: string;
//   age: number;
//   address: string;
// }

// const columns: TableColumnsType<DataType> = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     showSorterTooltip: { target: 'full-header' },
//     filters: [
//       {
//         text: 'Joe',
//         value: 'Joe',
//       },
//       {
//         text: 'Jim',
//         value: 'Jim',
//       },
//       {
//         text: 'Submenu',
//         value: 'Submenu',
//         children: [
//           {
//             text: 'Green',
//             value: 'Green',
//           },
//           {
//             text: 'Black',
//             value: 'Black',
//           },
//         ],
//       },
//     ],
//     // specify the condition of filtering result
//     // here is that finding the name started with `value`
//     onFilter: (value, record) => record.name.indexOf(value as string) === 0,
//     sorter: (a, b) => a.name.length - b.name.length,
//     sortDirections: ['descend'],
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//     defaultSortOrder: 'descend',
//     sorter: (a, b) => a.age - b.age,
//   },
//   {
//     title: 'Address',
//     dataIndex: 'address',
//     filters: [
//       {
//         text: 'London',
//         value: 'London',
//       },
//       {
//         text: 'New York',
//         value: 'New York',
//       },
//     ],
//     onFilter: (value, record) => record.address.indexOf(value as string) === 0,
//   },
// ];

// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//   },
//   {
//     key: '4',
//     name: 'Jim Red',
//     age: 32,
//     address: 'London No. 2 Lake Park',
//   },
// ];


const ApplicationPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationType[]>([]);
  const [pageSkip, setPageSkip] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  console.log(applicationData, "applicationData");

  const handleDelete = (id: string) => {
    console.log(id);
  }

  const handleStatusChange = (id: number | undefined, status: string) => {
    console.log(id, status);
  }

  const columns: TableProps<ApplicationType>["columns"] = [
    {
      title: "Application ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id && b.id !== undefined ? a.id - b.id : 0,
      defaultSortOrder: "descend",
      align: "center",
    },
    {
      title: "Full Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (text, record) => `${record.student.name}`,
      align: "center",
    },
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      align: "center",
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
      render: (text, record) => `${record.course?.university?.university_name}`,
      align: "center",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text, record) => `${record.course?.university?.country}`,
      align: "center",
    },
    {
      title: "Intake",
      dataIndex: "intake",
      key: "intake",
      align: "center",
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
                  // handleStatusChange(record?.id, key);
                  console.log(key, "key");
                  message.info("You clickeded on " + key);
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
      align: "center",
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
      align: "center",
    },
  ];


  const loadApplications = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await fetchApplications({ route: "/applications/admin", take: pageSize, skip: pageSkip });
      if (data) {
        setApplicationData(data.data.data);
        setHasMore(data.data.hasMore);
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
    loadApplications();
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
        <FormTitle fontSize="20px" mb="24px" title="Applications" bg="#fff" padding="0 0 20px 0" borderBottom="1px solid #F0F0F0" />
        <Filters route="/administrator/rolemanagement/form" nameSearch={handleSearch} />


        <Table<ApplicationType>
          columns={columns}
          dataSource={applicationData}
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

export default ApplicationPage;
