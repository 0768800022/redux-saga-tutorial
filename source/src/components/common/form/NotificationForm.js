import { UserOutlined } from '@ant-design/icons';
import { AppConstants, DATE_DISPLAY_FORMAT, DEFAULT_FORMAT } from '@constants';
import { IconBell, IconBellFilled, IconCheck, IconCircleCheck, IconCircleX, IconInfoCircle } from '@tabler/icons-react';
import HeadlessTippy from '@tippyjs/react/headless';
import { Avatar, Badge, Button, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './NotificationForm.module.scss';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertStringToDateTime } from '@utils/dayHelper';
import moment from 'moment';
import { BaseTooltip } from './BaseTooltip';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';

export const NotificationForm = ({
    data,
    executeGetData,
    executeUpdateState,
    loading,
    unReadTotal,
    pageTotal,
    ...props
}) => {
    const [activeButtonAll, setActiveButtonAll] = useState(true);
    const [activeIcon, setActiveIcon] = useState(false);
    const translate = useTranslate();
    const [dataNotification, setDataNotification] = useState([]);
    const [isLoadMore, setIsLoadMore] = useState(false);
    let [countLoadMore, setCountLoadMore] = useState(1);
    const [hiddenItems, setHiddenItems] = useState([]);
    const [deleteAll, setDeleteAll] = useState(false);
    const [readAll, setReadAll] = useState(false);
    const { execute: executeReadAll } = useFetch(apiConfig.notification.readAll, {
        immediate: false,
    });
    const { execute: executeDeleteAll } = useFetch(apiConfig.notification.deleteAll, {
        immediate: false,
    });

    useEffect(() => {
        if (isLoadMore && data) {
            setDataNotification([...dataNotification, ...data]);
        } else {
            setDataNotification(data);
        }
    }, [data]);
    useEffect(() => {
        if (activeIcon) {
            if (activeButtonAll) {
                executeGetData();
            } else {
                executeGetData({
                    params: { state: 0 },
                });
            }
        }
        setReadAll(false);
        setDeleteAll(false);
    }, [activeIcon]);

    useEffect(() => {
        if (!activeButtonAll) {
            executeGetData({
                params: { state: 0 },
            });
        } else {
            executeGetData();
        }
        setIsLoadMore(false);
        setCountLoadMore(1);
    }, [activeButtonAll]);
    const iconNotification = (kind, style, size) => {
        if (kind == 1) {
            return <IconCircleCheck color="green" style={style} size={size} />;
        } else if (kind == 2) {
            return <IconInfoCircle color="blue" style={style} size={size} />;
        } else {
            return <IconCircleX color="red" style={style} size={size} />;
        }
    };
    const titleNotification = (kind) => {
        if (kind == 1) {
            return 'Done Task';
        } else if (kind == 2) {
            return 'New Task';
        } else {
            return 'Cancel Task';
        }
    };
    const timeNotification = (createdDate) => {
        const dateTime = moment(createdDate, DEFAULT_FORMAT).add(7, 'hours');
        const currentTime = moment();
        const minutesTotal = currentTime.diff(dateTime, 'minutes');
        const hoursTotal = minutesTotal / 60;
        const daysTotal = hoursTotal / 24;
        if (daysTotal >= 1) {
            return daysTotal.toFixed(0) + ' day ago';
        } else if (hoursTotal >= 1) {
            return hoursTotal.toFixed(0) + ' hour ago';
        } else {
            return minutesTotal.toFixed(0) + ' minute ago';
        }
    };
    const handleOnClickChecked = (id) => {
        executeUpdateState({
            data: { id },
        });
        setHiddenItems([...hiddenItems, id]);
    };

    const handleLoadMore = () => {
        setIsLoadMore(true);
        if (!activeButtonAll) {
            executeGetData({
                params: { state: 0, page: countLoadMore },
            });
        } else {
            executeGetData({
                params: { page: countLoadMore },
            });
        }
        setCountLoadMore((countLoadMore += 1));
    };
    const handleReadAll = () => {
        executeReadAll();
        setReadAll(true);
    };
    const handleDeleteAll = () => {
        executeDeleteAll();
        setDeleteAll(true);
    };

    return (
        <HeadlessTippy
            interactive
            placement="bottom-end"
            trigger="click"
            onShow={() => {
                setActiveIcon(true);
            }}
            onHide={() => {
                setActiveIcon(false);
            }}
            offset={[30, 12]}
            render={(attrs) => (
                <Card className={styles.wrapper}>
                    <div className={styles.wrapperButton}>
                        <div>
                            <Button
                                type={activeButtonAll ? 'primary' : 'default'}
                                shape="round"
                                onClick={() => {
                                    setActiveButtonAll(true);
                                }}
                                style={{ marginRight: '4px' }}
                            >
                                {translate.formatMessage(commonMessage.all)}
                            </Button>
                            <Button
                                type={!activeButtonAll ? 'primary' : 'default'}
                                shape="round"
                                onClick={() => {
                                    setActiveButtonAll(false);
                                }}
                            >
                                {translate.formatMessage(commonMessage.unRead)}
                            </Button>
                        </div>
                        <div>
                            <Button type="default" shape="round" style={{ marginRight: '4px' }} onClick={handleReadAll}>
                                {translate.formatMessage(commonMessage.readAll)}
                            </Button>
                            <Button type="default" shape="round" onClick={handleDeleteAll}>
                                {translate.formatMessage(commonMessage.deleteAll)}
                            </Button>
                        </div>
                    </div>
                    {dataNotification?.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className={
                                    styles.notificationItem +
                                    ' ' +
                                    ((item?.state == 1 || hiddenItems.includes(item?.id) || readAll) && styles.viewed)
                                }
                                style={{
                                    display:
                                        (hiddenItems.includes(item?.id) && !activeButtonAll) ||
                                        deleteAll ||
                                        (readAll && !activeButtonAll)
                                            ? 'none'
                                            : '',
                                }}
                            >
                                {iconNotification(item?.kind, { marginRight: '16px' }, 36)}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        whiteSpace: 'normal',
                                        width: '410px',
                                    }}
                                >
                                    <text style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 700 }}>{titleNotification(item?.kind)}</span>
                                        <span style={{ fontWeight: 600, width: '350px', wordWrap: 'break-word' }}>
                                            {item?.message}
                                        </span>
                                    </text>
                                    <span style={{ paddingTop: '4px' }}>{timeNotification(item?.createdDate)}</span>
                                </div>
                                {item?.state == 0 && !hiddenItems.includes(item?.id) && !readAll && (
                                    <BaseTooltip title={'Đánh dấu đã đọc'}>
                                        <Button
                                            type="link"
                                            style={{ paddingRight: '10px' }}
                                            onClick={() => handleOnClickChecked(item?.id)}
                                        >
                                            <IconCheck color="#2b6fab" />
                                        </Button>
                                    </BaseTooltip>
                                )}
                            </div>
                        );
                    })}
                    {pageTotal > 0 && countLoadMore != pageTotal && !deleteAll && !(readAll && !activeButtonAll) && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                            <Button onClick={handleLoadMore}>Load more</Button>
                        </div>
                    )}
                </Card>
            )}
            {...props}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Badge dot={unReadTotal > 0}>{activeIcon ? <IconBellFilled /> : <IconBell />}</Badge>
            </div>
        </HeadlessTippy>
    );
};
