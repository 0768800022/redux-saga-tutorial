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
        label: 'Chưa bắt đầu',
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
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.fullName })),
    });
    useEffect(() => {
        executestudents({
            params: {},
        });
    }, []);
    function formatTimeRange(timeArray) {
        return timeArray.map((time) => `${time.from}-${time.to}`).join('|');
    }
    const handleSubmit = (values) => {
        values.isIntern = isChecked ? 1 : 0;
        for (const day in values.schedule) {
            for (const timeRange of values.schedule[day]) {
                timeRange.from = timeRange.from.set({ hour: 0, minute: 0 }).format('HH[H]mm');
                timeRange.to = timeRange.to.set({ hour: 0, minute: 0 }).format('HH[H]mm');
            }
        }
        const newSchedule = {
            t2: formatTimeRange(values.schedule.monday),
            t3: formatTimeRange(values.schedule.tuesday),
            t4: formatTimeRange(values.schedule.wednesday),
            t5: formatTimeRange(values.schedule.thursday),
            t6: formatTimeRange(values.schedule.friday),
            t7: formatTimeRange(values.schedule.saturday),
            cn: formatTimeRange(values.schedule.sunday),
        };
        values.schedule = values.schedule && JSON.stringify(newSchedule);
        statesOptionSelect.map((state) => {
            if (state.label == values.state) {
                values.state = state.value;
            }
        });
        if(!values?.state){
            values.state = statesOptionSelect[0].value;
        }
        return mixinFuncs.handleSubmit({ ...values });
    };

    const splitTime = (data) => {
        const result = {};
        const dataNew = {
            monday: data.t2,
            tuesday: data.t3,
            wednesday: data.t4,
            thursday: data.t5,
            friday: data.t6,
            saturday: data.t7,
            sunday: data.cn,
        };
        for (const key in dataNew) {
            if (Object.hasOwn(dataNew, key)) {
                const value = dataNew[key];
                if (value && value.length > 0) {
                    const timeRanges = value.split('|');
                    const fromTo = timeRanges.map((timeRange) => {
                        const [from, to] = timeRange.split('-');

                        return {
                            from,
                            to,
                        };
                    });
                    result[key] = fromTo;
                }
            }
        }
        return result;
    };

    useEffect(() => {
        dataDetail?.isIntern && setIsChecked(dataDetail?.isIntern == 1 && true);
        let data = dataDetail?.schedule && JSON.parse(dataDetail?.schedule);
        if (data) {
            data = splitTime(data);
        }

        let dataDefault = {};
        daysOfWeekSchedule.map((day) => {
            dataDefault = {
                [day.value]: [
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                ],
                ...dataDefault,
            };
        });
        for (const day in data) {
            for (const timeRange of data[day]) {
                timeRange.from = dayjs(timeRange.from, 'HH:mm');
                timeRange.to = dayjs(timeRange.to, 'HH:mm');
            }
        }
        for (const day in dataDefault) {
            for (const timeRange of dataDefault[day]) {
                timeRange.from = dayjs(timeRange.from, 'HH:mm');
                timeRange.to = dayjs(timeRange.to, 'HH:mm');
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
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} size="1100px">
            <Card className="card-form" bordered={false}>
                <div style={{ width: '980px' }}>
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
                                defaultValue={statesOptionSelect[0]}
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
                </div>

                <ScheduleTable
                    onSelectScheduleTabletRandom={onSelectScheduleTabletRandom}
                    translate={translate}
                    daysOfWeekSchedule={daysOfWeekSchedule}
                />
                <div className="footer-card-form" style={{ marginTop: '20px', marginRight: '69px' }}>
                    {actions}
                </div>
            </Card>
        </BaseForm>
    );
}

export default RegistrationForm;
