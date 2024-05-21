import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import NumericField from '@components/common/form/NumericField';
import RichTextField, { insertBaseURL, removeBaseURL } from '@components/common/form/RichTextField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import { memberTaskKind, projectTaskKind, projectTaskState, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { formatDateString } from '@utils';
import { Card, Col, Form, Row, Space } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const ProjectStoryTaskForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const translate = useTranslate();
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    // const kindValues = translate.formatKeys(projectTaskKind, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const [valueSelect, setValueSelect] = useState(1);
    const [memKind, setMemKind] = useState(1);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        values.dateComplete = values.dateComplete && formatDateString(values.dateComplete, DEFAULT_FORMAT);
        if (typeof values.developerId === 'string') {
            values.developerId = dataDetail?.developerInfo?.account?.id;
        }
        if (typeof values.projectCategoryId === 'string') {
            values.projectCategoryId = dataDetail?.projectCategoryDto?.id;
        }
        return mixinFuncs.handleSubmit({ ...values, description: removeBaseURL(values?.description) });
    };
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
                state: stateValues[0].value,
                kind: projectTaskKind[0].value,
                memKind: valueSelect,
            });
        }
    }, [isEditing]);
    const {
        data: developers,
        loading: getdevelopersLoading,
        execute: executesdevelopers,
    } = useFetch(apiConfig.developer.autocomplete, {
        params: { projectId: projectId },
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.studentInfo.fullName })),
    });

    const {
        data: team,
        loading: getTeamLoading,
        execute: executesTeams,
    } = useFetch(apiConfig.team.autocomplete, {
        params: { projectId: projectId },
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({ value: item?.leaderInfo?.id, label: item?.leaderInfo?.leaderName })),
    });
    useEffect(() => {
        dataDetail.dateComplete = dataDetail.dateComplete && dayjs(dataDetail.dateComplete, DEFAULT_FORMAT);
        let value;

        if (dataDetail?.dateComplete && dataDetail?.leader) {
            setValueSelect(2);
            value = 2;
        } else {
            value = 1;
        }

        form.setFieldsValue({
            ...dataDetail,
            projectCategoryId: dataDetail?.projectCategoryDto?.id,
            developerId: dataDetail?.developerInfo?.account?.id,
            description: insertBaseURL(dataDetail?.description),
            memKind: value,
            status:dataDetail?.status,
        });
    }, [dataDetail]);

    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };

    const validateCompleteDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date) && !isEditing) {
            return Promise.reject('Ngày hoàn thành phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };

    const handleOnSelect = (value) => {
        setValueSelect(value);
    };

    useEffect(() => {
        if (valueSelect == 2) {
            executesTeams();
        } else {
            executesdevelopers();
        }
    }, [valueSelect]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField name="storyName" label={<FormattedMessage defaultMessage="Tên story" />} required />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Người thực hiện" />}
                            disabled={isEditing}
                            // label={<FormattedMessage defaultMessage=" " />}
                            name="developerId"
                            apiConfig={apiConfig.memberProject.autocomplete}
                            mappingOptions={(item) => ({
                                value: item.developer.id,
                                label: item.developer.account.fullName,
                            })}
                            searchParams={(text) => ({ fullName: text })}
                            optionsParams={{ projectId: projectId }}
                            initialSearchParams={{ projectId: projectId }}
                            // options={developers}
                            // required
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            required
                            label={<FormattedMessage defaultMessage="Danh mục" />}
                            name="projectCategoryId"
                            apiConfig={apiConfig.projectCategory.autocomplete}
                            mappingOptions={(item) => ({
                                value: item.id,
                                label: item.projectCategoryName,
                            })}
                            searchParams={(text) => ({ name: text })}
                            optionsParams={{ projectId: projectId }}
                            initialSearchParams={{ projectId: projectId }}
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
                        <NumericField
                            label={<FormattedMessage defaultMessage="Thời gian hoàn thành" />}
                            name="timeEstimate"
                            min={0}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            // isCurrency
                            required
                            addonAfter={'phút'}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            showTime={true}
                            label={<FormattedMessage defaultMessage="Ngày hoàn thành" />}
                            name="dateComplete"
                            placeholder="Ngày hoàn thành"
                            rules={[
                                {
                                    validator: validateCompleteDate,
                                },
                            ]}
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <RichTextField
                    label={<FormattedMessage defaultMessage="Mô tả" />}
                    labelAlign="left"
                    name="description"
                    style={{
                        height: 300,
                        marginBottom: 70,
                    }}
                    required
                    baseURL={AppConstants.contentRootUrl}
                    setIsChangedFormValues={setIsChangedFormValues}
                    form={form}
                />

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ProjectStoryTaskForm;
