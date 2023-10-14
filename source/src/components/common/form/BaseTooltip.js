import React from 'react';
import { Tooltip } from 'antd';

export const BaseTooltip = ({
    placement = 'bottom',
    type,
    objectName = '',
    title,
    toLowerCase = false,
    children,
    ...props
}) => {
    if (toLowerCase) {
        objectName = objectName.toLowerCase();
    }
    if (type === 'edit') {
        title = `Sửa ${objectName}`;
    } else if (type === 'delete') {
        title = `Xoá ${objectName}`;
    }
    return (
        <Tooltip placement={placement} title={title} {...props}>
            {children}
        </Tooltip>
    );
};
