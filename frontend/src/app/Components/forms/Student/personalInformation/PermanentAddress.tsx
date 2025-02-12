import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import InputSelect from "@/app/Components/form/InputSelect";
import InputString from "@/app/Components/form/InputString";
import { Col, Form, FormInstance, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import type { PermanentAddressFormValues } from "./types/types";
import { axiosInstance } from "@/app/configs/axios"; import { current_address } from "@/app/(pages)/students/hooks/useGetByIdStudents";
import ActionButton from "@/app/Components/common/ActionButton";

type PermanentAddressProps = {
  form: FormInstance;
  permanent_address: current_address | null | undefined;
};

const PermanentAddress: React.FC<PermanentAddressProps> = ({ form, permanent_address }) => {
  const [buttonLoading, setButtonLoading] = useState(false);


  // const { studentsData, loading } = useGetByIdStudents();

  useEffect(() => {
    if (permanent_address) {
      // const permanent_address = studentsData?.permanent_address;
      form.setFieldsValue({
        address1: permanent_address?.address1,
        address2: permanent_address?.address2,
        post_code: permanent_address?.post_code,
        country: permanent_address?.country,
        state: permanent_address?.state,
        city: permanent_address?.city,
      })
    }
  }, [permanent_address])

  const handleFinish = async (values: PermanentAddressFormValues) => {

    try {
      setButtonLoading(true);
      const studentId = localStorage.getItem("studentId");
      const response = await axiosInstance.post(`/students/${studentId}/address?mode=PERMANENT`, values)
      if (response.status === 201) {
        message.success("Address updated successfully");
        console.log(response, "address Response");
      } else {
        message.error("Error updating address");
      }
    } catch (error) {
      console.log(error)
    } finally {
      setButtonLoading(false);
    }

  };

  // if (loading) {
  //   return (
  //     <BorderContainer>
  //       <FormTitle title="Permanent Address" />
  //       <div style={{ padding: '24px' }}>
  //         <Skeleton
  //           active
  //           paragraph={{ rows: 6 }}
  //           title={{ width: '30%' }}
  //         />
  //       </div>
  //     </BorderContainer>
  //   )
  // }

  return (
    <>
      <BorderContainer>
        <FormTitle title="Permanent Address" />
        <Form
          form={form}
          layout="vertical"
          className="formStyles"
          onFinish={handleFinish}
        >
          <Row gutter={[24, 16]}>
            <Col span={8}>
              <InputSelect label="Country" name="country" size="large" />
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
                label="State/ Territory"
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

export default PermanentAddress;
