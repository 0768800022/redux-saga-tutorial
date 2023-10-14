import { Avatar, Modal } from 'antd';
import React, { useState } from 'react';
import notFoundImage from '@assets/images/avatar-default.png';
const AvatarField = ({ size, icon, src, ...props }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const handleAvatarClick = (avatarURL) => {
        setSelectedAvatar(avatarURL);
        setIsModalVisible(true);
    };
    return (
        <>
            <Avatar
                size = {size}
                icon = {icon}
                src = {src}
                {...props}
                onClick={() => handleAvatarClick(src)}
            />
            <Modal
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
            >
                <img
                    alt="Avatar"
                    src={selectedAvatar ? selectedAvatar : notFoundImage}
                    style={{ width: '100%' }}
                />
            </Modal>
        </>
    );
};
export default AvatarField;