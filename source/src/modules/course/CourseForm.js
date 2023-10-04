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
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { formSize, lectureState } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';

const CourseForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues } = props;
    const translate = useTranslate();
    const statusValues = translate.formatKeys(lectureState, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        values.dateRegister = formatDateString(values.dateRegister, DATE_FORMAT_VALUE) + ' 00:00:00';
        values.dateEnd = formatDateString(values.dateEnd, DATE_FORMAT_VALUE) + ' 00:00:00';
        return mixinFuncs.handleSubmit({ ...values });
    };
    const {
        data: subjects,
        loading: getSubjectsLoading,
        execute: executeGetSubjects,
    } = useFetch(apiConfig.subject.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.subjectName })),
    });
    useEffect(() => {
        executeGetSubjects({
            params: {},
        });
    }, []);
    useEffect(() => {
        dataDetail.dateRegister = dataDetail.dateRegister && dayjs(dataDetail.dateRegister, DATE_FORMAT_VALUE);
        dataDetail.dateEnd = dataDetail.dateEnd && dayjs(dataDetail.dateEnd, DATE_FORMAT_VALUE);

        form.setFieldsValue({
            ...dataDetail,
            subject: dataDetail?.subject?.subjectName,
        });
    }, [dataDetail]);
    const {
        data: leaders,
        loading: getLeadersLoading,
        execute: executeGetLeaders,
    } = useFetch(apiConfig.leader.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.leaderName })),
    });
    useEffect(() => {
        executeGetLeaders({
            params: {},
        });
    }, []);
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            leaderId: dataDetail?.leader?.leaderName,
        });
    }, [dataDetail]);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={12}>
                    <Col span={12}>
                        <TextField label={<FormattedMessage defaultMessage="Tên khoá học" />} name="name" />
                    </Col>

                    <Col span={12}>
                        <AutoCompleteField
                            required
                            label={<FormattedMessage defaultMessage="Môn học" />}
                            name="subject"
                            apiConfig={apiConfig.subject.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.subjectName })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            name="dateRegister"
                            style={{ width: '100%' }}
                            format={DATE_FORMAT_DISPLAY}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="dateEnd"
                            style={{ width: '100%' }}
                            format={DATE_FORMAT_DISPLAY}
                        />
                    </Col>
                </Row>
                <TextField
                    width={'100%'}
                    required
                    label={<FormattedMessage defaultMessage="Mô tả" />}
                    name="description"
                    type="textarea"
                />
                <Row gutter={10}>
                    <Col span={12}>
                        <AutoCompleteField
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
                            name="state"
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <TextField
                    width={'100%'}
                    required
                    label={<FormattedMessage defaultMessage="Mô tả" />}
                    name="description"
                    type="textarea"
                />

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CourseForm;