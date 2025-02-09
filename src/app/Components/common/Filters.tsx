"use client"
import { Col, Row } from "antd";
import React from "react";
import ActionButton from "./ActionButton";
import Search from "antd/es/input/Search";
import { useRouter } from "next/navigation";

interface FiltersProps {
    nameSearch: (value: string) => void;
    createBtnTxt?: string;
    route: string;
    mb?: string;
    notSearch?: boolean;
}

const Filters: React.FC<FiltersProps> = ({ nameSearch, createBtnTxt, route, mb, notSearch = true }) => {
    const router = useRouter();

    const handleNameSearch = (value: string) => {
        nameSearch(value);
    };

    const handleNavigation = () => {
        router.push(route);
    };

    return (
        <Row justify={createBtnTxt ? "space-between" : "end"} style={{ marginBottom: mb || "20px" }}>
            {createBtnTxt &&
                <Col>
                    <ActionButton btnText={createBtnTxt} handleClick={handleNavigation} bgColor="#4880FF" />
                </Col>
            }
            {notSearch &&
                <Col>
                    <Search
                        placeholder="Search by name"
                        onChange={(e) => handleNameSearch(e.target.value)}
                        className="searchInput"
                        size="large"
                    />
                </Col>
            }
        </Row>
    );
};

export default Filters;