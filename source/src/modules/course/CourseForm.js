import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import { formatDateString } from '@utils';
import { Card, Col, Form, Row } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { formSize, lectureState, statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import NumericField from '@components/common/form/NumericField';

const CourseForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues } = props;
    const translate = useTranslate();
    const lectureStateOptions = translate.formatKeys(lectureState, ['label']);
    const [lectureStateFilter, setLectureStateFilter] = useState([lectureStateOptions[0]]);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        if (!values?.state) {
            values.state = 1;
        }
        if (!values?.status) {
            values.status = 0;
        }
        values.dateRegister = formatDateString(values.dateRegister, DATE_FORMAT_VALUE) + ' 00:00:00';
        values.dateEnd = formatDateString(values.dateEnd, DATE_FORMAT_VALUE) + ' 00:00:00';
        return mixinFuncs.handleSubmit({ ...values });
    };
    const {
        data: subjects,
        loading: getSubjectsLoading,
        execute: executeGetSubjects,
    } = useFetch(apiConfig.subject.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.subjectName })),
    });
    // useEffect(() => {
    //     executeGetSubjects({
    //         params: {},
    //     });
    // }, []);
    useEffect(() => {
        lectureStateOptions.map((state, index) => {
            if (dataDetail?.state == state.value) {
                const length = lectureStateOptions.length;
                let arrayStateFilter = [];
                if (index < length - 3) {
                    arrayStateFilter = [state, lectureStateOptions[index + 1], lectureStateOptions[length - 1]];
                } else if (index === length - 3) {
                    arrayStateFilter = [state, lectureStateOptions[length - 1]];
                } else {
                    arrayStateFilter = [state];
                }

                setLectureStateFilter(arrayStateFilter);
            }
        });
        dataDetail.dateRegister = dataDetail.dateRegister && dayjs(dataDetail.dateRegister, DATE_FORMAT_VALUE);
        dataDetail.dateEnd = dataDetail.dateEnd && dayjs(dataDetail.dateEnd, DATE_FORMAT_VALUE);
        form.setFieldsValue({
            ...dataDetail,
            subjectId: dataDetail?.subject?.subjectName,
        });
    }, [dataDetail]);
    const {
        data: leaders,
        loading: getLeadersLoading,
        execute: executeGetLeaders,
    } = useFetch(apiConfig.leader.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.leaderName })),
    });
    // useEffect(() => {
    //     executeGetLeaders({
    //         params: {},
    //     });
    // }, []);
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            leaderId: dataDetail?.leader?.leaderName,
        });
    }, [dataDetail]);
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };

    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={12}>
                    <Col span={12}>
                        <TextField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Tên khoá học" />}
                            name="name"
                            required
                        />
                    </Col>

                    <Col span={12}>
                        <AutoCompleteField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            required
                            label={<FormattedMessage defaultMessage="Môn học" />}
                            name="subjectId"
                            apiConfig={apiConfig.subject.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.subjectName })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                                {
                                    validator: validateDueDate,
                                },
                            ]}
                            name="dateRegister"
                            style={{ width: '100%' }}
                            format={DATE_FORMAT_DISPLAY}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            disabled={dataDetail.state >= 3}
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="dateEnd"
                            style={{ width: '100%' }}
                            format={DATE_FORMAT_DISPLAY}
                            required
                        />
                    </Col>
                </Row>
                <TextField
                    disabled={dataDetail.state >= 3}
                    width={'100%'}
                    required
                    label={<FormattedMessage defaultMessage="Mô tả" />}
                    name="description"
                    type="textarea"
                />
                <Row gutter={10}>
                    <Col span={12}>
                        <AutoCompleteField
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            required
                            label={<FormattedMessage defaultMessage="Người hướng dẫn" />}
                            name="leaderId"
                            apiConfig={apiConfig.leader.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.leaderName })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            disabled={dataDetail?.state === 3 || (dataDetail?.state === 4 && true)}
                            name="state"
                            defaultValue={lectureStateFilter[0]}
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={lectureStateFilter}
                        />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <NumericField
                            required
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Học phí" />}
                            name="fee"
                            type="number"
                            min={0}
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            required
                            disabled={dataDetail.state !== undefined && dataDetail.state !== 1}
                            label={<FormattedMessage defaultMessage="Phí hoàn trả" />}
                            name="returnFee"
                            type="number"
                            min={0}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            disabled={dataDetail?.state === 3 || (dataDetail?.state === 4 && true)}
                            name="status"
                            defaultValue={statusValues[0]}
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CourseForm;
