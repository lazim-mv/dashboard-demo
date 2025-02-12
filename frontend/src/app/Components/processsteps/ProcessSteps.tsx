"use client";
import styles from "./processsteps.module.css";
import React, { ReactNode, useState } from "react";
import { Col, Divider, Row, Steps } from "antd";
import { FaClipboardUser } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoMdMail } from "react-icons/io";
import { FaPassport } from "react-icons/fa";
import { PiAirplaneTilt } from "react-icons/pi";
import Link from "next/link";

const StepIcon: React.FC<{ icon: ReactNode; title: string }> = ({
  icon,
  title,
}) => {
  const formattedTitle = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <Link href={formattedTitle}>
      <div style={{ textAlign: "center" }}>
        <div className={styles.IconContainer}>{icon}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </Link>
  );
};

const ProcessSteps: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    console.log("onChange:", value);
    setCurrent(value);
  };

  return (
    <>
      <Row className={styles.container} justify="center">
        <Col className={styles.title} onCanPlay={() => onChange(1)}>
          <h1>Process Steps</h1>
          <Divider />
        </Col>
        <Col className={styles.process} style={{ width: "100%" }}>
          <Steps
            current={current}
            items={[
              {
                status: "finish",
                icon: (
                  <StepIcon icon={<FaClipboardUser />} title="Submission" />
                ),
              },
              {
                status: "process",
                icon: <StepIcon icon={<HiMiniUserGroup />} title="Interview" />,
              },
              {
                status: "process",
                icon: <StepIcon icon={<IoMdMail />} title="Offer-Letter" />,
              },
              {
                status: "process",
                icon: <StepIcon icon={<FaPassport />} title="VFS" />,
              },
              {
                status: "process",
                icon: (
                  <StepIcon icon={<PiAirplaneTilt />} title="Visa Granted" />
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default ProcessSteps;
