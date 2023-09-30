import React from 'react';

import { Form, DatePicker } from 'antd';
import { DATE_SHORT_MONTH_FORMAT } from '@constants';
import useFormField from '@hooks/useFormField';

const { RangePicker } = DatePicker;

function DateRangePickerField({
    size,
    format = DATE_SHORT_MONTH_FORMAT,
    label,
    name,
    disabled,
    disabledDate,
    onCalendarChange,
    onChange,
    allowClear = true,
    formItemProps,
    fieldProps,
    onOpenChange,
    ref,
    ...props
}) {
    const { rules } = useFormField(props);

    return (
        <Form.Item {...formItemProps} label={label} name={name} rules={rules} {...props}>
            <RangePicker
                size={size}
                disabledDate={disabledDate}
                allowClear={allowClear}
                style={{ ...fieldProps?.style }}
                format={format}
                disabled={disabled}
                onChange={onChange}
                onCalendarChange={onCalendarChange}
                onOpenChange={onOpenChange}
                ref={ref}
            />
        </Form.Item>
    );
}

export default DateRangePickerField;
