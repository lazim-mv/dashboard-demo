import React, { useState } from 'react'
import styles from '../../styles/courses.module.css'
import BorderContainer from '@/app/Components/common/BorderContainer'
import FormTitle from '@/app/Components/common/FormTitle'
import { Button, Col, Dropdown, message, Row, Table } from 'antd'
import { IoIosArrowDropdown } from "react-icons/io";
import Link from 'next/link'
import { Course } from '../../api/filterCourse'
import { axiosInstance } from '@/app/configs/axios'
import Image from 'next/image'


interface SearchResultProps {
    courseData: Course[]
    page?: boolean;
    onSubmissionDone?: () => void;
}

const CourseDetails = ({ course, page, onSubmissionDone }) => {
    const [rowSummary, setRowSummary] = useState<number | null>(null);


    const handleAddShortlist = async (id: number, intakeValue: string) => {
        try {
            const studentId = localStorage.getItem('studentId');
            const payload = { intake: intakeValue.toUpperCase(), course_id: id }
            console.log(intakeValue, "intakeVAlues");
            const response = await axiosInstance.post(`/students/${studentId}/applications/shortlist`, payload)
            if (response.status === 201) {
                message.success("Course added to shortlist")
                onSubmissionDone();
            } else {
                message.error("Failed to add course to shortlist")
            }

        } catch (error) {
            console.log(error);
        }
    }

    const columns = [
        {
            title: "Course",
            dataIndex: "name",
            key: "name",
            render: (text: string) => text,
        },
        {
            title: "Intake",
            dataIndex: "intake",
            key: "intake",
            render: (intake: string[]) => intake?.join(", ") || 'N/A',
        },
        {
            title: "Level",
            dataIndex: "level",
            key: "level",
        },
        {
            title: "Course Availability",
            dataIndex: "course_availability",
            key: "course_availability",
            render: (availability: string) => availability || 'Not specified',
        },
        {
            title: "Action",
            key: "action",
            render: (record: Course) => {
                return (
                    <Row gutter={[16, 16]}>
                        <Col>
                            <Button
                                type="primary"
                                onClick={() => setRowSummary((prev) => (prev === record.id ? null : record.id))}
                            >
                                {rowSummary === record.id ? "Hide Details" : "View Details"}
                            </Button>
                        </Col>
                        {page && (
                            <Col>
                                <Dropdown
                                    menu={{
                                        items: record?.intake.map((item: string, index: number) => ({
                                            index: index,
                                            key: item,
                                            label: item,
                                        })),
                                        onClick: ({ key }) => handleAddShortlist(record.id, key),
                                    }}

                                    trigger={["hover"]}
                                >
                                    <Button type="primary" icon={<IoIosArrowDropdown size={20} />}>Add to Shortlist</Button>
                                </Dropdown>
                            </Col>
                        )
                        }
                    </Row >
                );
            },
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={course}
                pagination={false}
                rowKey="id"
                bordered
                style={{ width: '100%' }}
            />

            {rowSummary && course.map((item: Course) => (
                <Row key={item.id} gutter={[16, 16]} style={{ padding: '16px', marginTop: '16px', width: "100%" }}>
                    <Col span={24}>
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <p >Duration: {item.duration || 'Not specified'}</p>
                            </Col>
                            <Col span={8}>
                                <p >Awards: {item.awards?.join(", ") || 'No awards'}</p>
                            </Col>
                            <Col span={8}>
                                <p >Tuition Fee: {item.tution_fee || 'Not specified'}</p>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24}>
                        <p >Requirements:</p>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {item.requirements?.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            ))}
        </>
    );
};



const SearchResult: React.FC<SearchResultProps> = ({ courseData, page, onSubmissionDone }) => {
    console.log(courseData, "courseDataCourseData");
    const [openCourseId, setOpenCourseId] = useState<number | null>(null);

    const handleCourseClick = (courseId: number) => {
        setOpenCourseId(openCourseId === courseId ? null : courseId);
    }


    const renderCourseCard = (course: Course) => (
        <Col key={course.id} span={24} >
            <BorderContainer brdrRd="8px" pd="20px 24px">
                <Row justify="space-between">
                    {/* Left Side */}
                    <Col span={18}>
                        <Row gutter={[16, 16]}>
                            <Col span={8} style={{ border: "1px solid #f0f0f0", borderRadius: "8px", alignContent: "center", maxHeight: "100px" }}>
                                <Image
                                    src={course.university.logo_url ? course.university.logo_url : ""}
                                    alt={course?.university?.name || ""}
                                    width={280} height={95}
                                    style={{ width: "100%", height: "85%", objectFit: "contain" }}
                                />
                            </Col>
                            <Col style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "column", marginLeft: "32px" }}>
                                <h5 >{course.name}</h5>
                                <p >{course.university.country} {course.university.location}</p>
                            </Col>
                        </Row>
                        <Row gutter={[12, 12]} align="middle" style={{ margin: "20px", display: "flex", marginLeft: "0px" }}>
                            <Col>
                                <p style={{ marginBottom: "0px", fontWeight: 400 }} >IELTS waiver available: Standard XII: 65%/70% in English Language for undergraduate and postgraduate.</p>
                            </Col>
                            <Col>
                                <Link href="https://ant.design" target="_blank">
                                    View Document
                                </Link>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={6} style={{ display: "flex", justifyContent: "flex-end", alignItems: 'center' }}>
                        <Row gutter={[12, 12]} justify="end" align="middle">
                            <Col>
                                <Button type="primary" size="large" shape="default"
                                    onClick={() => handleCourseClick(course.id)}
                                >View Course</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {openCourseId === course.id &&
                    <Row style={{ marginTop: "24px" }}>
                        <CourseDetails course={[course]} page={page} onSubmissionDone={onSubmissionDone} />
                    </Row>}
            </BorderContainer>
        </Col>
    )

    return (
        <BorderContainer mt="24px" bg="#fff" pd="20px 24px" brdrRd="8px">
            <FormTitle
                fontSize="20px"
                mb="24px"
                title="Search Results"
                bg="#fff"
                padding="0 0 20px 0"
                borderBottom="1px solid #F0F0F0"
            />
            <Row gutter={[0, 16]} className={styles.courseList}>
                {courseData.map(renderCourseCard)}
            </Row>
        </BorderContainer>
    )
}

export default SearchResult