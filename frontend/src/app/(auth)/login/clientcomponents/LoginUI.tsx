"use client";
import React, { useCallback, useState } from "react";
import type { FormProps } from "antd";
import { Button, Col, Form, Input, Row, Space, Switch } from "antd";
import { useRouter } from "next/navigation";
import { axios, axiosInstance } from "@/app/configs/axios";
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AxiosError } from 'axios';


interface User {
  id: number;
  email: string;
  parent_role: "SUPER_ADMIN" | "PARTNER_ADMIN";
  partner_id: number | null;
  user_roles: string[];
}

interface Screen {
  id: number;
  resource: string;
  actions: string[];
  role_id: number;
  parent_screen_id: number | null;
  sub_screens: [];
}

interface CustomJwtPayload extends JwtPayload {
  user: User;
  iat: number;
  exp: number;
}

type FieldType = {
  username: string;
  password: string;
  remember: boolean;
};

type UserRole = {
  name: string;
  permissions: Permission[];
};

type Permission = {
  resource: string;
  actions: Action[];
  type: PermissionType;
};

type Action = "READ" | "WRITE" | "UPDATE";

type PermissionType = "NORMAL" | "SPECIAL" | "LIMITED";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  screens: Screen[]
  user_roles: UserRole[];
}

interface partnerResponse {
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile_no: string;
    status: string;
    whatsapp_no: string | null;
    company_name: string;
    website: string | null;
    address: string | null;
    city: string | null;
    post_code: string | null;
    country: string | null;
    can_upload_docs: boolean;
    resubmit_note: string | null;
    pan_card_url: string;
    cancelled_cheque_url: string;
    gst_spice_letter_url: string;
  }
}

interface ErrorResponse {
  message: string;
}

const LoginUI: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onFinish: FormProps<FieldType>["onFinish"] = useCallback(
    async (values: FieldType) => {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.post<LoginResponse>("/auth/login", {
          email: values.username,
          password: values.password
        });

        if (response.data?.access_token && response.data?.refresh_token) {
          const cookieOptions = {
            secure: false,
            sameSite: 'strict' as const,
            domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
            path: '/'
          };

          Cookies.set('access_token_level_up', response.data.access_token, {
            ...cookieOptions,
            expires: 1 / 288
          });

          Cookies.set('refresh_token_level_up', response.data.refresh_token, {
            ...cookieOptions,
            expires: values.remember ? 7 : 1
          });

          const decodedToken = jwtDecode<CustomJwtPayload>(response.data.access_token);


          if (decodedToken?.user?.parent_role === "SUPER_ADMIN") {
            router.push('/dashboard');
            return;
          }

          if (decodedToken?.user?.parent_role === "PARTNER_ADMIN") {
            console.log(decodedToken, "responseData")
            localStorage.setItem("Screens", JSON.stringify(decodedToken.user.user_roles));
            try {
              const partnerResponse = await axiosInstance.get<partnerResponse>(`/partners/authed`);
              const redirectRoute = partnerResponse.data.data.can_upload_docs
                ? '/onboarding'
                : '/dashboard';

              router.push(redirectRoute);
            } catch (partnerError) {
              console.log(partnerError);
              router.push('/dashboard');
            }
            return;
          }
          router.push('/dashboard');
          setIsLoading(false);

        }
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else if (axiosError.request) {
          setError("No response from server. Please try again.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
  };

  const onChange = (checked: boolean) => {
    console.log(`Remember me: ${checked}`);
  };

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: "flex",
      }}
    >
      <Row align="middle" justify="center" style={{ height: "100vh" }}>
        <Form
          name="login"
          layout="vertical"
          style={{
            maxWidth: 600,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "44px 34px",
            width: "418px",
            height: "500px",
          }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row align="middle" justify="center" style={{ marginBottom: "32px" }}>
            <Col>
              <h2>Welcome Back</h2>
              <p>Enter your email and password to sign in</p>
            </Col>
          </Row>

          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input size="large" placeholder="Enter your username" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Row justify="start">
            <Form.Item<FieldType> name="remember" valuePropName="checked">
              <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginTop: "20px", marginBottom: "32px" }}>
                <Col>
                  <Switch defaultChecked onChange={onChange} title="Remember me" />
                </Col>
                <Col >
                  <p style={{ marginBottom: "0" }}>Remember me</p>
                </Col>
              </Row>
            </Form.Item>
          </Row>

          <Row style={{ width: "100%" }}>
            <Form.Item style={{ width: "100%" }}>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </Form.Item>
          </Row>

          {error && (
            <Row justify="center">
              <p style={{ color: "red" }}>{error}</p>
            </Row>
          )}
        </Form>
      </Row>
    </Space>
  );
};

export default LoginUI;