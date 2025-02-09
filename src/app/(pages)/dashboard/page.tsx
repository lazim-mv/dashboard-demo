import DashboardCard from "@/app/Components/dashboardCard/DashboardCard";
import { Row, Space } from "antd";
import React from "react";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaPeopleCarry } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import StudentApplicationChart from "@/app/Components/charts/StudentApplicationChart";
// import { cookies } from "next/headers";

const page = () => {
  // console.log(cookies().get("access_token_level_up"), "token from dashboard");
  // console.log(cookies().get("access_token_cookie"), "token from dashboard");

  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: "flex",
        }}
      >
        <Row justify="space-between">
          <DashboardCard
            Icon={VscGitPullRequestGoToChanges}
            count={9999}
            text="Total Applications"
            iconColor="#FAAD14"
            iconBgColor="#FFF4E8"
          />
          <DashboardCard
            Icon={IoNewspaperOutline}
            count={9999}
            text="Submitted"
            iconColor="#4CB5F5"
            iconBgColor="#E8F5FF"
          />
          <DashboardCard
            Icon={FaPeopleCarry}
            count={9999}
            text="Total Interview"
            iconColor="#52C41A"
            iconBgColor="#ECFFF2"
          />
          <DashboardCard
            Icon={FaWallet}
            count={9999}
            text="Total Paid"
            iconColor="#975FE4"
            iconBgColor="#F9EFFF"
          />
          <DashboardCard
            Icon={FaCcVisa}
            count={9999}
            text="Total Visa Process"
            iconColor="#FF4D4F"
            iconBgColor="#FFEDED"
          />
          <DashboardCard
            Icon={FaCircleCheck}
            count={9999}
            text="Total Visa Granted"
            iconColor="#1C4E80"
            iconBgColor="#1C4E801A"
          />
        </Row>

        <StudentApplicationChart />
      </Space>
    </>
  );
};

export default page;
