import { Col, Form, FormInstance, message, Row, Skeleton } from 'antd';
import { AxiosError } from 'axios';
import BorderContainer from '@/app/Components/common/BorderContainer';
import FormTitle from '@/app/Components/common/FormTitle';
import InputString from '@/app/Components/form/InputString';
// import InputInt from '@/app/Components/form/InputInt';
import InputDatePicker from '@/app/Components/form/InputDatePicker';
import InputSelect from '@/app/Components/form/InputSelect';
import { useEffect, useState } from 'react';
import { Student } from '@/app/(pages)/students/hooks/useGetByIdStudents';
import dayjs from 'dayjs';
import { axiosInstance } from '@/app/configs/axios';
import ActionButton from '@/app/Components/common/ActionButton';
import { useParams } from 'next/navigation';


export type PersonalInformationFormValues = {
  name: string;
  surname: string;
  email: string;
  phone_no: string;
  dob: string;
  gender: string;
  nationality: string;
  birth_country: string;
  native_language: string;
  passport_issue_location: string;
  passport_number: string;
  issue_date: string;
  expiry_date: string;
  skype_id?: string;
  alternate_phone_no?: string;
};

interface ErrorResponse {
  message: string;
}

type FormProps = {
  form: FormInstance;
  studentsData: Student | null;
  loading: boolean;
  refetch?: () => void;
};

export const patchPersonalInformation = async (
  StudentId: string,
  values: PersonalInformationFormValues
) => {
  try {
    const response = await axiosInstance.patch(`/students/${StudentId}/personal-details`, values);

    message.success('Personal information updated successfully');
    return response.data;

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorResponse = error.response?.data as ErrorResponse | undefined;
      message.error(errorResponse?.message || "Failed to update student");
    } else {
      message.error("An unexpected error occurred");
    }
  }
};

export const submitPersonalInformation = async (
  values: PersonalInformationFormValues
) => {
  try {
    const requiredFields: (keyof PersonalInformationFormValues)[] = [
      'name', 'surname', 'email', 'phone_no', 'dob',
      'gender', 'nationality', 'birth_country',
      'native_language', 'passport_issue_location',
      'passport_number', 'issue_date', 'expiry_date'
    ];

    const missingFields = requiredFields.filter(field => !values[field]);
    if (missingFields.length > 0) {
      message.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    const response = await axiosInstance.post('/students/personal-details', values);

    message.success('Personal information saved successfully');
    return response.data;

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorResponse = error.response?.data as ErrorResponse | undefined;
      message.error(errorResponse?.message || "Failed to create user");
    } else {
      message.error("An unexpected error occurred");
    }
  }
};

const PersonalInformation: React.FC<FormProps> = ({ form, studentsData, loading }) => {
  const { StudentId } = useParams() as { StudentId: string };
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (studentsData) {
      localStorage.setItem('studentId', String(StudentId));

      const dob = studentsData?.dob ? dayjs(studentsData.dob) : null;
      const issueDate = studentsData?.issue_date ? dayjs(studentsData.issue_date) : null;
      const expiryDate = studentsData?.expiry_date ? dayjs(studentsData.expiry_date) : null;

      form.setFieldsValue({
        name: studentsData?.name,
        surname: studentsData?.surname,
        email: studentsData?.email,
        phone_no: studentsData?.phone_no,
        dob: dob,
        birth_country: studentsData?.birth_country,
        gender: studentsData?.gender,
        nationality: studentsData?.nationality,
        native_language: studentsData?.native_language,
        passport_issue_location: studentsData?.passport_issue_location,
        passport_number: studentsData?.passport_number,
        issue_date: issueDate,
        expiry_date: expiryDate,
        skype_id: studentsData?.skype_id,
        alternate_phone_no: studentsData?.alternate_phone_no
      })
    }
  }, [studentsData])


  const handleFinish = async (values: PersonalInformationFormValues) => {
    try {
      setButtonLoading(true);
      if (StudentId) {
        const result = await patchPersonalInformation(StudentId, values);
        if (result) {
          console.log(result, "resultid");
        }
      }
      else {
        const result = await submitPersonalInformation(values);
        if (result) {
          console.log(result, "resultid");
          localStorage.setItem('studentId', result?.data?.id);
          // form.resetFields();
        }
      }


    } catch (error) {
      console.error("Error submitting personal information:", error);
      message.error("Failed to submit personal information");
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading) {
    return (
      <BorderContainer>
        <FormTitle title="Personal Information" />
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
      <FormTitle title="Personal Information" />
      <Form
        form={form}
        layout="vertical"
        className="formStyles"
        onFinish={handleFinish}
      >
        <Row gutter={[24, 16]}>
          <Col span={8}>
            <InputString label="Given Name" name="name" placeHolder="Enter Name as passport" />
          </Col>
          <Col span={8}>
            <InputString label="Surname" name="surname" placeHolder="Enter Name as passport" />
          </Col>
          <Col span={8}>
            <InputString label="Email" name="email" placeHolder="Enter Email" />
          </Col>
          <Col span={8}>
            <InputString label="Phone Number" name="phone_no" placeHolder="Enter Phone Number" />
          </Col>

          {/* <Col span={8}>
            <InputInt label="Phone Number" name="phone_no" />
          </Col> */}
          <Col span={8}>
            <InputDatePicker label="Date Of Birth" name="dob" />
          </Col>
          <Col span={8}>
            <InputSelect
              label="Gender"
              name="gender"
              size="large"
              options={[
                { value: "MALE", label: "Male" },
                { value: "FEMALE", label: "Female" },
                { value: "OTHER", label: "Other" },
              ]}
            />
          </Col>

          <Col span={8}>
            <InputSelect label="Nationality" name="nationality" size="large" />
          </Col>
          <Col span={8}>
            <InputSelect
              label="Country Of Birth"
              name="birth_country"
              size="large"
            />
          </Col>
          <Col span={8}>
            <InputSelect
              label="What is your native language?"
              name="native_language"
              size="large"
              type="language"
            />
          </Col>

          <Col span={8}>
            <InputSelect
              label="Passport issue location"
              name="passport_issue_location"
              size="large"
            />
          </Col>
          <Col span={8}>
            <InputString label="Passport number" name="passport_number" placeHolder="Enter Passport number" />
          </Col>
          <Col span={8}>
            <InputDatePicker label="Issue date" name="issue_date" />
          </Col>

          <Col span={8}>
            <InputDatePicker label="Expiry date" name="expiry_date" />
          </Col>

          <Col span={8}>
            <InputString label="Skype ID" name="skype_id" placeHolder="Enter Skype ID" />
          </Col>
          <Col span={8}>
            <InputString label="Alternative Number" name="alternate_phone_no" placeHolder="Enter Alternative Number" />
          </Col>
          {/* <Col span={8}>
            <InputInt label="Alternative Number" name="alternate_phone_no" />
          </Col> */}
        </Row>

        <Row justify="end" style={{ marginTop: '24px' }}>
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

export default PersonalInformation;