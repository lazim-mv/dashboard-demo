"use client";
import { Button, Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import Image from "next/image";
import React from "react";
import styles from "./header.module.css";
import { useRouter } from "next/navigation";
import { useProfileData } from "@/app/hooks/useProfileData";
import Cookies from 'js-cookie';


interface CustomHeaderProps {
  logout?: boolean; // optional prop with a boolean type
}

const CustomHeader = ({ logout = true }: CustomHeaderProps) => {
  const router = useRouter();
  // const { profile, loading, error } = useProfileData();
  const { profile } = useProfileData();

  const handleLogout = async () => {
    localStorage.removeItem("Screens");
    await fetch("/api/auth/logout");
    Cookies.remove('access_token_level_up', {
      path: '/',
      domain: undefined // Important for IP-based deployment
    });
    Cookies.remove('refresh_token_level_up', {
      path: '/',
      domain: undefined // Important for IP-based deployment
    });

    // Fallback: manual cookie deletion
    document.cookie = 'access_token_level_up=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh_token_level_up=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Redirect to login
    router.push('/login');
    router.push("/login");
  };

  return (
    <Row
      style={{ height: "64px", padding: "0px 24px", background: "#001529" }}
      align="middle"
      justify="space-between"
    >
      <Col>
        <h3 style={{ color: "#fff" }}>European Universities</h3>
      </Col>
      <Col>
        {logout && (
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <Image
                src="/header/2.svg"
                width={20}
                height={20}
                alt="customer"
                className={styles.icon}
              />
            </Col>
            <Col>
              <Title level={4} style={{ color: "#fff", margin: "0px 8px" }}>
                {profile?.email}
              </Title>
            </Col>
            <Button onClick={handleLogout}>Log out</Button>
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default CustomHeader;
