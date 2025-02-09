import { Col } from "antd";
import styles from "./dashboardcard.module.css";
import React from "react";

interface DashboardCardProps {
  Icon: React.ElementType;
  count: number;
  text: string;
  iconColor?: string;
  iconBgColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  Icon,
  count,
  text,
  iconColor,
  iconBgColor,
}) => {
  return (
    <Col className={styles.card}>
      <Col
        className={styles.iconContainer}
        style={{ backgroundColor: iconBgColor }}
      >
        <Icon className={styles.icon} style={{ color: iconColor }} />
      </Col>
      <Col className={styles.countContainer}>
        <h6>{count}</h6>
      </Col>
      <Col className={styles.textContainer}>
        <p>{text}</p>
      </Col>
    </Col>
  );
};

export default DashboardCard;
