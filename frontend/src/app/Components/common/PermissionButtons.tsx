import { Button } from 'antd';
import React from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';

interface PermissionButtonsProps {
    editButton?: boolean;
    deleteButton?: boolean;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
}

const PermissionButtons: React.FC<PermissionButtonsProps> = ({
    editButton,
    deleteButton,
    onEditClick,
    onDeleteClick
}) => {
    return (
        <>
            {editButton && (
                <Button icon={<MdOutlineEdit />} onClick={onEditClick}>
                </Button>
            )}
            {deleteButton && (
                <Button icon={<RiDeleteBin6Line color="#FF4D4F" />} onClick={onDeleteClick}>
                </Button>
            )}
        </>
    );
};

export default PermissionButtons;
