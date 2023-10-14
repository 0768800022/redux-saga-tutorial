import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Button, Form } from 'antd';

import apiConfig from '@constants/apiConfig';
import { setCacheAccessToken } from '@services/userService';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import InputTextField from '@components/common/form/InputTextField';

const message = defineMessages({
    username: 'Username',
    password: 'Password',
    login: 'Login',
});

import styles from './index.module.scss';
import { accountActions } from '@store/actions';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import Title from 'antd/es/typography/Title';
import { showErrorMessage } from '@services/notifyService';
import {
    LEADER_LOGIN_TYPE,
    apiTenantId,
    appAccount,
    brandName,
    groupPermissionKinds,
    loginOptions,
    storageKeys,
    baseHeader,
    STUDENT_LOGIN_TYPE,
} from '@constants';
import { Buffer } from 'buffer';
import { setData } from '@utils/localStorage';
import useNotification from '@hooks/useNotification';
import SelectField from '@components/common/form/SelectField';
import { FormattedMessage } from 'react-intl';
import { sendRequest } from '@services/api';
window.Buffer = window.Buffer || Buffer;

const LoginPage = () => {
    const intl = useIntl();
    const base64Credentials = Buffer.from(`${appAccount.APP_USERNAME}:${appAccount.APP_PASSWORD}`).toString('base64');
    const { execute, loading } = useFetch({
        ...apiConfig.account.loginBasic,
        authorization: `Basic ${base64Credentials}`,
    });
    const { execute: executeLeaderLogin, loading: loadingLeader } = useFetch(apiConfig.leader.login);
    const { execute: executeStudentLogin, loading: loadingStudent } = useFetch(apiConfig.student.login);
    const { execute: executeGetCareerDetail, loading: loadingCareer } = useFetch(apiConfig.organize.getDetail, {
        pathParams: { id: apiTenantId },
    });
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const notification = useNotification();
    const onFinish = (values) => {
        if (values.grant_type === LEADER_LOGIN_TYPE)
            executeGetCareerDetail({
                onCompleted: (res) => {
                    setData(storageKeys.TENANT_HEADER, res.data?.name);
                    setData(storageKeys.TENANT_API_URL, res?.data?.serverProviderDto?.url);
                    setData(storageKeys.TENANT_HEADER, res.data?.name);
                    setData(storageKeys.TENANT_ID, res?.data?.id);
                    executeLeaderLogin({
                        data: { ...values, phone: values.username, tenantId: apiTenantId },
                        onCompleted: (res) => {
                            handleLoginSuccess(res.data);
                        },
                        onError: (res) => {
                            notification({ type: 'error', message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
                        },
                    });
                },
            });
        else if (values.grant_type === STUDENT_LOGIN_TYPE)
            executeGetCareerDetail({
                onCompleted: (res) => {
                    setData(storageKeys.TENANT_HEADER, res.data?.name);
                    setData(storageKeys.TENANT_API_URL, res?.data?.serverProviderDto?.url);
                    setData(storageKeys.TENANT_HEADER, res.data?.name);
                    setData(storageKeys.TENANT_ID, res?.data?.id);
                    executeStudentLogin({
                        data: { ...values, phone: values.username, tenantId: apiTenantId },
                        onCompleted: (res) => {
                            handleLoginSuccess(res.data);
                        },
                        onError: (res) => {
                            notification({ type: 'error', message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
                        },
                    });
                },
            });
        else
            execute({
                data: { ...values },
                onCompleted: (res) => {
                    handleLoginSuccess(res);
                },
                onError: (res) => {
                    notification({ type: 'error', message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
                },
            });
    };

    const handleLoginSuccess = (res) => {
        setCacheAccessToken(res.access_token);
        setData(storageKeys.USER_KIND, res.user_kind);
        executeGetProfile({ kind: res.user_kind });
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginForm}>
                <Title level={3}>{intl.formatMessage(message.login).toUpperCase()}</Title>
                <Form
                    name="login-form"
                    onFinish={onFinish}
                    initialValues={{
                        username: '',
                        password: '',
                    }}
                    layout="vertical"
                >
                    <InputTextField
                        name="username"
                        fieldProps={{ prefix: <UserOutlined /> }}
                        // label={intl.formatMessage(message.username)}
                        placeholder={intl.formatMessage(message.username)}
                        size="large"
                        required
                    />
                    <InputTextField
                        name="password"
                        fieldProps={{ prefix: <LockOutlined /> }}
                        // label={intl.formatMessage(message.password)}
                        placeholder={intl.formatMessage(message.password)}
                        size="large"
                        required
                        type="password"
                    />

                    <SelectField
                        placeholder={<FormattedMessage defaultMessage="Loại tài khoản" />}
                        required
                        name="grant_type"
                        options={loginOptions}
                    />

                    <Button type="primary" size="large" loading={loading} htmlType="submit" style={{ width: '100%' }}>
                        {intl.formatMessage(message.login)}
                    </Button>
                    <center className="s-mt4px">
                        <small>
                            {brandName} - © Copyright {new Date().getFullYear()}. All Rights Reserved
                        </small>
                    </center>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
