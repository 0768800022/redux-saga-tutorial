import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import CheckboxField from '@components/common/form/CheckboxField';
import SelectField from '@components/common/form/SelectField';
import TimePickerField from '@components/common/form/TimePickerField';
import { TIME_FORMAT_DISPLAY } from '@constants';
import apiConfig from '@constants/apiConfig';
import { daysOfWeekTimeWork as daysOfWeekTimeWorkOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Button, Card, Col, Form, Row, Space } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
    student: 'Tên sinh viên',
    isIntern: 'Đăng kí thực tập',
    payment: 'Phương thức thanh toán',
    paymentDeliver: 'Phương thức thanh toán giao hàng',
    timeWork: 'Thời gian làm việc',
    dayOfWeek: 'Thứ',
    timeFrame: 'Khung giờ',
    applyAll: 'Áp dụng cho tất cả',
    frame: 'Khung',
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
    const daysOfWeekTimeWork = translate.formatKeys(daysOfWeekTimeWorkOptions, ['label']);
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
        daysOfWeekTimeWork.map((day) => {
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
                ],
                ...dataDefault,
            };
        });

        for (const day in data) {
            for (const timeRange of data[day]) {
                timeRange.from = moment(timeRange.from);
                timeRange.to = moment(timeRange.to);
            }
        }
        for (const day in dataDefault) {
            for (const timeRange of dataDefault[day]) {
                timeRange.from = moment(timeRange.from).subtract(7, 'hours');
                timeRange.to = moment(timeRange.to).subtract(7, 'hours');
            }
        }

        dataDetail &&
            statesOptionSelect.map((state) => {
                if (state.value == dataDetail.state) {
                    dataDetail.state = state.label;
                }
            });
        form.setFieldsValue({
            ...dataDetail,
            studentId: dataDetail?.studentInfo?.fullName,
            schedule: data || dataDefault,
        });
    }, [dataDetail]);

    const onSelectTimeWorkTabletRandom = (fieldName, value) => {
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
        for (let { value } of daysOfWeekTimeWork) {
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
                            initialSearchParams={{}}
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
                            required
                            label={translate.formatMessage(messages.isIntern)}
                            name="isIntern"
                            checked={isChecked}
                            onChange={handleOnChangeCheckBox}
                        />
                    </Col>
                </Row>

                <TimeWork
                    onSelectTimeWorkTabletRandom={onSelectTimeWorkTabletRandom}
                    checkCanApplyAll={checkCanApplyAll}
                    handleApplyAll={handleApplyAll}
                    translate={translate}
                    daysOfWeekTimeWork={daysOfWeekTimeWork}
                />

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
}

function TimeWork({ onSelectTimeWorkTabletRandom, checkCanApplyAll, handleApplyAll, translate, daysOfWeekTimeWork }) {
    return (
        <table className="happy-hours-table">
            <thead>
                <tr>
                    <th width="14%">{translate.formatMessage(messages.dayOfWeek)}</th>
                    <th>{translate.formatMessage(messages.timeFrame)}</th>
                </tr>
            </thead>
            <tbody>
                {daysOfWeekTimeWork.map((day, dayIndex) => (
                    <tr key={day.value}>
                        <td>{day.label}</td>
                        <td style={{ padding: '10px' }}>
                            <Form.List name={['schedule', day.value]}>
                                {(fields, { add, remove }) => {
                                    return (
                                        <div className="no-margin-form-item">
                                            <Space className="box-flex" size={24}>
                                                {fields.map((field, index) => (
                                                    <div key={field.key}>
                                                        <div className="frame-label">
                                                            {translate.formatMessage(messages.frame)} {index + 1}
                                                        </div>
                                                        <Space className="box-flex">
                                                            <TimePickerField
                                                                size="small"
                                                                name={[field.name, 'from']}
                                                                onSelect={(value) =>
                                                                    onSelectTimeWorkTabletRandom(
                                                                        [day.value, field.name, 'from'],
                                                                        value,
                                                                    )
                                                                }
                                                                width="100%"
                                                                required
                                                                placeholder="From"
                                                                requiredMsg="Enter from"
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                // disabledHours={() => {
                                                                //     const tabletRandom = getFieldValue('tablet_random');
                                                                //     let to = null;
                                                                //     if(index > 0) {
                                                                //         to = tabletRandom.schedule[day.value][index - 1].to;
                                                                //     }
                                                                //     return getDisabledHours(to);
                                                                // }}
                                                            />
                                                            <TimePickerField
                                                                size="small"
                                                                name={[field.name, 'to']}
                                                                onSelect={(value) =>
                                                                    onSelectTimeWorkTabletRandom(
                                                                        [day.value, field.name, 'to'],
                                                                        value,
                                                                    )
                                                                }
                                                                width="100%"
                                                                required
                                                                placeholder="to"
                                                                requiredMsg="Enter to"
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                // disabledHours={() => {
                                                                //     const timeWork = getFieldValue('time_work');
                                                                //     const from =
                                                                //         timeWork[day.value][field.name].from;
                                                                //     return getDisabledHours(from);
                                                                // }}
                                                                // disabledMinutes={(hour) => {
                                                                //     const timeWork = getFieldValue('time_work');
                                                                //     const from =
                                                                //         timeWork[day.value][field.name].from;
                                                                //     return getDisabledMinutes(hour, from);
                                                                // }}
                                                            />
                                                        </Space>
                                                    </div>
                                                ))}
                                                {!dayIndex && (
                                                    <div className="wrap-btn-apply-all">
                                                        <Button
                                                            disabled={!checkCanApplyAll()}
                                                            type="primary"
                                                            size="middle"
                                                            onClick={handleApplyAll}
                                                        >
                                                            {translate.formatMessage(messages.applyAll)}
                                                        </Button>
                                                    </div>
                                                )}
                                            </Space>

                                            {/* <Form.Item style={{ width: '170px', textAlign: 'left' }}>
                                            <Button type="dashed" onClick={add}>
                                            <PlusOutlined />Add Frame
                                    </Button>
                                        </Form.Item> */}
                                        </div>
                                    );
                                }}
                            </Form.List>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default RegistrationForm;
