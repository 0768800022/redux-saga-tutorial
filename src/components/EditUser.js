import React, { useState } from 'react';
import { useLocation} from 'react-router-dom';
import { Form, Input, Button, notification } from 'antd';
import useSavePage from "../api/useSavePage";
import apiConfig from '../api/apiConfig';

function EditUser() {

    const { state } = useLocation();
    const isEditMode = !!state?.user;
    const { handleCreate, onUpdate } = useSavePage(apiConfig.Api);
    const initialValues = isEditMode ? state.user : { firstName: '', lastName: '' };
    
    return (
        <div >
            <h2>Edit User</h2>
            <Form  
                layout="vertical" 
                onFinish={onUpdate} 
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
