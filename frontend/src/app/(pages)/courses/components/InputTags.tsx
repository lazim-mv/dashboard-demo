import React from 'react';
import { Form, Select } from 'antd';
import type { SelectProps } from 'antd';

// const options: SelectProps['options'] = [];


const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];



const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};

interface InputTagsProps {
    name: string;
    label: string;
    required: boolean;
    intake?: boolean;
    maxCount?: number;
}

const InputTags: React.FC<InputTagsProps> = ({ name, label, required, intake = false, maxCount = 1 }) => {
    const options: SelectProps["options"] = intake
        ? months.map((month) => ({ label: month, value: month }))
        : [];

    return (
        <Form.Item
            label={<span style={{ fontWeight: "500" }}>{label}</span>}
            name={name}
            rules={[{ required: required, message: `Please select your ${label}` }]}
        >
            <Select
                maxCount={maxCount}
                mode="tags"
                style={{ width: '100%' }}
                placeholder={`Enter your ${label}`}
                onChange={handleChange}
                options={options}
                notFoundContent={`Type and enter to add ${label.toLowerCase()}`}
                className='customInputTag'
            />
        </Form.Item>)
};

export default InputTags;