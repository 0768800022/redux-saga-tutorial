import React from 'react';
import { Form } from 'antd';

const formSize = {
    small: '700px',
    normal: '800px',
    big: '900px',
};

export const BaseForm = ({ formId, onFinish, onChange, form, onValuesChange, children, size = 'small' }) => {
    return (
        <Form
            style={{ width: formSize[size] }} 
            id={formId}
            onFinish={onFinish}
            onChange={onChange}
            form={form}
            onValuesChange={onValuesChange}
        >
            {children}
        </Form>
    );
};
