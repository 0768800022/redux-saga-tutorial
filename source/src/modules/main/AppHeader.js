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

        const intervalId = setInterval(() => {
            webSocket(token);
        }, 30000);

        // Clear interval khi component bị hủy
        return () => {
            clearInterval(intervalId);
        };
    }, []);
    const data = [
        {
            id: 1,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 2,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 3,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 4,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 5,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 6,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 7,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 8,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 9,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 10,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 11,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
        {
            id: 12,
            label: ' đã hoàn thành xong task xây dựng CRUD trang chủ và CRUD trang người dùng',
            time: '5 giờ trước',
            name: 'Tuan Nguyen',
        },
    ];

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
                        label: <NotificationForm data={data} />,
                    },
                ]}
            />
        </Header>
    );
};

export default AppHeader;
