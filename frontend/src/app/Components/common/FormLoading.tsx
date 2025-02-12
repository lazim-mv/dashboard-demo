import React from "react";
import { Row, Col, Skeleton } from "antd";

interface FormLoadingProps {
    numFields?: number; // Number of skeleton fields
    colSpan?: number; // Span for each column
    inputWidth?: string; // Width of the skeleton input
    inputHeight?: string; // Height of the skeleton input
    buttonWidth?: string; // Width of the button skeleton
    buttonHeight?: string; // Height of the button skeleton
    uploadBoxWidth?: string;//  width of the upload label skeleton
    uploadBoxHeight?: string; // Default height of the upload box
    uploadLabelWidth?: string; // Width of the upload label skeleton
    uploadLabelHeight?: string; // Height of the upload label skeleton
    uploadCount?: number; // Number of upload fields
}

const FormLoading: React.FC<FormLoadingProps> = ({
    numFields = 9, // Default number of fields
    colSpan = 8, // Default column span
    inputWidth = "379px", // Default input width
    inputHeight = "40px", // Default input height
    buttonWidth = "100px", // Default button width
    buttonHeight = "40px", // Default button height
    uploadBoxWidth = "250px", // Default width of the upload box
    uploadBoxHeight = "286px", // Default height of the upload box
    uploadLabelWidth = "120px", // Default label width for upload
    uploadLabelHeight = "22px", // Default label height for upload
    uploadCount = 0, // Default number of upload fields
}) => {
    return (
        <Row gutter={[24, 24]}>

            {[...Array(numFields)].map((_, index) => (
                <Col span={colSpan} key={index}>
                    <div style={{ marginBottom: "8px" }}>
                        <Skeleton.Input
                            style={{ width: "120px", height: "22px" }}
                            size="small"
                            active
                        />
                    </div>
                    {/* Input Skeleton */}
                    <Skeleton.Input
                        style={{ width: inputWidth, height: inputHeight }}
                        size="large"
                        active
                    />
                </Col>
            ))}

            {uploadCount > 0 && (
                <Row gutter={[24, 24]} style={{ width: "100%", marginLeft: "5px" }}>
                    {[...Array(uploadCount)].map((_, index) => (
                        <Col span={6} key={`upload-${index}`}>
                            <div style={{ marginBottom: "8px" }}>
                                <Skeleton.Input
                                    style={{
                                        width: uploadLabelWidth,
                                        height: uploadLabelHeight,
                                    }}
                                    size="small"
                                    active
                                />
                            </div>
                            <Skeleton.Input
                                style={{
                                    width: uploadBoxWidth,
                                    height: uploadBoxHeight,
                                }}
                                size="large"
                                active
                            />
                        </Col>
                    ))}
                </Row>
            )}


            <Col span={24}>
                <Row justify="end">
                    <Skeleton.Button
                        style={{
                            width: buttonWidth,
                            height: buttonHeight,
                            borderRadius: "20px",
                        }}
                        active
                    />
                </Row>
            </Col>
        </Row >
    );
};

export default FormLoading;
