import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, notification } from 'antd';
import useSavePage from "../api/useSavePage";
import apiConfig from '../api/apiConfig';

function EditUser() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { handleSubmit, handleUpdate } = useSavePage(apiConfig.Api);

    const isEditMode = !!state?.user; //xem state.user có tồn tại kh
    const [form] = Form.useForm();
    const initialValues = isEditMode ? state.user : { firstName: '', lastName: '' };

    const handleCreate = (values) => {
        console.log("Created User:", values);
        handleSubmit(values)
            .then(() => {
                notification.success({
                    message: 'Success',
                    description: 'Created Successfully!',
                });
                navigate('/users')
            })
            .catch(e => {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update user.',
                });
            })
    };

    const onFinish = (values) => {
        if (isEditMode) {
            const updatedUser = { id: state.user.id, ...values };//lấy id và các giá trị còn lại
            console.log("Updated User:", updatedUser); 
            handleUpdate(updatedUser)
                .then(() => {
                    notification.success({
                        message: 'Success',
                        description: 'Updated Successfully!',
                    });

                    navigate('/users')
                })
                .catch((e) => {
                    notification.error({
                        message: 'Error',
                        description: 'Failed to update user.',
                    });
                })
        } else {
            console.log("eeee");
        }
    };

    return (
        <div >
            <h2>Edit User</h2>
            <Form  
                form={form} 
                layout="vertical" 
                onFinish={onFinish} 
                initialValues={initialValues}
            >
                <Form.Item 
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: 'Please input first name!' }]}
                >
                    <Input style={{width: '20%'}}/>
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: 'Please input last name!' }]}
                >
                    <Input style={{width: '20%'}}/>
                </Form.Item>
                <Form.Item>
                    <Button style={{margin: '0 5px 0 10px'}} type="primary" onClick={handleCreate}>Create</Button>
                    <Button type="primary" htmlType="submit">Edit</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default EditUser;
