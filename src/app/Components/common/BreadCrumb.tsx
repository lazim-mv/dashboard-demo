"use client";
import React from "react";
import { Breadcrumb } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import {
//   UserOutlined,
//   BookOutlined,
//   BorderHorizontalOutlined,
//   GoldOutlined,
//   SettingOutlined,
//   TruckOutlined,
// } from "@ant-design/icons";

// Define the mapping for path to icon
// const pathToIcon: Record<string, React.FC> = {
//   "/customers": UserOutlined,
//   "/orders": BookOutlined,
//   "/designs": BorderHorizontalOutlined,
//   "/materials": GoldOutlined,
//   "/production": SettingOutlined,
//   "/delivery": TruckOutlined,
// };

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter((segment) => segment);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    // const IconComponent = pathToIcon[href];

    return {
      title: (
        <div className="imageAndTextBreadCrumb">
          {/* {IconComponent && (
            <span style={{ marginRight: "8px" }}>
              {React.createElement(IconComponent, {
                style: { fontSize: "20px" },
              })}
            </span>
          )} */}
          <span>{isLast ? segment : <Link href={href}>{segment}</Link>}</span>
        </div>
      ),
    };
  });

  return (
    <div className="breadCrumb">
      <Breadcrumb>
        {breadcrumbItems.map((item, index) => (
          <Breadcrumb.Item key={index}>{item.title}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
