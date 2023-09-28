import CheckboxGroupField from '@components/common/form/CheckboxGroupField';
import CropImageField from '@components/common/form/CropImageField';
import DropdownField from '@components/common/form/DropdownField';
import NumericField from '@components/common/form/NumericField';
import TextField from '@components/common/form/TextField';
import { AppConstants, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import {
    FREE_STATE,
    commonStatusOptions,
    employeePermissions,
    formSize,
    genderOptions,
    salaryType,
    stateOptions,
} from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    name: 'Name',
    phone: 'Phone',
    memberCartNumber: 'Member Cart Number',
});

const CustomerForm = (props) => {
    const translate = useTranslate();
    const {
        formId,
        actions,
        dataDetail,
        onSubmit,
        setIsChangedFormValues,
        isEditing,
        size = 'small',
    } = props;
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    return (
        <Form
            style={{ width: formSize[size] ?? size }}
            id={formId}
            onFinish={mixinFuncs.handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(messages.name)} required name="name" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(messages.phone)} name="phone" />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(messages.memberCartNumber)} name="memberCartNumber" />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default CustomerForm;
