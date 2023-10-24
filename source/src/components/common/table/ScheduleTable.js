import { Button, Form, Space } from 'antd';
import React from 'react';
import TimePickerField from '../form/TimePickerField';
import { defineMessages } from 'react-intl';
const messages = defineMessages({
    dayOfWeek: 'Thứ',
    timeFrame: 'Khung giờ',
    applyAll: 'Áp dụng tất cả',
    frame: 'Khung',
    reset: 'Làm mới',
});
function ScheduleTable({
    label,
    onSelectScheduleTabletRandom,
    translate,
    daysOfWeekSchedule,
    canApplyAll = true,
    handleApplyAll,
    handleOk,
    handleTimeChange,
    handleReset,
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
                                    {(fields) => {
                                        return (
                                            <div className="no-margin-form-item">
                                                <Space className="box-flex" size={33}>
                                                    {fields.map((field, index) => (
                                                        <div key={field.key}>
                                                            <div className="frame-label">
                                                                {translate.formatMessage(messages.frame)} {index + 1}
                                                            </div>
                                                            <Space className="box-flex">
                                                                <TimePickerField
                                                                    onChange={(e) =>
                                                                        handleTimeChange([
                                                                            day.value,
                                                                            field.name,
                                                                            'from',
                                                                        ])
                                                                    }
                                                                    onOk={handleOk}
                                                                    style={{ width: '70px' }}
                                                                    size="small"
                                                                    name={[field.name, 'from']}
                                                                    onSelect={(value) =>
                                                                        onSelectScheduleTabletRandom(
                                                                            [day.value, field.name, 'from'],
                                                                            value,
                                                                        )
                                                                    }
                                                                    width="100%"
                                                                    placeholder="From"
                                                                />
                                                                <TimePickerField
                                                                    onOk={handleOk}
                                                                    style={{ width: '70px' }}
                                                                    size="small"
                                                                    name={[field.name, 'to']}
                                                                    onSelect={(value) =>
                                                                        onSelectScheduleTabletRandom(
                                                                            [day.value, field.name, 'to'],
                                                                            value,
                                                                        )
                                                                    }
                                                                    onChange={(value) =>
                                                                        handleTimeChange(
                                                                            [day.value, field.name, 'to'],
                                                                            value,
                                                                        )
                                                                    }
                                                                    width="100%"
                                                                    required
                                                                    placeholder="to"
                                                                    requiredMsg="Enter to"
                                                                    validateTrigger={['onBlur']}
                                                                />
                                                            </Space>
                                                        </div>
                                                    ))}
                                                    <div className="wrap-btn-apply-all">
                                                        <Button
                                                            type="primary"
                                                            size="middle"
                                                            style={{ marginRight: '10px' }}
                                                            onClick={() => handleReset(day.value)}
                                                        >
                                                            {translate.formatMessage(messages.reset)}
                                                        </Button>
                                                        {!dayIndex && (
                                                            <Button
                                                                disabled={!canApplyAll}
                                                                type="primary"
                                                                size="middle"
                                                                onClick={handleApplyAll}
                                                            >
                                                                {translate.formatMessage(messages.applyAll)}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </Space>
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
