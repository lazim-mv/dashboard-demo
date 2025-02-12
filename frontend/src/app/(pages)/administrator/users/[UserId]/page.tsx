"use client"
import FormTitle from "@/app/Components/common/FormTitle";
import { axiosInstance } from "@/app/configs/axios";import { Form, Input, Button, Select, Row, Col, message } from "antd";
import React, { useEffect } from "react";
import useLoadRoles from "../../rolemanagement/api/useLoadRoles";
import useLoadPartners from "../api/useLoadPartners";

const { Option } = Select;

// Define interface for form values
interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

// Define interface for API error response
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface Permission {
  id: number;
  type: string;
  resource: string;
  actions: string[];
  created_at: string;
  updated_at: string;
  role_id: number;
}

// interface UserRoles {
//   id: number;
//   name: string;
//   permissions: Permission[];
//   partner_id: number;
// }

interface RoleType {
  id: number;
  name: string;
  partner_id: number;
}

// interface UserDataType {
//   name: string;
//   id: number;
//   email: string;
//   user_roles: { role: { name: string } }[];
// }

type userFormIdType = {
  params: {
    UserId: string;
  };
}



const Page: React.FC<userFormIdType> = ({ params }) => {
  const [form] = Form.useForm<UserFormValues>();
  const { rolesData, loading } = useLoadRoles();
  const { userData } = useLoadPartners();



  console.log(rolesData, "Params");


  useEffect(() => {
    if (userData && userData.length > 0) {
      const matchedUser = userData.find((user) => user.id === Number(params.UserId));
      console.log(matchedUser, "matched user");
      if (matchedUser) {
        form.setFieldsValue({
          name: matchedUser.name,
          email: matchedUser.email,
        });
      }
    }
  }, [userData, params.UserId, form]);

  const onFinish = async (values: UserFormValues) => {
    try {
      const response = await axiosInstance.post("/partners/administration/users", values);

      if (response.data) {
        message.success("User created successfully");
        form.resetFields();
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      message.error(apiError.response?.data?.message || "Failed to create user");
    } finally {
    }
  };





  return (
    <>
      <FormTitle title='Add New User' bg='#fff' borderBottom='1px solid #F0F0F0' />
      <Form
        form={form}
        name="add_user"
        layout="vertical"
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        style={{
          background: "#fff",
          padding: "40px",
        }}
      >
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Form.Item
              layout="vertical"
              label={<span style={{ fontWeight: "500" }}>Name</span>}
              name="name"
              rules={[{ required: true, message: "Please enter the user's name!" }]}
            >
              <Input size="large" placeholder="Enter name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              layout="vertical"
              label={<span style={{ fontWeight: "500" }}>Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter a valid email!" },
                { type: "email", message: "The input is not a valid email!" },
              ]}
            >
              <Input size="large" placeholder="Enter email" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              layout="vertical"
              label={<span style={{ fontWeight: "500" }}>Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter a password!" },
                { min: 6, message: "Password must be at least 6 characters long!" },
              ]}
            >
              <Input.Password size="large" placeholder="Enter password" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              layout="vertical"
              label={<span style={{ fontWeight: "500" }}>Role</span>}
              name="role_id"
              rules={[{ required: true, message: "Please select a role!" }]}
            >
              <Select placeholder="Select a role" size="large" loading={loading}>
                {rolesData?.map((role: RoleType) => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row justify="end">
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  htmlType="submit"
                  loading={loading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Page;