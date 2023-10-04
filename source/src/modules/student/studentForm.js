import { Card, Col, Row, DatePicker } from 'antd';
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
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import useFetch from '@hooks/useFetch';
import { FormattedMessage } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { categoryKinds } from '@constants';
import { useState } from 'react';

const message = defineMessages({
    fullName: 'Họ Và Tên',
    birthday: 'Ngày Sinh',
    mssv: 'MSSV',
    phone: 'Số Điện Thoại',
    email: 'Email',
    password: 'Mật Khẩu',
    // university: 'university',
});

const StudentForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
    const kindOfEdu = categoryKinds.CATEGORY_KIND_EDUCATION;
    const kindOfGen = categoryKinds.CATEGORY_KIND_GENERATION;
    const [currentKindOfEdu, setCurrentKindOfEdu] = useState(kindOfEdu);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const {
        data: categorys,
        loading: getCategorysLoading,
        execute: executeGetCategorys,
    } = useFetch(apiConfig.category.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.categoryName })),
    });
    useEffect(() => {
        executeGetCategorys({
            params: {},
        });
    }, []);

    useEffect(() => {
        dataDetail.birthday = dataDetail?.birthday && dayjs(dataDetail?.birthday, DATE_FORMAT_VALUE);
        form.setFieldsValue({
            ...dataDetail,
            // university: dataDetail?.category?.categoryName,
            universityId: dataDetail?.university?.categoryName,
            studyClass: dataDetail?.studyClass?.categoryName,
        });
    }, [dataDetail]);

    const handleSubmit = (values) => {
        values.birthday = formatDateString(values?.birthday, DATE_FORMAT_VALUE) + ' 00:00:00';
        return mixinFuncs.handleSubmit({ ...values });
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.fullName)} name="fullName" />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            name="birthday"
                            label="Ngày sinh"
                            placeholder="Ngày sinh"
                            format={DATE_FORMAT_VALUE}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.mssv)} name="mssv" />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.phone)}
                            type="number"
                            name="phone"
                            disabled={isEditing}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.password)} name="password" />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.email)}
                            type="email"
                            name="email"
                            disabled={isEditing}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Trường" />}
                            name="universityId"
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                            initialSearchParams={{
                                kind: kindOfEdu,
                            }}
                            searchParams={(text) => ({ name: text })}
                            disabled={isEditing}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Hệ" />}
                            name="studyClass"
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                            initialSearchParams={{
                                kind: kindOfGen,
                            }}
                            searchParams={(text) => ({ name: text })}
                            disabled={isEditing}
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
