import { UserOutlined } from '@ant-design/icons';
import { AppConstants } from '@constants';
import { IconBell } from '@tabler/icons-react';
import HeadlessTippy from '@tippyjs/react/headless';
import { Avatar, Badge, Button, Card } from 'antd';
import React, { useState } from 'react';
import styles from './NotificationForm.module.scss';

export const NotificationForm = ({ data, ...props }) => {
    const [activeButtonAll, setActiveButtonAll] = useState(true);
    return (
        <HeadlessTippy
            interactive
            placement="bottom-end"
            trigger="click"
            render={(attrs) => (
                <Card className={styles.wrapper}>
                    <div className={styles.wrapperButton}>
                        <Button
                            type={activeButtonAll ? 'primary' : 'default'}
                            shape="round"
                            onClick={() => {
                                setActiveButtonAll(true);
                            }}
                            style={{ marginRight: '4px' }}
                        >
                            Tất cả
                        </Button>
                        <Button
                            type={!activeButtonAll ? 'primary' : 'default'}
                            shape="round"
                            onClick={() => {
                                setActiveButtonAll(false);
                            }}
                        >
                            Chưa đọc
                        </Button>
                    </div>
                    {data?.map((item) => {
                        return (
                            <div key={item.id} className={styles.notificationItem}>
                                <Avatar
                                    size={40}
                                    icon={<UserOutlined />}
                                    src={`${AppConstants.contentRootUrl}`}
                                    style={{ marginRight: '16px' }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        whiteSpace: 'normal',
                                        width: '410px',
                                    }}
                                >
                                    <text>
                                        <span style={{ fontWeight: 700 }}>{item?.name}</span>
                                        {item?.label}
                                    </text>
                                    <span>{item?.time}</span>
                                </div>
                            </div>
                        );
                    })}
                </Card>
            )}
            {...props}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Badge count={88}>
                    <IconBell />
                </Badge>
            </div>
        </HeadlessTippy>
    );
};
