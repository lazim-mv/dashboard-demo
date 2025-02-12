import BorderContainer from "@/app/Components/common/BorderContainer";
import FormTitle from "@/app/Components/common/FormTitle";
import InputDatePicker from "@/app/Components/form/InputDatePicker";
import InputSelect from "@/app/Components/form/InputSelect";
import InputString from "@/app/Components/form/InputString";
import { Button, Col, Form, FormInstance, message, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import { axiosInstance } from "@/app/configs/axios";

// import useGetByIdStudents from "@/app/(pages)/students/hooks/useGetByIdStudents";
import dayjs from "dayjs";
import ActionButton from "@/app/Components/common/ActionButton";
import { Student } from "@/app/(pages)/students/hooks/useGetByIdStudents";

enum LevelOfStudy {
  HIGHER_SECONDARY = "HIGHER_SECONDARY",
  UNDERGRADUATE = "UNDERGRADUATE",
  GRADUATE = "GRADUATE",
  DOCTORAL = "DOCTORAL"
}

interface EducationEntry {
  id?: string;
  country: string;
  institution: string;
  course: string;
  level_of_study: LevelOfStudy;
  start_date: string;
  end_date: string;
  result_percent: number;
}

export interface AcademicHistory {
  id: string;
  country: string;
  institution: string;
  course: string;
  level_of_study: string;
  start_date: string | null;
  end_date: string | null;
  result_percent: number;
  student_education_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface FormData {
  data?: EducationEntry[];
  form?: FormInstance;
  studentsData?: Student | null;
  loading?: boolean;
  refetch?: () => void;
}

const RecentGraduate: React.FC<FormData> = ({ form, studentsData, loading, refetch }) => {
  const [formCount, setFormCount] = useState(1);
  const [existingEducationHistory, setExistingEducationHistory] = useState<AcademicHistory[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);


  // const { studentsData, loading, refetch } = useGetByIdStudents();


  useEffect(() => {
    if (studentsData && studentsData?.education?.academic_history?.length > 0) {
      console.log(studentsData, "studentsDataEducation");
      const academicHistory: AcademicHistory[] = studentsData.education.academic_history.map(ref => ({
        id: ref.id.toString(),
        country: ref.country,
        institution: ref.institution,
        course: ref.course,
        level_of_study: ref.level_of_study,
        start_date: ref.start_date ? dayjs(ref.start_date).toISOString() : null,
        end_date: ref.end_date ? dayjs(ref.end_date).toISOString() : null,
        result_percent: ref.result_percent,
        student_education_id: ref.student_education_id
      }));

      setExistingEducationHistory(academicHistory);
      setFormCount(academicHistory.length);

      const fieldsToSet: Record<string, string | number | null | dayjs.Dayjs> = {};
      academicHistory.forEach((education, index) => {
        const indexSuffix = index > 0 ? index : '';

        fieldsToSet[`country${indexSuffix}`] = education.country;
        fieldsToSet[`institution${indexSuffix}`] = education.institution;
        fieldsToSet[`level_of_study${indexSuffix}`] = education.level_of_study;
        fieldsToSet[`course${indexSuffix}`] = education.course;
        fieldsToSet[`result_percent${indexSuffix}`] = education.result_percent;
        fieldsToSet[`start_date${indexSuffix}`] = education.start_date ? dayjs(education.start_date) : null;
        fieldsToSet[`end_date${indexSuffix}`] = education.end_date ? dayjs(education.end_date) : null;
      });

      form?.setFieldsValue(fieldsToSet);
    }
  }, [studentsData]);

  const handleFinish = async (values: EducationEntry) => {
    try {
      setButtonLoading(true)
      const transformedData: FormData = {
        data: []
      };

      // Determine how many new entries were added
      // const newEntriesCount = formCount - (existingEducationHistory?.length || 0);

      // Send only the new entries
      for (let i = existingEducationHistory.length; i < formCount; i++) {
        const indexSuffix = i > 0 ? i : '';

        transformedData?.data?.push({
          country: values[`country${indexSuffix}`],
          institution: values[`institution${indexSuffix}`],
          course: values[`course${indexSuffix}`],
          level_of_study: values[`level_of_study${indexSuffix}`],
          start_date: values[`start_date${indexSuffix}`]?.toISOString() || new Date().toISOString(),
          end_date: values[`end_date${indexSuffix}`]?.toISOString() || new Date().toISOString(),
          result_percent: parseFloat(values[`result_percent${indexSuffix}`] || '0')
        });
      }

      const studentId = localStorage.getItem("studentId");
      const response = await axiosInstance.post(`/students/${studentId}/completed-education`, transformedData);

      if (response.status) {
        message.success(`Education detail(s) saved successfully`);
        setButtonLoading(false)
        if (studentsData) {
          setButtonLoading(false)
        }
      } else {
        message.error("Failed to save education details");
        setButtonLoading(false)
      }
    } catch (error) {
      setButtonLoading(false)
      console.error("Error saving education details:", error);
      message.error("An error occurred while saving education details");
    } finally {
      if (refetch) {
        refetch()
        setButtonLoading(false)
      }
    }
  };


  const handleDeleteEducationHistory = async (index?: number) => {
    if (formCount === 1 || index === undefined) return;

    const educationId = existingEducationHistory[index]?.id;

    if (!studentsData && formCount > 1) {
      return setFormCount(prevCount => prevCount - 1);
    }

    try {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        message.error("Student ID not found");
        return;
      }

      if (educationId) {
        const response = await axiosInstance.delete(`/students/${studentId}/completed-education/${educationId}`);

        if (response.status === 200) {
          setExistingEducationHistory(prev => prev.filter(edu => edu.id !== educationId));
          setFormCount(prev => Math.max(1, prev - 1));
          message.success("Education history deleted successfully");
        } else {
          message.error("Failed to delete Education history");
        }
      } else {
        setFormCount(prev => Math.max(1, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting Education history:", error);
      message.error("An error occurred while deleting the Education history");
    } finally {
      if (refetch) {
        refetch()
      }
    }
  };

  const handleAddNew = () => {
    setFormCount(prevCount => prevCount + 1);
  };

  if (loading) {
    return (
      <BorderContainer>
        <FormTitle title="Education Details" />
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
      <FormTitle title="Info: For latest completed" />
      <Form
        form={form}
        layout="vertical"
        className="formStyles"
        onFinish={handleFinish}
      >
        {[...Array(formCount)].map((_, index) => (
          <div
            key={index}
            style={{
              marginBottom: '24px',
              border: '1px solid #d9d9d9',
              padding: '16px',
              borderRadius: '8px',
              position: "relative"
            }}
          >

            <Button
              type="text"
              icon={<IoTrashOutline size={20} color="#FF4848" />}
              onClick={() => handleDeleteEducationHistory(index)}
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
                <InputSelect
                  label="Country"
                  name={`country${index > 0 ? index : ''}`}
                  size="large"
                  type="country"
                // rules={[{ required: true, message: 'Please select a country' }]}
                />
              </Col>
              <Col span={8}>
                <InputString
                  label="Institution"
                  name={`institution${index > 0 ? index : ''}`}
                  rules={[{ required: true, message: 'Please enter institution' }]}
                  placeHolder="Enter Institution"
                />
              </Col>
              <Col span={8}>
                <InputString
                  label="Course"
                  name={`course${index > 0 ? index : ''}`}
                  rules={[{ required: true, message: 'Please enter course' }]}
                  placeHolder="Enter Course"
                />
              </Col>
              <Col span={8}>
                <InputSelect
                  label="Level of study"
                  name={`level_of_study${index > 0 ? index : ''}`}
                  size="large"
                  options={[
                    { value: LevelOfStudy.HIGHER_SECONDARY, label: "Higher Secondary" },
                    { value: LevelOfStudy.UNDERGRADUATE, label: "Undergraduate" },
                    { value: LevelOfStudy.GRADUATE, label: "Graduate" },
                    { value: LevelOfStudy.DOCTORAL, label: "Doctoral" },
                  ]}
                // rules={[{ required: true, message: 'Please select level of study' }]}
                />
              </Col>
              <Col span={8}>
                <InputDatePicker
                  label="Start Date"
                  name={`start_date${index > 0 ? index : ''}`}
                // rules={[{ required: true, message: 'Please select start date' }]}
                />
              </Col>
              <Col span={8}>
                <InputDatePicker
                  label="End Date"
                  name={`end_date${index > 0 ? index : ''}`}
                // rules={[{ required: true, message: 'Please select end date' }]}
                />
              </Col>
              <Col span={8}>
                <InputString
                  label="Result info - Percentage"
                  name={`result_percent${index > 0 ? index : ''}`}
                  rules={[
                    { required: true, message: 'Please enter result percentage' },
                    {
                      validator: (_, value) => {
                        const numValue = parseFloat(value);
                        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
                          return Promise.reject('Please enter a valid percentage between 0 and 100');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                  placeHolder="Enter Result Percentage"
                />
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
              type="text"
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

export default RecentGraduate;