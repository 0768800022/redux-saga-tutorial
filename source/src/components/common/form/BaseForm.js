import React from 'react';
import { Form } from 'antd';
import { formSize } from '@constants/index';

export const BaseForm = ({ 
    formId, 
    onFinish, 
    onChange, 
    form, 
    onValuesChange, 
    children, 
    size = 'normal', 

    
    ...props 
}) => {
    return (
        <Form
            style={{ width: formSize[size] }} 
            id={formId}
            onFinish={onFinish}
            onChange={onChange}
            form={form}
            onValuesChange={onValuesChange}
            {...props}
        >
            {children}
        </Form>
    );
};
