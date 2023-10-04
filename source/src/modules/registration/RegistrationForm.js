import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import CheckboxField from '@components/common/form/CheckboxField';
import SelectField from '@components/common/form/SelectField';
import TimePickerField from '@components/common/form/TimePickerField';
import { TIME_FORMAT_DISPLAY } from '@constants';
import apiConfig from '@constants/apiConfig';
import { daysOfWeekSchedule as daysOfWeekScheduleOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Button, Card, Col, Form, Row, Space } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styles from './Registration.module.scss';
import ScheduleTable from '@components/common/table/ScheduleTable';

const messages = defineMessages({
    student: 'Tên sinh viên',
    isIntern: 'Đăng kí thực tập',
});
const statesOptionSelect = [
    {
        value: '1',
        label: 'Trung cấp',
    },
    { value: '2', label: 'Đã đăng ký' },
    { value: '3', label: 'Đang thực tập' },
    { value: '4', label: 'Đã huỷ' },
];

function RegistrationForm({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) {
    const translate = useTranslate();
    const daysOfWeekSchedule = translate.formatKeys(daysOfWeekScheduleOptions, ['label']);
    const { form, mixinFuncs, onValuesChange, setFieldValue, getFieldValue } = useBasicForm({
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
        values.schedule = values.schedule && JSON.stringify(values.schedule);
        statesOptionSelect.map((state) => {
            if (state.label == values.state) {
                values.state = state.value;
            }
        });
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        dataDetail?.isIntern && setIsChecked(dataDetail?.isIntern == 1 && true);
        const data = dataDetail?.schedule && JSON.parse(dataDetail?.schedule);
        let dataDefault = {};
        daysOfWeekSchedule.map((day) => {
            dataDefault = {
                [day.value]: [
                    {
                        from: '2023-10-03T00:00:00.000Z',
                        to: '2023-10-03T00:00:00.000Z',
                    },
                    {
                        from: '2023-10-02T00:00:00.000Z',
                        to: '2023-10-02T00:00:00.000Z',
                    },
                    {
                        from: '2023-10-02T00:00:00.000Z',
                        to: '2023-10-02T00:00:00.000Z',
                    },
                ],
                ...dataDefault,
            };
        });

        for (const day in data) {
            for (const timeRange of data[day]) {
                timeRange.from = dayjs(timeRange.from);
                timeRange.to = dayjs(timeRange.to);
            }
        }
        for (const day in dataDefault) {
            for (const timeRange of dataDefault[day]) {
                timeRange.from = dayjs(timeRange.from).subtract(7, 'hours');
                timeRange.to = dayjs(timeRange.to).subtract(7, 'hours');
            }
        }

        dataDetail &&
            statesOptionSelect.map((state) => {
                if (state.value == dataDetail.state) {
                    dataDetail.state = state.label;
                }
            });
        dataDetail.schedule = data || dataDefault;
        form.setFieldsValue({
            ...dataDetail,
            studentId: dataDetail?.studentInfo?.fullName,
        });
    }, [dataDetail]);

    const onSelectScheduleTabletRandom = (fieldName, value) => {
        try {
            const schedule = getFieldValue('schedule');
            const [dayKey, dayIndexKey, frameKey] = fieldName;
            if (frameKey === 'from') {
                const to = schedule[dayKey][dayIndexKey].to;
                if (to && to.format(TIME_FORMAT_DISPLAY) < value.format(TIME_FORMAT_DISPLAY)) {
                    schedule[dayKey][dayIndexKey].to = null;
                }
            } else if (frameKey === 'to') {
                const from = schedule[dayKey][dayIndexKey].from;
                if (from && value.format(TIME_FORMAT_DISPLAY) < from.format(TIME_FORMAT_DISPLAY)) {
                    value = from;
                }
            }
            schedule[dayKey][dayIndexKey][frameKey] = value;
            setFieldValue('schedule', schedule);
            onValuesChange();
            // checkCanApplyAll();
        } catch (error) {
            console.log(error);
        }
    };
    const checkCanApplyAll = () => {
        const schedule = getFieldValue('schedule');
        if (schedule) {
            const { monday } = schedule;
            if (!monday) {
                return false;
            }
            return monday.every((frame) => !!frame.from && !!frame.to);
        }
        return false;
    };

    const handleApplyAll = (e) => {
        e.preventDefault();
        const schedule = getFieldValue('schedule');

        const { monday = [] } = schedule;
        for (let { value } of daysOfWeekSchedule) {
            schedule[value] = monday.map((frame) => {
                return {
                    from: frame.from,
                    to: frame.to,
                };
            });
        }
        // form.resetFields();
        setFieldValue('schedule', schedule);
        checkCanApplyAll();
        onValuesChange();
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} size="big">
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            required
                            label={translate.formatMessage(messages.student)}
                            name="studentId"
                            apiConfig={apiConfig.student.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.fullName })}
                            initialSearchParams={{ pageNumber: 0 }}
                            searchParams={(text) => ({ fullName: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="state"
                            options={statesOptionSelect}
                        />
                    </Col>
                    <Col span={12}>
                        <CheckboxField
                            className={styles.customCheckbox}
                            required
                            label={translate.formatMessage(messages.isIntern)}
                            name="isIntern"
                            checked={isChecked}
                            onChange={handleOnChangeCheckBox}
                        />
                    </Col>
                </Row>

                <ScheduleTable
                    onSelectScheduleTabletRandom={onSelectScheduleTabletRandom}
                    checkCanApplyAll={checkCanApplyAll}
                    handleApplyAll={handleApplyAll}
                    translate={translate}
                    daysOfWeekSchedule={daysOfWeekSchedule}
                />

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
}

export default RegistrationForm;
