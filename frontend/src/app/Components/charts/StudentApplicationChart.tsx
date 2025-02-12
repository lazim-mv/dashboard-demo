"use client";
import React, { useState } from "react";
import styles from "./studentapplicationchart.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from "recharts";
import { Row, Checkbox, Col, Dropdown, Button, Space, MenuProps } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";

// Define the type for the data used in the chart
interface ChartData {
  name: string;
  Approved: number;
  Rejected: number;
  amt: number;
}

// Sample data
const data: { [year: string]: ChartData[] } = {
  2023: [
    { name: "Jan", Approved: 4000, Rejected: 2400, amt: 2400 },
    { name: "Feb", Approved: 3000, Rejected: 1398, amt: 2210 },
    { name: "Mar", Approved: 2000, Rejected: 9800, amt: 2290 },
    { name: "Apr", Approved: 2780, Rejected: 3908, amt: 2000 },
    { name: "Jun", Approved: 1890, Rejected: 4800, amt: 2181 },
    { name: "Jul", Approved: 2390, Rejected: 3800, amt: 2500 },
    { name: "Aug", Approved: 1490, Rejected: 4300, amt: 2100 },
    { name: "Sep", Approved: 3490, Rejected: 4300, amt: 2100 },
    { name: "Oct", Approved: 1490, Rejected: 2300, amt: 2100 },
    { name: "Nov", Approved: 490, Rejected: 10300, amt: 2100 },
    { name: "Dec", Approved: 3490, Rejected: 4300, amt: 2100 },
  ],
  2024: [
    { name: "Jan", Approved: 5000, Rejected: 1400, amt: 2400 },
    { name: "Feb", Approved: 3500, Rejected: 2398, amt: 2210 },
    { name: "Mar", Approved: 2500, Rejected: 8800, amt: 2290 },
    { name: "Apr", Approved: 1800, Rejected: 3900, amt: 2000 },
    { name: "Jun", Approved: 1600, Rejected: 4200, amt: 2181 },
    { name: "Jul", Approved: 2390, Rejected: 3800, amt: 2500 },
    { name: "Aug", Approved: 1290, Rejected: 4400, amt: 2100 },
    { name: "Sep", Approved: 3300, Rejected: 4400, amt: 2100 },
    { name: "Oct", Approved: 1490, Rejected: 2300, amt: 2100 },
    { name: "Nov", Approved: 490, Rejected: 10300, amt: 2100 },
    { name: "Dec", Approved: 3490, Rejected: 4300, amt: 2100 },
  ],
};

// Functional component with TypeScript
const StudentApplicationChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [showApproved, setShowApproved] = useState(true);
  const [showRejected, setShowRejected] = useState(true);

  // Handle checkbox change
  const handleApprovedToggle = (e: CheckboxChangeEvent) => {
    setShowApproved(e.target.checked);
  };

  const handleRejectedToggle = (e: CheckboxChangeEvent) => {
    setShowRejected(e.target.checked);
  };

  // Handle year selection from dropdown
  const handleYearSelect: MenuProps["onClick"] = ({ key }) => {
    setSelectedYear(key);
  };

  // Year options
  const yearProps: MenuProps = {
    items: [
      { label: "2023", key: "2023" },
      { label: "2024", key: "2024" },
    ],
    onClick: handleYearSelect,
  };

  return (
    <Row className={styles.container}>
      <Row
        className={styles.topContainer}
        align="middle"
        justify="space-between"
      >
        <Col>
          <span className={styles.chartTitle}>Student Applications</span>
        </Col>

        <Row gutter={[16, 16]} className={styles.leftFilters}>
          <Col>
            <Dropdown menu={yearProps}>
              <Button>
                <Space>{selectedYear}</Space>
              </Button>
            </Dropdown>
          </Col>

          <Col className={styles.forCheckbox}>
            <Checkbox checked={showApproved} onChange={handleApprovedToggle}>
              Show Approved
            </Checkbox>
            <Checkbox checked={showRejected} onChange={handleRejectedToggle}>
              Show Rejected
            </Checkbox>
          </Col>
        </Row>
      </Row>

      <ResponsiveContainer className={styles.responsiveChart}>
        <LineChart data={data[selectedYear]} margin={{ left: -15 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <RechartsTooltip />
          <RechartsLegend />
          {showRejected && (
            <Line
              type="monotone"
              dataKey="Rejected"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          )}
          {showApproved && (
            <Line type="monotone" dataKey="Approved" stroke="#82ca9d" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Row>
  );
};

export default StudentApplicationChart;
