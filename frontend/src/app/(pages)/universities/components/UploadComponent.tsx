import React, { useState, useEffect } from 'react';
import { Upload, Modal } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { TiPlusOutline } from "react-icons/ti";
import Title from "antd/es/typography/Title";

interface UploadComponentProps {
    listType?: 'picture-card' | 'picture' | 'text';
    maxCount?: number;
    label?: string;
    fieldName?: string;
    acceptedFileTypes?: string;
    initialFileUrl?: string | undefined;
    handleUpload: (files: UploadFile[], fieldName: string) => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({
    listType = 'picture-card',
    maxCount = 1,
    handleUpload,
    label = 'Upload',
    acceptedFileTypes = '.pdf, image/*',
    fieldName = "",
    initialFileUrl = ""
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(() => {
        if (initialFileUrl) {
            // Create an initial file object for the existing document
            const fileName = initialFileUrl.split('/').pop() || 'document.pdf';
            const initialFile: UploadFile = {
                uid: '-1',
                name: fileName,
                status: 'done',
                url: initialFileUrl,
                type: 'application/pdf',
                thumbUrl: '/pdf.svg'
            };
            setFileList([initialFile]);
        }
    }, [initialFileUrl]);

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const updatedFileList = newFileList.map((file) => {
            if (file.type === 'application/pdf') {
                return {
                    ...file,
                    thumbUrl: '/pdf.svg',
                };
            }
            return file;
        });

        setFileList(updatedFileList);
        handleUpload(updatedFileList, fieldName);
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview && file.originFileObj) {
            // Generate a preview only for non-PDF files
            if (file.type !== 'application/pdf') {
                file.preview = await getBase64(file.originFileObj as File);
            }
        }

        if (file.type === 'application/pdf') {
            // For PDFs, open in new tab if URL exists
            if (file.url) {
                window.open(file.url, '_blank');
            } else {
                setPreviewImage('/pdf.svg');
                setPreviewTitle(file.name || 'PDF Document');
                setPreviewVisible(true);
            }
        } else {
            setPreviewImage(file.url || (file.preview as string));
            setPreviewTitle(file.name || 'File');
            setPreviewVisible(true);
        }
    };

    const handleCancel = () => setPreviewVisible(false);

    const uploadButton = (
        <div>
            <TiPlusOutline />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div className="custom-upload">
            <Title level={5}>{label}</Title>
            <Upload
                listType={listType}
                fileList={fileList}
                onPreview={handlePreview}
                onChange={onChange}
                maxCount={maxCount}
                accept={acceptedFileTypes}
            >
                {fileList.length < maxCount && uploadButton}
            </Upload>
            <Modal
                open={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img
                    alt="preview"
                    style={{ width: '100%' }}
                    src={previewImage}
                />
            </Modal>
        </div>
    );
};

// Utility function to convert file to base64
const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export default UploadComponent;