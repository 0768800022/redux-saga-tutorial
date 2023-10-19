import { Button, Form, Space } from 'antd';
import React from 'react';
import TimePickerField from '../form/TimePickerField';
import { defineMessages } from 'react-intl';
const messages = defineMessages({
    dayOfWeek: 'Thứ',
    timeFrame: 'Khung giờ',
    applyAll: 'Áp dụng tất cả',
    frame: 'Khung',
});
function ScheduleTable({
    label,
    onSelectScheduleTabletRandom,
    translate,
    daysOfWeekSchedule,
    canApplyAll,
    handleApplyAll,
    handleOk,
}) {
    return (
        <div>
            <div style={{ padding: '10px' }}>{label}</div>
            <table className="happy-hours-table" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th width="14%">{translate.formatMessage(messages.dayOfWeek)}</th>
                        <th>{translate.formatMessage(messages.timeFrame)}</th>
                    </tr>
                </thead>
                <tbody>
                    {daysOfWeekSchedule.map((day, dayIndex) => (
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
                                                                    onOk={handleOk}
                                                                    style={{ width: '90px' }}
                                                                    size="small"
                                                                    name={[field.name, 'from']}
                                                                    onSelect={(value) =>
                                                                        onSelectScheduleTabletRandom(
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
                                                                    onOk={handleOk}
                                                                    style={{ width: '90px' }}
                                                                    size="small"
                                                                    name={[field.name, 'to']}
                                                                    onSelect={(value) =>
                                                                        onSelectScheduleTabletRandom(
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
                                                                disabled={!canApplyAll}
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
        </div>
    );
}
export default ScheduleTable;
