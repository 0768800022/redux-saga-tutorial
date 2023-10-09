import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants/index';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DATE_DISPLAY_FORMAT, DATE_FORMAT_DISPLAY } from '@constants';
import { formatMoney } from '@utils/index';
import { statusOptions } from '@constants/masterData';

const message = defineMessages({
    objectName: 'CompanySubscription',
    home: 'Trang chủ',
    companyName: 'Tên công ty',
    startDate: 'Ngày bắt đầu',
    endDate: 'Ngày kết thúc',
    company: 'Gói dịch vụ',
    status: 'Trạng thái',
    subscriptionName: 'Tên đăng ký',
    price: 'Giá',
});

const CompanySubscriptionListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const companyId = queryParameters.get('companyId');
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.companySubscription,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getCreateLink = () => {
                if (companyId !== null) {
                    return `${pagePath}/create?companyId=${companyId}`;
                }
                return `${pagePath}/create`;
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: ['company', 'logo'],
            align: 'center',
            width: 80,
            render: (logo) => (
                <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    src={logo ? `${AppConstants.contentRootUrl}${logo}` : null}
                />
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Tên công ty" />,
            dataIndex: ['company', 'companyName'],
        },
        {
            title: <FormattedMessage defaultMessage="Gói dịch vụ" />,
            dataIndex: ['subscription', 'name'],
        },
        {
            title: <FormattedMessage defaultMessage="Giá dịch vụ" />,
            dataIndex: ['subscription', 'price'],
            render: (price) => {
                const formattedValue = formatMoney(price, {
                    currentcy: 'đ',            
                    currentDecimal : '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: translate.formatMessage(message.status),
            dataIndex: 'status',
            align: 'center',
            width: 120,
            render(dataRow) {
                const status = statusValues.find((item) => item.value == dataRow);
                return <Tag color={status.color}>{status.label}</Tag>;
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 140,
            render: (startDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(startDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            align: 'center',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            width: 140,
            render: (endDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(endDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            align: 'center',
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'companyName',
            placeholder: translate.formatMessage(message.companyName),
            // key: 'subscriptionName',
            // placeholder: translate.formatMessage(message.subscriptionName),
        },
        {
            key: 'subscriptionName',
            placeholder: translate.formatMessage(message.subscriptionName),
        },
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.company) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};
export default CompanySubscriptionListPage;
