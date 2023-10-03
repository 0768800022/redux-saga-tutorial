import { BaseForm } from '@components/common/form/BaseForm';
import CheckboxField from '@components/common/form/CheckboxField';
import CropImageField from '@components/common/form/CropImageField';
import DropdownField from '@components/common/form/DropdownField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { formSize, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, DatePicker, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    student: 'Tên sinh viên',
    isIntern: 'Đăng kí thực tập',
});

function RegistrationForm({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) {
    const translate = useTranslate();

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const [isChecked, setIsChecked] = useState(false);

    const handleOnChangeCheckBox = () => {
        setIsChecked(!isChecked);
    };

    const {
        data: students,
        loading: getstudentsLoading,
        execute: executestudents,
    } = useFetch(apiConfig.student.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.fullName })),
    });
    useEffect(() => {
        executestudents({
            params: {},
        });
    }, []);

    const handleSubmit = (values) => {
        values.isIntern = isChecked ? 1 : 0;
        console.log(students);
        console.log(values);
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        dataDetail?.isIntern && setIsChecked(dataDetail?.isIntern == 1 && true);
        form.setFieldsValue({
            ...dataDetail,
            studentId: dataDetail?.studentInfo?.fullName,
        });
    }, [dataDetail]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            required
                            label={translate.formatMessage(messages.student)}
                            name="studentId"
                            options={students}
                        />
                    </Col>
                    <Col span={12}>
                        <CheckboxField
                            required
                            label={translate.formatMessage(messages.isIntern)}
                            name="isIntern"
                            checked={isChecked}
                            onChange={handleOnChangeCheckBox}
                        />
                    </Col>
                </Row>
                <Row gutter={16}></Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
}

export default RegistrationForm;
