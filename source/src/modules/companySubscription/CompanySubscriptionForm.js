import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import SelectField from '@components/common/form/SelectField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useFetch from '@hooks/useFetch';
import { FormattedMessage } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { useState } from 'react';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE } from '@constants';
import { statusOptions } from '@constants/masterData';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import DatePickerField from '@components/common/form/DatePickerField';
import dayjs from 'dayjs';
import { formatDateString } from '@utils';

const messages = defineMessages({
    companyName: 'Tên công ty',
    address: 'Địa chỉ',
    email: 'Email',
    hotline: 'HotLine',
    logo: 'logo',
    password: 'Mật khẩu',
    username: 'Tài khoản đăng nhập',
    required: 'Không được để trống',
});

const CompanySubscriptionForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const [logoUrl, setLogoUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadLogoFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'LOGO',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setLogoUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const handleSubmit = (values) => {
        values.startDate = formatDateString(values.startDate, DATE_FORMAT_VALUE) + ' 00:00:00';
        values.endDate = formatDateString(values.endDate, DATE_FORMAT_VALUE) + ' 00:00:00';
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[0].value,
            });
        }
    }, [isEditing]);

    const {
        data: companys,
        loading: getcompanyLoading,
        execute: executescompanys,
    } = useFetch(apiConfig.company.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.companyName })),
    });
    const {
        data: serviceCompanySubscription,
        loading: getserviceCompanySubscriptionLoading,
        execute: executesserviceCompanySubscription,
    } = useFetch(apiConfig.ServiceCompanySubscription.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.name })),
    });
    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DATE_FORMAT_VALUE);
        dataDetail.endDate = dataDetail.endDate && dayjs(dataDetail.endDate, DATE_FORMAT_VALUE);

        form.setFieldsValue({
            ...dataDetail,
            companyId: dataDetail?.company?.companyName,
            serviceCompanySubscriptionId: dataDetail?.subscription?.name,
        });
    }, [dataDetail]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} >
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Gói dịch vụ" />}
                            name="serviceCompanySubscriptionId"
                            apiConfig={apiConfig.ServiceCompanySubscription.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ name: text })}
                            required
                            disabled={isEditing}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Công ty" />}
                            name="companyId"
                            apiConfig={apiConfig.company.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.companyName })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ companyName: text })}
                            required
                            disabled={isEditing}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            required
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            name="startDate"
                            style={{ width: '100%' }}
                            format={DATE_FORMAT_DISPLAY}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            required
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="endDate"
                            style={{ width: '100%' }}
                            format={DATE_FORMAT_DISPLAY}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CompanySubscriptionForm;
