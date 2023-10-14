import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants/index';
import { Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DATE_DISPLAY_FORMAT, DEFAULT_FORMAT } from '@constants';
import { formatMoney } from '@utils/index';
import { statusOptions } from '@constants/masterData';
import AvatarField from '@components/common/form/AvatarField';

const message = defineMessages({
    objectName: 'dịch vụ',
    home: 'Trang chủ',
    companyName: 'Tên công ty',
    startDate: 'Ngày bắt đầu',
    endDate: 'Ngày kết thúc',
    company: 'Công ty',
    companySubscription: 'Gói dịch vụ',
    status: 'Trạng thái',
    subscriptionName: 'Tên đăng ký',
    price: 'Giá',
});

const CompanySubscriptionIdListPage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const companyId = queryParameters.get('companyId');
    const companyName = queryParameters.get('companyName');

    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFiter, pagePath } = useListBase({
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
                return `${pagePath}/create?companyId=${companyId}&companyName=${companyName}`;
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
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={logo ? `${AppConstants.contentRootUrl}${logo}` : null}
                />
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Gói dịch vụ" />,
            dataIndex: ['subscription', 'name'],
        },
        {
            title: <FormattedMessage defaultMessage="Giá dịch vụ" />,
            dataIndex: 'money',
            width: 150,
            render: (money) => {
                const formattedValue = formatMoney(money, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentcyPosition: 'BACK',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Giảm giá" />,
            align: 'center',
            width: 130,
            dataIndex: 'saleOff',
            render: (saleOff) => {
                if (saleOff > 0) {
                    return <div>{saleOff} %</div>;
                } else return <div>{saleOff}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Tiền thanh toán" />,
            dataIndex: 'totalAmount',
            width: 150,
            render: (text, record) => {
                const totalPrice = record.money;
                const saleOff = record.saleOff;
                if (saleOff) {
                    var totalAmount = totalPrice - totalPrice * (saleOff / 100);
                } else totalAmount = totalPrice;
                const formattedValue = formatMoney(totalAmount, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });

                return <div>{formattedValue}</div>;
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 180,
            render: (startDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(startDate, DATE_DISPLAY_FORMAT).format(DEFAULT_FORMAT)}
                    </div>
                );
            },
            align: 'center',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            width: 180,
            render: (endDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(endDate, DATE_DISPLAY_FORMAT).format(DEFAULT_FORMAT)}
                    </div>
                );
            },
            align: 'center',
        },
        // {
        //     title: translate.formatMessage(message.status),
        //     dataIndex: 'status',
        //     align: 'center',
        //     width: 120,
        //     render(dataRow) {
        //         const status = statusValues.find((item) => item.value == dataRow);
        //         return <Tag color={status.color}>{status.label}</Tag>;
        //     },
        // },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.company), path: `/company` },
                { breadcrumbName: translate.formatMessage(message.companySubscription) },
            ]}
        >
            <ListPage
                title={
                    <span style={{ fontWeight: 'normal', position: 'absolute', fontSize: '16px' }}>{companyName}</span>
                }
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
export default CompanySubscriptionIdListPage;
