import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import CheckboxField from '@components/common/form/CheckboxField';
import SelectField from '@components/common/form/SelectField';
import TimePickerField from '@components/common/form/TimePickerField';
import { TIME_FORMAT_DISPLAY } from '@constants';
import apiConfig from '@constants/apiConfig';
import { daysOfWeekSchedule as daysOfWeekScheduleOptions, stateResgistrationOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Button, Card, Col, Form, Row, Space } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import ScheduleTable from '@components/common/table/ScheduleTable';
import { commonMessage } from '@locales/intl';
import BooleanField from '@components/common/form/BooleanField';
import TextField from '@components/common/form/TextField';
import styles from './member.module.scss';

function ProjectMemberForm({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) {
    const translate = useTranslate();
    const daysOfWeekSchedule = translate.formatKeys(daysOfWeekScheduleOptions, ['label']);
    const registrationStateOption = translate.formatKeys(stateResgistrationOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const [registrationStateFilter, setRegistrationStateFilter] = useState([registrationStateOption[0]]);
    const { form, mixinFuncs, onValuesChange, setFieldValue, getFieldValue } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const [isChecked, setIsChecked] = useState(false);

    function formatTimeRange(timeArray) {
        return timeArray
            .map((time) => {
                if (time.from === '00H00' && time.to === '00H00') {
                    return '';
                } else {
                    return `${time.from}-${time.to}`;
                }
            })
            .filter((time) => time !== '')
            .join('|');
    }
    const handleSubmit = (values) => {
        values.isPaid = isChecked;
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
        const filterNewSchedule = Object.entries(newSchedule)
            .filter(([key, value]) => value !== '')
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
        values.schedule = values.schedule && JSON.stringify(filterNewSchedule);
        if (!values?.state) {
            values.state = 1;
        }
        return mixinFuncs.handleSubmit({ ...values });
    };
    function addFrameTime(data) {
        const result = {};
        const keys = ['t2', 't3', 't4', 't5', 't6', 't7', 'cn'];

        keys.forEach((key) => {
            if (Object.hasOwnProperty.call(data, key)) {
                result[key] = data[key];
            } else {
                result[key] = '00H00-00H00|00H00-00H00|00H00-00H00';
            }
        });

        // Split time and update missing fields
        Object.keys(result).forEach((key) => {
            const timeArray = result[key].split('|');
            if (timeArray.length < 3) {
                while (timeArray.length < 3) {
                    timeArray.push('00H00-00H00');
                }
                result[key] = timeArray.join('|');
            }
        });

        return result;
    }

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
        dataDetail?.isPaid && setIsChecked(dataDetail?.isPaid == 1 && true);
        let data = dataDetail?.schedule && JSON.parse(dataDetail?.schedule);
        if (data) {
            const dataFullFrame = addFrameTime(data);
            data = splitTime(dataFullFrame);
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

        dataDetail.schedule = data || dataDefault;
        form.setFieldsValue({
            ...dataDetail,
            projectRoleId: dataDetail?.projectRole?.id,
            developerId: dataDetail?.developer?.accountDto?.id,
        });
    }, [dataDetail]);

    const onSelectScheduleTabletRandom = (fieldName, value) => {
        try {
            const schedule = getFieldValue('schedule');
            const [dayKey, dayIndexKey, frameKey] = fieldName;
            if (frameKey === 'from') {
                const to = schedule[dayKey][dayIndexKey].to;
                const from = schedule[dayKey][dayIndexKey].from;
                if (to && to.format(TIME_FORMAT_DISPLAY) < value.format(TIME_FORMAT_DISPLAY)) {
                    // schedule[dayKey][dayIndexKey].to = value;
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

    const handleApplyAll = (e) => {
        e.preventDefault();
        const schedule = getFieldValue('schedule');
        const { monday = [] } = schedule;

        for (let { value } of daysOfWeekSchedule) {
            schedule[value] = monday.map((frame) => ({
                from: dayjs(frame.from, TIME_FORMAT_DISPLAY),
                to: dayjs(frame.to, TIME_FORMAT_DISPLAY),
            }));
        }
        // form.resetFields();
        setFieldValue('schedule', schedule);
        onValuesChange();
    };
    const handleOk = () => {
        document.activeElement.blur();
    };

    useEffect(() => {
        registrationStateOption.map((state, index) => {
            if (dataDetail?.state == state.value) {
                const length = registrationStateOption.length;
                let arrayStateFilter = [];
                if (index < length - 3) {
                    arrayStateFilter = [state, registrationStateOption[index + 1], registrationStateOption[length - 1]];
                } else if (index === length - 3) {
                    arrayStateFilter = [state, registrationStateOption[length - 1]];
                } else {
                    arrayStateFilter = [state];
                }
                setRegistrationStateFilter(arrayStateFilter);
            }
        });
    }, [dataDetail]);
    const handleTimeChange = (fieldName, value) => {
        if (!value) {
            try {
                const schedule = getFieldValue('schedule');
                const [dayKey, dayIndexKey, frameKey] = fieldName;
                if (frameKey === 'from') {
                    schedule[dayKey][dayIndexKey].from = dayjs('00:00', 'HH:mm');
                } else if (frameKey === 'to') {
                    schedule[dayKey][dayIndexKey].to = dayjs('00:00', 'HH:mm');
                    // schedule[dayKey][dayIndexKey].to = schedule[dayKey][dayIndexKey].from;
                }
                setFieldValue('schedule', schedule);
                onValuesChange();
            } catch (error) {
                console.log(error);
            }
        }
    };
    const handleReset = (day) => {
        const schedule = getFieldValue('schedule');
        for (let dayIndexKey = 0; dayIndexKey < 3; dayIndexKey++) {
            schedule[day][dayIndexKey].from = dayjs('00:00', 'HH:mm');
            schedule[day][dayIndexKey].to = dayjs('00:00', 'HH:mm');
        }
        setFieldValue('schedule', schedule);
        onValuesChange();
    };

    const handleOnChangeCheckBox = () => {
        setIsChecked(!isChecked);
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} size="1100px">
            <Card className="card-form" bordered={false}>
                <div style={{ width: '980px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <AutoCompleteField
                                disabled={isEditing}
                                required
                                label={translate.formatMessage(commonMessage.developer)}
                                name={['developerId']}
                                apiConfig={apiConfig.developer.autocomplete}
                                mappingOptions={(item) => ({
                                    value: item.id,
                                    label: item.account.fullName,
                                })}
                                initialSearchParams={{ pageNumber: 0,  ignoreMemberProject: true, projectId: projectId }}
                                searchParams={(text) => ({ name: text, ignoreMemberProject: true, projectId: projectId })}
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                required
                                label={translate.formatMessage(commonMessage.role)}
                                name={['projectRoleId']}
                                apiConfig={apiConfig.projectRole.autocomplete}
                                mappingOptions={(item) => ({
                                    value: item.id,
                                    label: item.projectRoleName,
                                })}
                                initialSearchParams={{ pageNumber: 0 }}
                                searchParams={(text) => ({ name: text })}
                            />
                        </Col>
                        {/* <Col span={8}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Sign" />}
                                disabled={isEditing}
                                name={['contractSign']}
                            />
                        </Col> */}
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <CheckboxField
                                className={styles.customCheckbox}
                                label={translate.formatMessage(commonMessage.isPaid)}
                                name="isPaid"
                                checked={isChecked}
                                onChange={handleOnChangeCheckBox}
                            />
                        </Col>
                    </Row>
                </div>
                <ScheduleTable
                    handleOk={handleOk}
                    label={translate.formatMessage(commonMessage.schedule)}
                    onSelectScheduleTabletRandom={onSelectScheduleTabletRandom}
                    translate={translate}
                    handleApplyAll={handleApplyAll}
                    daysOfWeekSchedule={daysOfWeekSchedule}
                    handleTimeChange={handleTimeChange}
                    handleReset={handleReset}
                />
                <div className="footer-card-form" style={{ marginTop: '20px', marginRight: '69px' }}>
                    {actions}
                </div>
            </Card>
        </BaseForm>
    );
}

export default ProjectMemberForm;
