import { Tabs } from "antd";
import React from "react";
import BasicDetails from "./BasicDetails";
import CompanyDetails from "./CompanyDetails";

const PartnerTabs = () => {
    return (
        <Tabs
            defaultActiveKey="1"
            type="card"
            size="large"
            style={{ marginBottom: 32 }}
            items={[
                {
                    label: "Personal Details",
                    key: "1",
                    children: (<BasicDetails />),
                },
                {
                    label: "Company Details",
                    key: "2",
                    children: (<CompanyDetails />),
                },
            ]}
        />
    );
};

export default PartnerTabs;
