import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';

const message = defineMessages({
    fullname: 'Full Name',
    birthday: 'Birth Day',
    mssv: 'MSSV',
    phone: 'Phone',
    email: 'Email',
});

const StudentForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
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
        <BaseForm
            formId={formId}
            onFinish={handleSubmit}
            form={form}
            onValuesChange={onValuesChange}
            size="big"
        >
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.fullname)}
                            name="fullname"
                        />
                    </Col>
                    <Col span={4}>
                        <DatePicker placeholder='Birth Day' name="birthday" />
                    </Col>
                    <Col span={8}>
                        <TextField
                            label={translate.formatMessage(message.mssv)}
                            type='number'
                            name="mssv"
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.phone)}
                            type='number'
                            name="phone"
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.email)}
                            type='email'
                            name="email"
                            required
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default StudentForm;
