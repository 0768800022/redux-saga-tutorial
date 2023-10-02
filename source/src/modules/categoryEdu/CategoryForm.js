import CropImageField from '@components/common/form/CropImageField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { formSize, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';


const messages = defineMessages({
    id: 'Id',
    name: 'Name',
    status: 'Status',
    description: 'Description',
    kind: 'kind',
});

const CategoryForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues } = props;
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });


    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    return (
        <Form
            style={{ width: '70%' }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
            initialValues={{ status: STATUS_ACTIVE }}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={translate.formatMessage(messages.name)} name="categoryName" />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            name="status"
                            label={translate.formatMessage(messages.status)}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={24}>
                        <TextField
                            required
                            label={translate.formatMessage(messages.description)}
                            name="categoryKind"
                            type="textarea"
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};
export default CategoryForm;