import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import { Card, Tabs } from 'antd';
import React from 'react';
import { defineMessages } from 'react-intl';
import GeneralSettingPage from './GeneralSetting';
import { settingGroups } from '@constants/masterData';

const message = defineMessages({
    generalSetting: 'Cài đặt chung',
    home: 'Trang chủ',
});

const SettingPage = () => {
    const translate = useTranslate();

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.generalSetting) },
            ]}
        >
            <Card className="card-form" bordered={false}>
                <Tabs
                    type="card"
                    items={[
                        {
                            key: 'general',
                            label: translate.formatMessage(message.generalSetting),
                            children: <GeneralSettingPage groupName={settingGroups.GENERAL} />,
                        },
                    ]}
                />
            </Card>
        </PageWrapper>
    );
};

export default SettingPage;
