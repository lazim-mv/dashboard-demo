"use client"
import FormTitle from "@/app/Components/common/FormTitle";
import InputSelect from "@/app/Components/form/InputSelect";
import InputString from "@/app/Components/form/InputString";
import { axiosInstance } from "@/app/configs/axios";
import { Form, Input, Row, Col, message, UploadFile } from "antd";
import React, { useEffect, useState } from "react";
// import UploadComponent from "@/app/(pages)/universities/components/UploadComponent";
import useLoadUniversities from "@/app/(pages)/universities/hooks/useGetUniversities";
import InputTags from "../../components/InputTags";
import { useCourseById } from "../../api/fetchCourseById";
import FormLoading from "@/app/Components/common/FormLoading";
import UploadComponent from "@/app/(pages)/universities/components/UploadComponent";
import { useParams } from "next/navigation";
import ActionButton from "@/app/Components/common/ActionButton";

interface Course {
    awards: string[];
    duration: string;
    intake: string[];
    level: string;
    name: string;
    requirements: string[];
    subject: string;
    tution_fee: string;
    university_id: string;
}


interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

// interface PageProps {
//     params: {
//         CourseId: string;
//     }
// }




const Page: React.FC = () => {

    const { CourseId } = useParams() as { CourseId: string };

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm<Course>();
    const [imageUploadId, setImageUploadId] = useState<number | null>(null);
    const [fileList, setFileList] = useState<{
        university_logo?: UploadFile[];
        course_document?: UploadFile[];
    }>({
        university_logo: [],
        course_document: [],
    });

    // const { universityData, loading: universityLoading, errorMessage, refetch } = useLoadUniversities();
    const { universityData } = useLoadUniversities();
    const { course, isLoading, refetch: refetchCourse } = useCourseById(CourseId);



    useEffect(() => {
        if (course) {
            setImageUploadId(course.id);
            form.setFieldsValue({
                name: course?.name,
                university_id: course?.university_id.toString(),
                subject: course?.subject,
                level: course?.level,
                duration: course?.duration,
                awards: course?.awards,
                requirements: course?.requirements,
                tution_fee: course?.tution_fee,
                intake: course?.intake,
            })
        }
    }, [course])

    const universityOptions = universityData?.map((university) => {
        return {
            label: university.university_name,
            value: university.id.toString(),
        };
    })

    // const handleUpload = (files: UploadFile[] | null) => {
    //     setUploaded(files);
    //     console.log('Uploaded files:', files, uploaded);
    // };

    // const handlePreview = (file: UploadFile) => {
    //     console.log('Previewing file:', file);
    // };

    const uploadFiles = async (courseId: string | number) => {
        try {
            const formData = new FormData();
            console.log("uploadfjkdlasjfklasjfkl");

            // Add university logo if exists
            if (fileList.university_logo && fileList.university_logo.length > 0) {
                const logoFile = fileList.university_logo[0].originFileObj || fileList.university_logo[0];
                if (logoFile instanceof File) {
                    formData.append('university_logo', logoFile);
                }
            }

            console.log(fileList, "fjkdaslfjkl");
            console.log(formData, "uploadfjkdlasjfklasjfkl");


            // Add university document if exists
            if (fileList.course_document && fileList.course_document.length > 0) {
                const documentFile = fileList.course_document[0].originFileObj || fileList.course_document[0];
                if (documentFile instanceof File) {
                    formData.append('course_document', documentFile);
                }
            }

            if (formData.keys().next().done) {
                console.warn('No files to upload');
                return;
            }

            console.log(formData, "formDataaa");

            const response = await axiosInstance.post(`/course/upload-docs/${String(courseId)}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                message.success("Files uploaded successfully");
                return response;
            }
        } catch (error) {
            console.error("Error uploading files:", error);
            message.error("Failed to upload files");
        }
    };

    const onFinish = async (values: Course) => {
        const transformedData = {
            name: values.name,
            university_id: parseInt(values.university_id),
            subject: values.subject,
            level: values.level,
            duration: values.duration,
            awards: values.awards,
            requirements: values.requirements,
            tution_fee: values.tution_fee,
            intake: values.intake,
        };

        try {
            setLoading(true);

            if (CourseId) {
                const response = await axiosInstance.patch(`/course/${CourseId}`, transformedData);
                if (response.data && response.status === 200) {
                    message.success("Course updated successfully");
                    setImageUploadId(response.data.id);
                    if (imageUploadId) {
                        await uploadFiles(imageUploadId);
                    } else {
                        await uploadFiles(response.data.data.id);
                    }
                    form.resetFields();
                }
            } else {
                const response = await axiosInstance.post('/course', transformedData);
                if (response.data && response.status === 201) {
                    message.success("Course created successfully");
                    setImageUploadId(response.data.id);
                    await uploadFiles(response.data.data.id);
                    form.resetFields();
                }
            }
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const action = CourseId ? 'update' : 'create';
            message.error(apiError.response?.data?.message || `Failed to ${action} course`);
        } finally {
            setLoading(false);
            refetchCourse();
        }
    };


    return (
        <>
            <FormTitle title='Edit Course' bg='#fff' borderBottom='1px solid #F0F0F0' />
            <Form
                form={form}
                name="edit_course"
                layout="vertical"
                onFinish={onFinish}
                style={{
                    background: "#fff",
                    padding: "40px",
                }}
            >
                {isLoading ? <FormLoading numFields={9} uploadCount={1} /> :
                    <Row gutter={[24, 24]}>
                        <Col span={8}>
                            <Form.Item
                                layout="vertical"
                                label={<span style={{ fontWeight: "500" }}>Course Name</span>}
                                name="name"
                                rules={[{ required: true, message: "Please enter the university name!" }]}
                            >
                                <Input size="large" placeholder="Enter name" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <InputSelect label="University"
                                name="university_id"
                                size="large"
                                options={universityOptions}
                            />
                        </Col>
                        <Col span={8}>
                            <InputSelect label="Subject"
                                name="subject"
                                size="large"
                                type="subject"
                            />
                        </Col>
                        <Col span={8}>
                            <InputSelect
                                label="Level"
                                name="level"
                                size="large"
                                options={[
                                    { value: "HIGHER_SECONDARY", label: "Higher Secondary" },
                                    { value: "UNDERGRADUATE", label: "Undergraduate" },
                                    { value: "GRADUATE", label: "Graduate" },
                                    { value: "DOCTORAL", label: "Doctoral" },
                                ]}
                            />
                        </Col>
                        <Col span={8}>
                            <InputString name="duration" label="Duration" placeHolder="Enter location" />
                        </Col>
                        <Col span={8}>
                            <InputTags label="Awards" name="awards" required={false} maxCount={5} />
                        </Col>
                        <Col span={8}>
                            <InputString name="tution_fee" label="Tution Fee" placeHolder="Tution Fee" />
                        </Col>
                        <Col span={8}>
                            <InputTags label="Intake" name="intake" required={false} intake={true} />
                        </Col>
                        <Col span={8}>
                            <InputTags label="Requirement" name="requirements" required={false} maxCount={5} />
                        </Col>
                        <Col span={24}>
                            <Row>
                                <Col span={6}>
                                    <UploadComponent
                                        handleUpload={(files, fieldName) => {
                                            console.log('Files:', files);
                                            console.log('Field Name:', fieldName);
                                            setFileList(prevState => ({
                                                ...prevState,
                                                [fieldName]: files
                                            }));
                                        }}
                                        fieldName="course_document"
                                        label="Upload Course Doc"
                                        acceptedFileTypes="pdf/*"
                                        initialFileUrl={course?.document_url ? course.document_url : ""}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row justify="end">
                                <ActionButton
                                    shape="round"
                                    btnText="Save"
                                    htmlType="submit"
                                    buttonLoading={loading}
                                />
                            </Row>
                        </Col>
                    </Row>
                }
            </Form>
        </>
    );
};

export default Page;