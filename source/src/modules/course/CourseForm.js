import DatePickerField from '@components/common/form/DatePickerField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import { formatDateString } from '@utils';
import { Card, Col, Form, Row } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const CourseForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues } = props;
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        console.log(values);
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
        dataDetail.dateRegister = dataDetail.dateRegister && moment(dataDetail.dateRegister, DATE_FORMAT_VALUE);
        dataDetail.dateEnd = dataDetail.dateEnd && moment(dataDetail.dateEnd, DATE_FORMAT_VALUE);

        form.setFieldsValue({
            ...dataDetail,
            subject: dataDetail?.subject?.name,
        });
    }, [dataDetail]);
    return (
        <Form
            style={{ width: '70%' }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={12}>
                    <Col span={12}>
                        <TextField label={<FormattedMessage defaultMessage="Tên khoá học" />} name="name" />
                    </Col>

                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Môn học" />}
                            name="subject"
                            options={subjects}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            name="dateRegister"
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="dateEnd"
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            required
                            label={<FormattedMessage defaultMessage="Mô tả" />}
                            name="description"
                            type="textarea"
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default CourseForm;
