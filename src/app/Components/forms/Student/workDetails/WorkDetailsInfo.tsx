import React, { useEffect, useState } from "react";
import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
// import InputInt from "@/app/Components/form/InputInt";
import InputString from "@/app/Components/form/InputString";
import { Button, Col, DatePicker, Form, FormInstance, message, Row, Skeleton } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { FaCirclePlus } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import { axiosInstance } from "@/app/configs/axios";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";
import ActionButton from "@/app/Components/common/ActionButton";

// import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";

type work_details = {
  title: string;
  organisation: string;
  organisation_address: string;
  phone_no: number | string;
  email: string;
  from_date: Dayjs | null;
  to_date: Dayjs | null;
};

export interface WorkDetail {
  id?: string;
  title?: string;
  organisation?: string;
  organisation_address?: string;
  phone_no?: string;
  email?: string;
  from_date?: string | null;
  to_date?: string | null;
}


interface FormData {
  work_details?: work_details[];
  form?: FormInstance;
  studentsData?: Student | null;
  loading?: boolean;
  refetch?: () => void;
}
const WorkDetailsInfo: React.FC<FormData> = ({ form, studentsData, loading, refetch }) => {
  const [formCount, setFormCount] = useState(1);
  const [existingWorkDetail, setExistingWorkDetail] = useState<WorkDetail[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);

  console.log(studentsData, "studentsDatastudentsData");


  // const { studentsData, loading, refetch } = useGetByIdStudents();


  useEffect(() => {
    if (studentsData && studentsData.work_details.length > 0) {
      const workDetail: WorkDetail[] = studentsData.work_details.map(ref => ({
        id: ref.id.toString(),
        title: ref.title,
        organisation: ref.organisation,
        organisation_address: ref.organisation_address,
        phone_no: ref.phone_no,
        email: ref.email,
        from_date: ref.from_date ? dayjs(ref.from_date).toISOString() : null,
        to_date: ref.to_date ? dayjs(ref.to_date).toISOString() : null,
      }));

      setExistingWorkDetail(workDetail);
      setFormCount(workDetail.length);

      const fieldsToSet: Record<string, string | number | null | dayjs.Dayjs> = {};
      studentsData?.work_details.forEach((wdetail, index) => {
        const indexSuffix = index > 0 ? index : '';

        fieldsToSet[`title${indexSuffix}`] = wdetail.title;
        fieldsToSet[`organisation${indexSuffix}`] = wdetail.organisation;
        fieldsToSet[`organisation_address${indexSuffix}`] = wdetail.organisation_address;
        fieldsToSet[`phone_no${indexSuffix}`] = wdetail.phone_no;
        fieldsToSet[`email${indexSuffix}`] = wdetail.email;
        fieldsToSet[`from_date${indexSuffix}`] = wdetail.from_date ? dayjs(wdetail.from_date) : null;
        fieldsToSet[`to_date${indexSuffix}`] = wdetail.to_date ? dayjs(wdetail.to_date) : null;
      });

      form?.setFieldsValue(fieldsToSet);
    }
  }, [studentsData]);

  const handleAddNew = () => {
    setFormCount(prevCount => prevCount + 1);
  };

  // const handleRemoveItem = () => {
  //   if (formCount === 1) return;
  //   setFormCount(prevCount => prevCount - 1);
  // };

  const handleDateChange = (fieldName: string, date: Dayjs) => {

    console.log(fieldName, date);

  }

  const handleFinish = async (values: work_details) => {
    console.log(values, "WorkDetailsInfo");
    try {
      setButtonLoading(true);
      const transformedData: FormData = {
        work_details: []
      };


      for (let i = existingWorkDetail.length; i < formCount; i++) {
        transformedData?.work_details?.push({
          title: values[`title${i > 0 ? i : ''}`],
          organisation: values[`organisation${i > 0 ? i : ''}`],
          organisation_address: values[`organisation_address${i > 0 ? i : ''}`],
          phone_no: values[`phone_no${i > 0 ? i : ''}`],
          email: values[`email${i > 0 ? i : ''}`],
          from_date: values[`from_date${i > 0 ? i : ''}`],
          to_date: values[`to_date${i > 0 ? i : ''}`]
        });
      }

      const studentId = localStorage.getItem("studentId");

      const response = await axiosInstance.post(`/students/${studentId}/work-details`, transformedData)
      if (response.status === 201) {
        console.log(response, "address Response");
        message.success("Work details saved successfully");
      } else {
        message.error("Failed to save work details")
      }

    } catch (error) {
      console.log(error)
    } finally {
      setButtonLoading(false);
      if (refetch) {
        refetch();
      }
    }
  }

  const handleDeleteWorkDetail = async (index?: number) => {
    if (formCount === 1 || index === undefined) return;

    if (!studentsData && formCount > 1) {
      return setFormCount(prevCount => prevCount - 1);
    }

    const wDetailId = existingWorkDetail[index]?.id;

    try {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        message.error("Student ID not found");
        return;
      }

      if (wDetailId) {

        const response = await axiosInstance.delete(`/students/${studentId}/work-details/${wDetailId}`);

        if (response.status === 200) {
          setExistingWorkDetail(prev => prev.filter(prev => prev.id !== wDetailId));
          setFormCount(prev => Math.max(1, prev - 1));
          message.success("Work detail deleted successfully");
          // refetch()
        } else {
          message.error("Failed to delete Work detail");
        }
      }
    } catch (error) {
      console.error("Error deleting Work detail:", error);
      message.error("An error occurred while deleting the Work detail");
    } finally {
      if (refetch) {
        refetch()
      }
    }
  };


  if (loading) {
    return (
      <BorderContainer>
        <FormTitle title="Work Details Info" />
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
    <BorderContainer>
      <FormTitle title={`Work Details Info`} />
      <Form
        form={form}
        layout="vertical"
        className="formStyles"
        onFinish={handleFinish}
      >
        {[...Array(formCount)].map((_, index) => (
          <div key={index} style={{
            marginBottom: '24px',
            border: '1px solid #d9d9d9',
            padding: '16px',
            borderRadius: '8px',
            position: 'relative',
          }}>
            <Button
              type="text"
              icon={<IoTrashOutline size={20} color="#FF4848" />}
              onClick={() => handleDeleteWorkDetail(index)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 10
              }}
              title="Delete"
            />
            <Row gutter={[24, 16]}>
              <Col span={8}>
                <InputString label="Job Title" name={`title${index > 0 ? index : ''}`} placeHolder="Enter Job Title" />
              </Col>
              <Col span={8}>
                <InputString
                  label="Name of Organisation"
                  name={`organisation${index > 0 ? index : ''}`}
                  placeHolder="Enter Name of Organisation"
                />
              </Col>
              <Col span={8}>
                <InputString
                  label="Address of Organisation"
                  name={`organisation_address${index > 0 ? index : ''}`}
                  placeHolder="Enter Address of Organisation"
                />
              </Col>
              <Col span={8}>
                <InputString label="Phone Number" name={`phone_no${index > 0 ? index : ''}`}
                  placeHolder="Enter Phone Number" />
              </Col>
              <Col span={8}>
                <InputString label="Email" name={`email${index > 0 ? index : ''}`} placeHolder="Enter Email" />
              </Col>
              <Col span={8}>
                <Form.Item
                  label={<span style={{ fontWeight: "500" }}>Issue date</span>}
                  name={`from_date${index > 0 ? index : ''}`}
                  rules={[
                    { required: true, message: `Please select your Issue date` },
                  ]}
                >
                  <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    onChange={(date: Dayjs) => handleDateChange(`from_date${index > 0 ? index : ''}`, date)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={<span style={{ fontWeight: "500" }}>Expiry date</span>}
                  name={`to_date${index > 0 ? index : ''}`}
                  rules={[
                    { required: true, message: `Please select your Expiry date` },
                  ]}
                >
                  <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    onChange={(date: Dayjs) => handleDateChange(`to_date${index > 0 ? index : ''}`, date)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        ))}


        <Row justify="space-between" style={{ marginTop: "24px" }} align="middle">
          <Row>
            <Button
              onClick={handleAddNew}
              icon={<FaCirclePlus size={25} color="#4880FF" />}
              type="text"
              size="large"
              shape="round"
            >
              Add New
            </Button>

          </Row>
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
  );
};



export default WorkDetailsInfo;
