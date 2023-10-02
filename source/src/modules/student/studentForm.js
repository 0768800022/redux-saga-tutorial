import { Card, Col, Row,DatePicker } from 'antd';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_VALUE } from '@constants/index';
import { formatDateString } from '@utils/index';
import dayjs from 'dayjs';

const message = defineMessages({
    fullName: 'Họ Và Tên',
    birthday: 'Ngày Sinh',
    mssv: 'MSSV',
    phone: 'Số Điện Thoại',
    email: 'Email',
    password: 'Mật Khẩu',
});

const StudentForm = ({ isEditing,formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {

    const translate = useTranslate();
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        values.birthday = formatDateString(values?.birthday, DATE_FORMAT_VALUE) + ' 00:00:00';
        return mixinFuncs.handleSubmit({ ...values });
    };
   
    useEffect(() => {
        dataDetail.birthday = dataDetail?.birthday && dayjs(dataDetail?.birthday, DATE_FORMAT_VALUE);
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
        >
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.fullName)}
                            name="fullName"
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField 
                            name = 'birthday'
                            label="Ngày sinh"  
                            placeholder="Ngày sinh" 
                            format={DATE_FORMAT_VALUE}
                            style={{ width: '100%' }}/>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.mssv)}
                            name="mssv"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.phone)}
                            type='number'
                            name="phone"
                            disabled = {isEditing}
                            required
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.password)}
                            name="password"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.email)}
                            type='email'
                            name="email"
                            disabled = {isEditing}
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
