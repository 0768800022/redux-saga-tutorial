import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import { projectTaskState, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { formatDateString } from '@utils';
import { Card, Col, Form, Row } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const ProjectTaskForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const translate = useTranslate();
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.dueDate = formatDateString(values.dueDate, DEFAULT_FORMAT);
        return mixinFuncs.handleSubmit({ ...values });
    };
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[0].value,
                state: stateValues[0].value,
            });
        }
    }, [isEditing]);
    const {
        data: developers,
        loading: getdevelopersLoading,
        execute: executesdevelopers,
    } = useFetch(apiConfig.developer.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.studentInfo.fullName })),
    });
    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DATE_FORMAT_VALUE);
        dataDetail.dueDate = dataDetail.dueDate && dayjs(dataDetail.dueDate, DATE_FORMAT_VALUE);

        form.setFieldsValue({
            ...dataDetail,
            developerId: dataDetail?.developer?.studentInfo?.fullName,
        });
    }, [dataDetail]);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            width='100%'
                            label={<FormattedMessage defaultMessage="Tên task" />}
                            name="taskName"
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Lập trình viên" />}
                            name="developerId"
                            apiConfig={apiConfig.developer.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.studentInfo.fullName })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ fullName: text })}
                            required
                            disabled={isEditing}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            name="state"
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={stateValues}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            name="status"
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            required
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            name="startDate"
                            style={{ width: '100%' }}
                            format={DEFAULT_FORMAT}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            required
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="dueDate"
                            style={{ width: '100%' }}
                            format={DEFAULT_FORMAT}
                        />
                    </Col>
                </Row>
                <TextField
                    width={'100%'}
                    label={<FormattedMessage defaultMessage="Mô tả" />}
                    name="description"
                    type="textarea"
                />

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ProjectTaskForm;
