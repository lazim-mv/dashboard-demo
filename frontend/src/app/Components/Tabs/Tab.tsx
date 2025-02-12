"use client";
import React, { useEffect, useState } from "react";
import { Row, Skeleton, Tabs } from "antd";
import type { TabsProps } from "antd";
import styles from "./tab.module.css";
import StudentDetails from "../forms/Student/StudentDetails";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import Education from "../forms/Student/Education";
import RefererreDetails from "../forms/Student/RefererreDetails";
import TravelAndImmigration from "../forms/Student/TravelAndImmigration";
import WorkDetails from "../forms/Student/WorkDetails";
import Documents from "../forms/Student/Documents";
import ShortlistAndApply from "../forms/Student/ShortlistAndApply";
import Applications from "../forms/Student/Applications";
import Messages from "../forms/Student/Messages";
import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";
import BorderContainer from "../common/BorderContainer";
import FormTitle from "../common/FormTitle";
// import FullScreenLoader from "../common/FullScreenSpin";
import { useParams } from "next/navigation";

const COMPLETED_TABS_ORDER = [
  "PERSONAL_DETAILS",
  "EDUCATION",
  "TRAVEL_IMMIGRATION",
  "REFEREE_DETAILS",
  "WORK_DETAILS",
  "DOCUMENTS",
  "SHORT_LIST_APPLY",
  "APPLICATIONS",
  "MESSAGE"
];

const Tab: React.FC = () => {
  const { studentsData, loading, refetch } = useGetByIdStudents();

  const params = useParams();
  const studentId = params.StudentId;


  useEffect(() => {
    if (typeof window !== "undefined" && studentId !== "undefined") {
      localStorage.setItem("studentId", String(studentId));
    }
  }, [])

  const [activeKey, setActiveKey] = useState<string | undefined>("PERSONAL_DETAILS");
  const [shouldChangeTab, setShouldChangeTab] = useState(true);
  const [componentLoading, setComponentLoading] = useState(true);

  useEffect(() => {
    if (studentsData && shouldChangeTab && componentLoading) {
      setActiveKey(studentsData.tab_status);
      setComponentLoading(false);
    }
  }, [studentsData, shouldChangeTab, componentLoading]);

  const handleRefetchWithoutTabChange = () => {
    setShouldChangeTab(false);
    // setComponentLoading(false)
    refetch();
  };

  // if (componentLoading) {
  //   return <FullScreenLoader isLoading={loading} />;
  // }

  if (componentLoading && studentId) {
    return (
      <div style={{ width: "100vw" }}>
        <BorderContainer>
          <FormTitle title="Loading..." />
          <div style={{ padding: '24px' }}>
            <Skeleton
              active
              paragraph={{ rows: 15 }}
              title={{ width: '30%' }}
            />
          </div>
        </BorderContainer>
      </div >
    );
  }


  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "PERSONAL_DETAILS",
      label: (
        <span>
          {COMPLETED_TABS_ORDER.indexOf("PERSONAL_DETAILS") <=
            COMPLETED_TABS_ORDER.indexOf(studentsData?.tab_status || "") ? (
            <AiOutlineCheck style={{ marginRight: 8, color: 'green' }} />
          ) : (
            <AiOutlineClose style={{ marginRight: 8 }} />
          )}
          Personal Details
        </span>
      ),
      children: <StudentDetails
        goToNextTab={() => setActiveKey("EDUCATION")}
        loading={loading}
        studentsData={studentsData}
        refetch={handleRefetchWithoutTabChange}
      />,
    },
    {
      key: "EDUCATION",
      label: (
        <span>
          {COMPLETED_TABS_ORDER.indexOf("EDUCATION") <=
            COMPLETED_TABS_ORDER.indexOf(studentsData?.tab_status || "") ? (
            <AiOutlineCheck style={{ marginRight: 8, color: 'green' }} />
          ) : (
            <AiOutlineClose style={{ marginRight: 8 }} />
          )}
          Education
        </span>
      ),
      children: <Education
        goToNextTab={() => setActiveKey("TRAVEL_IMMIGRATION")}
        loading={loading}
        studentsData={studentsData}
        refetch={handleRefetchWithoutTabChange}
      />,
    },
    {
      key: "TRAVEL_IMMIGRATION",
      label: (
        <span>
          {COMPLETED_TABS_ORDER.indexOf("TRAVEL_IMMIGRATION") <=
            COMPLETED_TABS_ORDER.indexOf(studentsData?.tab_status || "") ? (
            <AiOutlineCheck style={{ marginRight: 8, color: 'green' }} />
          ) : (
            <AiOutlineClose style={{ marginRight: 8 }} />
          )}
          Travel & Immigration
        </span>
      ),
      children: <TravelAndImmigration
        goToNextTab={() => setActiveKey("REFEREE_DETAILS")}
        loading={loading}
        studentsData={studentsData}
        refetch={handleRefetchWithoutTabChange}
      />,
    },
    {
      key: "REFEREE_DETAILS",
      label: (
        <span>
          {COMPLETED_TABS_ORDER.indexOf("REFEREE_DETAILS") <=
            COMPLETED_TABS_ORDER.indexOf(studentsData?.tab_status || "") ? (
            <AiOutlineCheck style={{ marginRight: 8, color: 'green' }} />
          ) : (
            <AiOutlineClose style={{ marginRight: 8 }} />
          )}
          Refererre Details
        </span>
      ),
      children: <RefererreDetails
        goToNextTab={() => setActiveKey("WORK_DETAILS")}
        loading={loading}
        studentsData={studentsData}
        refetch={handleRefetchWithoutTabChange}
      />,
    },
    {
      key: "WORK_DETAILS",
      label: (
        <span>
          {COMPLETED_TABS_ORDER.indexOf("WORK_DETAILS") <=
            COMPLETED_TABS_ORDER.indexOf(studentsData?.tab_status || "") ? (
            <AiOutlineCheck style={{ marginRight: 8, color: 'green' }} />
          ) : (
            <AiOutlineClose style={{ marginRight: 8 }} />
          )}
          Work details
        </span>
      ),
      children: <WorkDetails
        goToNextTab={() => setActiveKey("DOCUMENTS")}
        loading={loading}
        studentsData={studentsData}
        refetch={handleRefetchWithoutTabChange}
      />,
    },
    {
      key: "DOCUMENTS",
      label: (
        <span>
          {COMPLETED_TABS_ORDER.indexOf("DOCUMENTS") <=
            COMPLETED_TABS_ORDER.indexOf(studentsData?.tab_status || "") ? (
            <AiOutlineCheck style={{ marginRight: 8, color: 'green' }} />
          ) : (
            <AiOutlineClose style={{ marginRight: 8 }} />
          )}
          Documents
        </span>
      ),
      children: <Documents goToNextTab={() => setActiveKey("SHORT_LIST_APPLY")} />,
    },
    {
      key: "SHORT_LIST_APPLY",
      label: (
        <span>
          {COMPLETED_TABS_ORDER.indexOf("SHORT_LIST_APPLY") <=
            COMPLETED_TABS_ORDER.indexOf(studentsData?.tab_status || "") ? (
            <AiOutlineCheck style={{ marginRight: 8, color: 'green' }} />
          ) : (
            <AiOutlineClose style={{ marginRight: 8 }} />
          )}
          Shortlist and Apply
        </span>
      ),
      children: <ShortlistAndApply goToNextTab={() => setActiveKey("APPLICATIONS")} />,
    },
    {
      key: "APPLICATIONS",
      label: (
        <span>
          {COMPLETED_TABS_ORDER.indexOf("APPLICATIONS") <=
            COMPLETED_TABS_ORDER.indexOf(studentsData?.tab_status || "") ? (
            <AiOutlineCheck style={{ marginRight: 8, color: 'green' }} />
          ) : (
            <AiOutlineClose style={{ marginRight: 8 }} />
          )}
          Applications
        </span>
      ),
      children: <Applications goToNextTab={() => setActiveKey("MESSAGE")} />,
    },
    {
      key: "MESSAGE",
      label: (
        <span>
          {COMPLETED_TABS_ORDER.indexOf("MESSAGE") <=
            COMPLETED_TABS_ORDER.indexOf(studentsData?.tab_status || "") ? (
            <AiOutlineCheck style={{ marginRight: 8, color: 'green' }} />
          ) : (
            <AiOutlineClose style={{ marginRight: 8 }} />
          )}
          Messages
        </span>
      ),
      children: <Messages />,
    },
  ];


  return (
    <Row className={styles.container}>
      <Tabs
        style={{ width: "100%" }}
        type="card"
        activeKey={activeKey}
        items={items}
        onChange={onChange}
      />
    </Row>
  );
};

export default Tab;
