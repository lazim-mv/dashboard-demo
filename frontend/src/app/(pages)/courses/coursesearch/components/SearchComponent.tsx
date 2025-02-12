"use client"
import BorderContainer from '@/app/Components/common/BorderContainer'
import Filters from '@/app/Components/common/Filters'
import FormTitle from '@/app/Components/common/FormTitle'
import InputSelect from '@/app/Components/form/InputSelect'
import { Button, Col, Empty, Form, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { filterCourse, FetchCoursesParams, Course } from '../../api/filterCourse'
import InputTags from '../../components/InputTags'
import { IoRefresh, IoSearch } from "react-icons/io5";
import SearchResult from './SearchResult'
import ShortlistTable from '@/app/Components/forms/Student/shortlistandApply/ShortlistTable'
import { useSearchParams } from 'next/navigation'
import FormLoading from '@/app/Components/common/FormLoading'
import useLoadUniversities from '@/app/(pages)/universities/hooks/useGetUniversities'

type componentProps = {
    page?: boolean;
}


const SearchComponent: React.FC<componentProps> = ({ page }) => {

    const searchParams = useSearchParams();
    const university = searchParams.get('university');
    // const { universityData: universities } = useLoadUniversities();



    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [courseData, setCourseData] = useState<Course[]>([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    // const [pageSkip, setPageSkip] = useState<number>(0);
    const [pageSkip] = useState<number>(0);
    // const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [hasMore, setHasMore] = useState<boolean>(true);

    console.log(hasMore, selectedState);

    const [shouldRefetch, setShouldRefetch] = useState(false);

    useEffect(() => {
        if (selectedCountry) {
            setSelectedCountry(selectedCountry[0])
        }
    }, [selectedCountry])

    const handleRefetchTrigger = () => {
        setShouldRefetch(true);
    };

    const handleRefetchComplete = () => {
        setShouldRefetch(false);
    };


    useEffect(() => {
        if (university) {
            form.setFieldsValue({ university_id: university })
            loadCourses({ universityId: university })
        }
    }, [university])

    const { universityData, loading: universityLoading } = useLoadUniversities();

    const universityOptions = universityData?.map((university) => {
        return {
            label: university.university_name,
            value: university.id.toString(),
        };
    }) || [];


    const loadCourses = async (filterParams: FetchCoursesParams = {}) => {
        setLoading(true);
        try {
            const response = await filterCourse({
                take: pageSize,
                skip: pageSkip,
                ...filterParams
            });

            console.log('Course Filter Response:', response);

            if (response && response.data && response.data.courses) {
                setCourseData(response.data.courses);

                const meta = response.data.meta;
                const totalCourses = meta.total;
                const loadedCourses = meta.skip + meta.take;

                setHasMore(loadedCourses < totalCourses);
            } else {
                setCourseData([]);
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            setCourseData([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };



    const handleSearch = () => {
        const formValues = form.getFieldsValue();
        const filterParams: FetchCoursesParams = {
            orderBy: "desc",
            country: formValues.country,
            location: formValues.location,
            level: formValues.level_of_study,
            universityId: formValues.university_id,
            subject: formValues.subject,
            intake: formValues.intake?.join(','),
        };
        const cleanedFilterParams = Object.fromEntries(
            Object.entries(filterParams).filter(([, v]) => v != null && v !== '')
        );
        loadCourses(cleanedFilterParams);
    };


    const handleReset = () => {
        form.resetFields();
        setCourseData([]);
        setHasMore(false);
    };

    const handleSearchFilter = () => {
        console.log("search");
    }


    return (
        <>
            {page && <ShortlistTable shouldRefetch={shouldRefetch} onRefetchComplete={handleRefetchComplete} />}
            <BorderContainer mt="0" bg="#fff" pd={page ? "0" : "20px 24px"} brdrRd="8px" border={page ? "none" : "1px solid #f0f0f0"}>
                {!page &&
                    <>
                        <FormTitle
                            fontSize="20px"
                            mb="24px"
                            title="Course"
                            bg="#fff"
                            padding="0 0 20px 0"
                            borderBottom="1px solid #F0F0F0"
                        />
                        <Filters
                            createBtnTxt="Create New"
                            route="/courses/list/form"
                            nameSearch={handleSearchFilter}
                            notSearch={false}
                        />
                    </>
                }
                <BorderContainer>
                    <FormTitle title="Search Course" />
                    <Form
                        form={form}
                        layout="vertical"
                        className="formStyles"
                    >
                        {universityLoading ? <FormLoading /> :
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <InputSelect label="Country"
                                        mode='multiple'
                                        maxCount={1}
                                        name="country"
                                        size="large"
                                        type="country"
                                        required={false}
                                        onCountryChange={setSelectedCountry}
                                    />
                                </Col>
                                <Col span={8}>
                                    <InputSelect
                                        label="State/Province"
                                        mode='multiple'
                                        maxCount={1}
                                        name="location"
                                        type="state"
                                        required={false}
                                        selectedCountry={selectedCountry}
                                        onStateChange={setSelectedState}
                                    />
                                </Col>
                                <Col span={8}>
                                    <InputSelect
                                        mode='multiple'
                                        maxCount={1}
                                        label="Level of study"
                                        name="level_of_study"
                                        size="large"
                                        required={false}
                                        options={[
                                            { value: "HIGHER_SECONDARY", label: "Higher Secondary" },
                                            { value: "UNDERGRADUATE", label: "Undergraduate" },
                                            { value: "GRADUATE", label: "Graduate" },
                                            { value: "DOCTORAL", label: "Doctoral" },
                                        ]}
                                    />
                                </Col>
                                <Col span={8}>
                                    <InputSelect
                                        mode='multiple'
                                        maxCount={1}
                                        label="University"
                                        name="university_id"
                                        size="large"
                                        required={false}
                                        options={universityOptions}
                                    />
                                </Col>
                                <Col span={8}>
                                    <InputSelect
                                        mode='multiple'
                                        maxCount={1}
                                        label="Subject"
                                        name="subject"
                                        size="large"
                                        required={false}
                                        type="subject"
                                    />
                                </Col>
                                <Col span={8}>
                                    <InputTags
                                        label="Intake"
                                        name="intake"
                                        required={false}
                                        intake={true}
                                    />
                                </Col>
                                <Col span={24}>
                                    <Row justify="end" gutter={[16, 16]} style={{ marginTop: '24px' }}>
                                        <Col>
                                            <Button icon={<IoRefresh />} type="default" shape="round" onClick={handleReset}>Reset</Button>
                                        </Col>
                                        <Col>
                                            <Button icon={<IoSearch />} type="primary" shape="round" onClick={handleSearch}>Search</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        }
                    </Form>

                    {loading ?
                        <Empty description="Loading courses..." />
                        : courseData.length < 1 ? <Empty description="No courses found, Try searching with different filters" /> : (
                            <>
                                <SearchResult courseData={courseData} page={page} onSubmissionDone={handleRefetchTrigger} />
                            </>
                        )}
                </BorderContainer>
            </BorderContainer>
        </>
    )
}

export default SearchComponent