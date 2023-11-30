import React, { useEffect } from 'react';
import { Layout, Menu, Avatar, Space } from 'antd';
import { DownOutlined, UserOutlined, LoginOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
const { Header } = Layout;

import styles from './AppHeader.module.scss';
import useAuth from '@hooks/useAuth';
import { useDispatch } from 'react-redux';
import { accountActions } from '@store/actions';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { getCacheAccessToken, removeCacheToken } from '@services/userService';
import { useNavigate } from 'react-router-dom';
import { AppConstants } from '@constants';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { NotificationForm } from '@components/common/form/NotificationForm';
import { webSocket } from '../../utils/webSocket';

const messages = defineMessages({
    profile: 'Profile',
    logout: 'Logout',
});

const AppHeader = ({ collapsed, onCollapse }) => {
    const { profile } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const translate = useTranslate();
    const { execute: executeLogout } = useFetch(apiConfig.account.logout);

    const onLogout = () => {
        removeCacheToken();
        dispatch(accountActions.logout());
    };
    useEffect(() => {
        const token = getCacheAccessToken();
        webSocket(token);
    }, []);
    const { data: dataMyNotification, execute: executeGetDataMyNotification } = useFetch(
        apiConfig.notification.myNotification,
        {
            immediate: true,
            mappingData: ({ data }) => {
                const pageTotal = data?.totalPages;
                const unReadTotal = data?.totalUnread;
                const listNotification = data?.content?.map((item) => ({
                    id: item?.id,
                    message: item?.msg,
                    kind: item?.kind,
                    createdDate: item?.createdDate,
                    state: item?.state,
                }));
                return {
                    pageTotal,
                    unReadTotal,
                    listNotification,
                };
            },
        },
    );
    const { execute: executeUpdateState, loading: loadingUpdate } = useFetch(apiConfig.notification.changeState, {
        immediate: false,
    });

    return (
        <Header className={styles.appHeader} style={{ padding: 0, background: 'white' }}>
            <span className={styles.iconCollapse} onClick={onCollapse}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Menu
                mode="horizontal"
                className={styles.rightMenu}
                selectedKeys={[]}
                items={[
                    {
                        key: 'menu',
                        label: (
                            <Space>
                                <Avatar
                                    icon={<UserOutlined />}
                                    src={`${AppConstants.contentRootUrl}${
                                        profile.logoPath || profile.avatar || profile.logo
                                    }`}
                                />
                                {profile?.careerName ||
                                    profile?.leaderName ||
                                    profile?.fullName ||
                                    profile?.companyName}
                                <DownOutlined />
                            </Space>
                        ),
                        children: [
                            {
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <UserOutlined />
                                        <span>{translate.formatMessage(messages.profile)}</span>
                                    </div>
                                ),
                                key: 'profile',
                                onClick: () => navigate('/profile'),
                            },
                            {
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <LoginOutlined />
                                        <span>{translate.formatMessage(messages.logout)}</span>
                                    </div>
                                ),
                                key: 'logout',
                                onClick: onLogout,
                            },
                        ],
                    },
                    {
                        key: 'notification',
                        label: (
                            <NotificationForm
                                data={dataMyNotification?.listNotification}
                                executeGetData={executeGetDataMyNotification}
                                executeUpdateState={executeUpdateState}
                                loading={loadingUpdate}
                                unReadTotal={dataMyNotification?.unReadTotal}
                                pageTotal={dataMyNotification?.pageTotal}
                            />
                        ),
                    },
                ]}
            />
        </Header>
    );
};

export default AppHeader;
