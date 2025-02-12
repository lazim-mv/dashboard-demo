import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import InputSelect from "@/app/Components/form/InputSelect";
import InputString from "@/app/Components/form/InputString";
import { Button, Col, Form, FormInstance, message, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import type { LanguageProficiency } from "./types/types";
import { FaCirclePlus } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import { axiosInstance } from "@/app/configs/axios";

// import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";
import ActionButton from "@/app/Components/common/ActionButton";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";

// type FormProps = {
//   form: FormInstance;
// };

interface LanguageEntry {
  id?: string;
  name: string;
  level_of_proficiencey: string;
  years_of_experience?: number | null;
}

interface FormData {
  languages?: LanguageEntry[];
  form?: FormInstance;
  studentsData?: Student | null;
  loading?: boolean;
  refetch?: () => void;
}

const LanguageProficiency: React.FC<FormData> = ({ form, studentsData, loading, refetch }) => {
  // const [form] = Form.useForm();
  const [formCount, setFormCount] = useState(1);
  const [existingLanguageProficiency, setExistingLanguageProficiency] = useState<LanguageEntry[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);


  // const { studentsData, loading, refetch } = useGetByIdStudents();

  useEffect(() => {
    if (studentsData && studentsData.education && studentsData.education.proficient_languages.length > 0) {
      setExistingLanguageProficiency(studentsData.education.proficient_languages.map(ref => ({
        id: ref.id.toString(),
        name: ref.name,
        level_of_proficiencey: ref.level_of_proficiencey,
        years_of_experience: ref.years_of_experience,
      })));

      setFormCount(studentsData.education.proficient_languages.length);
      const fieldsToSet: Record<string, string | number | null> = {};


      studentsData.education.proficient_languages.forEach((lang, index) => {
        const indexSuffix = index > 0 ? index : '';

        fieldsToSet[`name${indexSuffix}`] = lang.name;
        fieldsToSet[`level_of_proficiencey${indexSuffix}`] = lang.level_of_proficiencey;
        fieldsToSet[`years_of_experience${indexSuffix}`] = lang.years_of_experience;
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

  const handleFinish = async (values: LanguageProficiency) => {

    try {
      setButtonLoading(true);
      const transformedData: FormData = {
        languages: []
      };


      for (let i = existingLanguageProficiency.length; i < formCount; i++) {
        transformedData?.languages?.push({
          name: values[`name${i > 0 ? i : ''}`],
          level_of_proficiencey: values[`level_of_proficiencey${i > 0 ? i : ''}`],
          years_of_experience: parseInt(values[`years_of_experience${i > 0 ? i : ''}`]),
        });
      }

      const studentId = localStorage.getItem("studentId");

      const response = await axiosInstance.post(`/students/${studentId}/languages`, transformedData)
      if (response) {
        console.log(response, "address Response");
        if (studentsData) {
          // refetch();
        }
        message.success("Language details saved successfully");

      } else {
        message.error("Failed to save language details")
      }

    } catch (error) {
      console.log(error)
    } finally {
      setButtonLoading(false);
      if (refetch) {
        refetch();
      }
    }
  };

  const handleDeleteLanguageProficiency = async (index: number) => {
    if (formCount === 1) return;
    const languageId = existingLanguageProficiency[index]?.id;

    if (!studentsData && formCount > 1) {
      return setFormCount(prevCount => prevCount - 1);
    }

    try {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        message.error("Student ID not found");
        return;
      }

      if (languageId) {
        const response = await axiosInstance.delete(`/students/${studentId}/languages/${languageId}`);

        if (response.status === 200) {

          setExistingLanguageProficiency(prev => prev.filter(lang => lang.id !== languageId));
          setFormCount(prev => Math.max(1, prev - 1));
          message.success("Language deleted successfully");
        } else {
          message.error("Failed to delete Language");
        }
      } else {
        setFormCount(prev => Math.max(1, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting Language:", error);
      message.error("An error occurred while deleting the Language");
    } finally {
      if (refetch) {
        refetch()
      }
    }
  };

  if (loading) {
    return (
      <BorderContainer>
        <FormTitle title="Languages" />
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
      <FormTitle title="Languages" />
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
              onClick={() => handleDeleteLanguageProficiency(index)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 10
              }}
              title="Delete Language"
            />

            <Row gutter={[24, 16]}>
              <Col span={8}>
                <InputSelect
                  label="Language"
                  name={`name${index > 0 ? index : ''}`}
                  size="large"
                  type="language"
                />
              </Col>
              <Col span={8}>
                <InputSelect
                  label="Level of Proficiencey"
                  name={`level_of_proficiencey${index > 0 ? index : ''}`}
                  size="large"
                  options={[
                    { value: "12", label: "12" },
                    { value: "10", label: "10" },
                    { value: "graduate", label: "Graduate" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <InputString label="Year of Experience" name={`years_of_experience${index > 0 ? index : ''}`} placeHolder="Enter years of experience" />
              </Col>
            </Row>
          </div>
        ))}

        <Row justify="space-between" style={{ marginTop: "24px" }} align="middle">
          <Row>
            <Button
              icon={<FaCirclePlus size={20} color="#4880FF" />}
              onClick={handleAddNew}
              style={{ border: "none", background: "none" }}
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

export default LanguageProficiency;
