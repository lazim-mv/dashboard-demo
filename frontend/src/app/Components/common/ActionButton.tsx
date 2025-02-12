import { Button, ButtonProps, Popconfirm, Popover } from "antd";
import Image from "next/image";
import React from "react";

interface ActionButtonProps {
    disabled?: boolean;
    img?: string;
    handleClick?: () => void;
    btnText?: React.ReactNode;
    bgColor?: string;
    confirmTitle?: React.ReactNode;
    onConfirm?: () => void;
    okText?: string;
    cancelText?: string;
    popoverContent?: React.ReactNode;
    popoverTitle?: React.ReactNode;
    type?: "default" | "popconfirm" | "popover";
    antBtnType?: ButtonProps["type"];
    marginBottom?: string | number;
    marginLeft?: string | number;
    buttonLoading?: boolean;
    shape?: "circle" | "round" | "default";
    htmlType?: "submit" | "reset" | "button";
}

const ActionButton: React.FC<ActionButtonProps> = ({
    disabled = false,
    img,
    handleClick,
    btnText,
    bgColor,
    confirmTitle,
    onConfirm,
    okText,
    cancelText,
    popoverContent,
    popoverTitle,
    type = "default",
    antBtnType = "primary",
    marginBottom,
    marginLeft,
    buttonLoading = false,
    shape = "default",
    htmlType
}) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const button = (
        <Button
            type={antBtnType}
            size="large"
            shape={shape}
            style={{
                backgroundColor: isHovered ? `${bgColor}CC` : bgColor, // Add opacity (CC = 80%)
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginBottom,
                marginLeft,
                border: bgColor && bgColor
            }}
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            loading={buttonLoading}
            disabled={disabled}
            onClick={handleClick}
            htmlType={htmlType}
        >
            {img && <Image src={img} width={20} height={20} alt="icon" />}
            {btnText}
        </Button>
    );

    if (type === "popconfirm") {
        return (
            <Popconfirm
                title={confirmTitle}
                onConfirm={onConfirm}
                okText={okText}
                cancelText={cancelText}
                disabled={disabled}
            >
                {button}
            </Popconfirm>
        );
    } else if (type === "popover") {
        return (
            <Popover
                content={popoverContent}
                title={popoverTitle}
            // disabled={disabled}
            >
                {button}
            </Popover>
        );
    }

    return button;
};

export default ActionButton;