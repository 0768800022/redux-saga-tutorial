import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants/index';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button } from 'antd';
import { UserOutlined,ShoppingCartOutlined } from '@ant-design/icons';
import routes from '@modules/companySubscription/routes';

const message = defineMessages({
    objectName: 'Company',
    home: 'Trang chủ',
    companyName: 'Tên công ty',
    address: 'Địa chỉ',
    createdDate: 'Ngày tạo',
    modifiedDate: 'Ngày sửa đổi',
    email: 'Email',
    holine: 'Holine',
    logo: 'Logo',
    status: 'status',
    username: 'Tài khoản đăng nhập',
    company: 'Công ty',
});

const CompanyListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.company,
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
            funcs.additionalActionColumnButtons = () => ({
                registration: ({ id }) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                                routes.companySubscriptionListPage.path +
                                    `?companyId=${id}`,
                            );
                        }}
                    >
                        <ShoppingCartOutlined />
                    </Button>
                ),
            });
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: 'logo',
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
            dataIndex: 'companyName',
        },
        {
            title: <FormattedMessage defaultMessage="Địa chỉ" />,
            dataIndex: 'address',
        },
        {
            title: <FormattedMessage defaultMessage="Hotline" />,
            dataIndex: 'hotline',
        },
        {
            title: <FormattedMessage defaultMessage="Email" />,
            dataIndex: 'email',
        },
        mixinFuncs.renderActionColumn({ registration:true, edit: true, delete: true }, { width: '150px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.companyName),
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
export default CompanyListPage;
