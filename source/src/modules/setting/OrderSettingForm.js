import DropdownField from '@components/common/form/DropdownField';
import FieldSet from '@components/common/form/FieldSet';
import TimePickerField from '@components/common/form/TimePickerField';
import { TIME_FORMAT_DISPLAY } from '@constants';
import { daysOfWeekTimeWork as daysOfWeekTimeWorkOptions, formSize, orderMethods } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Button, Card, Col, Form, Row, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
const messages = defineMessages({
    payment: 'Phương thức thanh toán',
    paymentDeliver: 'Phương thức thanh toán giao hàng',
    timeWork: 'Thời gian làm việc',
    dayOfWeek: 'Thứ',
    timeFrame: 'Khung giờ',
    applyAll: 'Áp dụng cho tất cả',
    frame: 'Khung',
});
const OrderSettingForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, size = 'small' }) => {
    const { form, mixinFuncs, onValuesChange, setFieldValue, getFieldValue } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const translate = useTranslate();
    const daysOfWeekTimeWork = translate.formatKeys(daysOfWeekTimeWorkOptions, ['label']);
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            payment_method: dataDetail.payment_method.map((item) => item.code),
            payment_deliver_method: dataDetail.payment_method.map((item) => item.code),
        });
    }, [dataDetail]);
    const onSelectTimeWorkTabletRandom = (fieldName, value) => {
        try {
            const time_work = getFieldValue('time_work');
            const [dayKey, dayIndexKey, frameKey] = fieldName;
            if (frameKey === 'from') {
                const to = time_work[dayKey][dayIndexKey].to;
                if (to && to.format(TIME_FORMAT_DISPLAY) < value.format(TIME_FORMAT_DISPLAY)) {
                    time_work[dayKey][dayIndexKey].to = null;
                }
            } else if (frameKey === 'to') {
                const from = time_work[dayKey][dayIndexKey].from;
                if (from && value.format(TIME_FORMAT_DISPLAY) < from.format(TIME_FORMAT_DISPLAY)) {
                    value = from;
                }
            }
            time_work[dayKey][dayIndexKey][frameKey] = value;
            setFieldValue('time_work', time_work);
            onValuesChange();
            // checkCanApplyAll();
        } catch (error) {
            console.log(error);
        }
    };
    const checkCanApplyAll = () => {
        const time_work = getFieldValue('time_work');
        if (time_work) {
            const { monday } = time_work;
            if (!monday) {
                return false;
            }
            return monday.every((frame) => !!frame.from && !!frame.to);
        }
        return false;
    };

    const handleApplyAll = (e) => {
        e.preventDefault();
        const time_work = getFieldValue('time_work');
        const { monday = [] } = time_work;

        for (let { value } of daysOfWeekTimeWork) {
            time_work[value] = monday.map((frame) => ({
                from: dayjs(frame.from, TIME_FORMAT_DISPLAY),
                to: dayjs(frame.to, TIME_FORMAT_DISPLAY),
            }));
        }
        // form.resetFields();
        setFieldValue('time_work', time_work);
        checkCanApplyAll();
        onValuesChange();
    };

    return (
        <Form
            style={{ width: formSize[size] ?? size }}
            id={formId}
            onFinish={mixinFuncs.handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <DropdownField
                        mode="multiple"
                        name="payment_method"
                        label={translate.formatMessage(messages.payment)}
                        options={orderMethods}
                    />
                </Col>
                <Col span={12}>
                    <DropdownField
                        mode="multiple"
                        name="payment_deliver_method"
                        label={translate.formatMessage(messages.paymentDeliver)}
                        options={orderMethods}
                    />
                </Col>
            </Row>
            <FieldSet title={translate.formatMessage(messages.timeWork)} className="customFieldset">
                <TimeWork
                    onSelectTimeWorkTabletRandom={onSelectTimeWorkTabletRandom}
                    checkCanApplyAll={checkCanApplyAll}
                    handleApplyAll={handleApplyAll}
                    translate={translate}
                    daysOfWeekTimeWork={daysOfWeekTimeWork}
                />
            </FieldSet>
            <div className="footer-card-form">{actions}</div>
        </Form>
    );
};

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
                            <Form.List name={['time_work', day.value]}>
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
                                                                //         to = tabletRandom.time_work[day.value][index - 1].to;
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

export default OrderSettingForm;
