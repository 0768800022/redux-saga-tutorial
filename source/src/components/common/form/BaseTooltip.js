import React from 'react';
import { Tooltip } from 'antd';

export const BaseTooltip = ({ placement = 'bottom',firstTitle = '', lastTitle = '', children, ...props }) => {
    return (
        <Tooltip placement={placement} title={firstTitle + lastTitle} {...props}>
            {children}
        </Tooltip>
    );
};
