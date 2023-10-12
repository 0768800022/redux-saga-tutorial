import React from 'react';
import { Tooltip } from 'antd';

export const BaseTooltip = ({ placement = 'bottom', title, children, ...props }) => {
    return (
        <Tooltip placement={placement} title={title} {...props}>
            {children}
        </Tooltip>
    );
};
