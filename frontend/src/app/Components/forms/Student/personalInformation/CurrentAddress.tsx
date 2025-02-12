import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import InputSelect from "@/app/Components/form/InputSelect";
import InputString from "@/app/Components/form/InputString";
import { Checkbox, Col, Form, FormInstance, message, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import PermanentAddress from "./PermanentAddress";
import type { CurrentAddressFormValues } from "./types/types";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { axiosInstance } from "@/app/configs/axios";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";
import ActionButton from "@/app/Components/common/ActionButton";
// import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";

type FormProps = {
  form: FormInstance;
  studentsData: Student | null;
  loading: boolean;
};

const CurrentAddress: React.FC<FormProps> = ({ form, studentsData, loading }) => {
  const [permanentForm] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);

  // const { studentsData, loading } = useGetByIdStudents();

  useEffect(() => {
    if (studentsData) {
      // const {address1, address2, post_code, state, city} = studentsData.current_address;
      const permanent_address = studentsData?.permanent_address;
      form.setFieldsValue({
        address1: permanent_address?.address1,
        address2: permanent_address?.address2,
        post_code: permanent_address?.post_code,
        country: permanent_address?.country,
        state: permanent_address?.state,
        city: permanent_address?.city,
      })
    }
  }, [studentsData])


  const handleFinish = async (values: CurrentAddressFormValues) => {
    try {
      setButtonLoading(true)
      const studentId = localStorage.getItem("studentId");
      const response = await axiosInstance.post(`/students/${studentId}/address`, values)
      if (response.status === 201) {
        console.log(response, "address Response");
        message.success("Address updated successfully")
      } else {
        message.error("Error updating address");
      }

    } catch (error) {
      console.log(error)
      setButtonLoading(false);
    } finally {
      setButtonLoading(false)
    }
  };

  const handleSameAsPermanentChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      const permanentAddress = permanentForm.getFieldsValue();
      console.log(permanentAddress, "permanentAddress");
      form.setFieldsValue({
        country: permanentAddress.country,
        address1: permanentAddress.address1,
        address2: permanentAddress.address2,
        post_code: permanentAddress.post_code,
        state: permanentAddress.state,
        city: permanentAddress.city,
      });
    } else {
      form.resetFields();
    }
  };

  if (!studentsData && loading) {
    return (
      <BorderContainer>
        <FormTitle title="Current Address" />
        <div style={{ padding: '24px' }}>
          <Skeleton
            active
            paragraph={{ rows: 6 }}
            title={{ width: '30%' }}
          />
        </div>
      </BorderContainer>
    )
  }

  return (
    <>
      <PermanentAddress form={permanentForm} permanent_address={studentsData?.permanent_address} />
      <BorderContainer>
        <FormTitle title="Current Address" />
        <Form
          form={form}
          layout="vertical"
          className="formStyles"
          onFinish={handleFinish}
        >
          <Checkbox
            onChange={handleSameAsPermanentChange}
            style={{ marginBottom: "24px" }}
          >
            <span style={{ fontWeight: "500" }}>Same as Permanent Address</span>
          </Checkbox>

          <Row gutter={[24, 16]}>
            <Col span={8}>
              <InputSelect
                label="Country of residence"
                name="country"
                size="large"
              />
            </Col>
            <Col span={8}>
              <InputString label="Address 1" name="address1" placeHolder="Enter Address" />
            </Col>
            <Col span={8}>
              <InputString label="Address 2" name="address2" placeHolder="Enter Address" />
            </Col>
            <Col span={8}>
              <InputString label="Post Code" name="post_code" placeHolder="Enter Post Code" />
            </Col>
            <Col span={8}>
              <InputSelect
                label="State/ territory"
                name="state"
                size="large"
                options={[
                  { value: "india", label: "India" },
                  { value: "usa", label: "USA" },
                  { value: "dubai", label: "Dubai" },
                ]}
              />
            </Col>
            <Col span={8}>
              <InputSelect
                label="City"
                name="city"
                size="large"
                options={[
                  { value: "india", label: "India" },
                  { value: "usa", label: "USA" },
                  { value: "dubai", label: "Dubai" },
                ]}
              />
            </Col>
          </Row>

          <Row justify="end" style={{ marginTop: "24px" }}>
            {/* <Button type="primary" htmlType="submit" size="large" shape="round">
              Save
            </Button> */}

            <ActionButton
              shape="round"
              btnText="Save"
              htmlType="submit"
              buttonLoading={buttonLoading}
            />
          </Row>
        </Form>
      </BorderContainer>
    </>
  );
};

export default CurrentAddress;
