import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import CropImageField from '@components/common/form/CropImageField';
import { FormattedMessage } from 'react-intl';
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import { statusOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import DatePickerField from '@components/common/form/DatePickerField';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import dayjs from 'dayjs';
import { formatDateString } from '@utils';

const message = defineMessages({
    avatar: "Avater",
    description: "Mô tả",
    leader: "Người hướng dẫn",
    name: "Tên dự án",
    endDate: "Ngày kết thúc",
    startDate: "Ngày bắt đầu",
});

const ProjectForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
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
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[0].value,
            });
        }
    }, [isEditing]);

    const {
        data: leaders,
        loading: getLeadersLoading,
        execute: executeGetLeaders,
    } = useFetch(apiConfig.leader.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.leaderName })),
    });
    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DATE_FORMAT_VALUE);
        dataDetail.endDate = dataDetail.endDate && dayjs(dataDetail.endDate, DATE_FORMAT_VALUE);

        form.setFieldsValue({
            ...dataDetail,
            leaderId: dataDetail?.leaderInfo?.leaderName,
        });
    }, [dataDetail]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Avatar" />}
                            name="avatar"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.name)} name="name" required />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={translate.formatMessage(message.leader)}
                            name="leaderId"
                            apiConfig={apiConfig.leader.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.leaderName })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ name: text })}
                            required />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <DatePickerField
                            label={translate.formatMessage(message.startDate)}
                            name="startDate"
                            style={{ width: '100%' }}
                            format={DATE_FORMAT_DISPLAY} 
                            required/>
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={translate.formatMessage(message.endDate)}
                            type="email"
                            name="endDate"
                            style={{ width: '100%' }}
                            format={DATE_FORMAT_DISPLAY}
                            required
                        />
                    </Col>
                </Row>
                <TextField
                    width={'100%'}
                    required
                    label={<FormattedMessage defaultMessage="Mô tả" />}
                    name="description"
                    type="textarea" />
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ProjectForm;
