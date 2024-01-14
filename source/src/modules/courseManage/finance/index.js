import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { formatMoney } from '@utils';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
const message = defineMessages({
    objectName: 'Tài chính',
});

const FinanceListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValue = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: { getList: apiConfig.registrationMoney.getSum },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
        },
    });
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.finance) }];
    const searchFields = [
        {
            key: 'studentId',
            placeholder: translate.formatMessage(commonMessage.studentName),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.student.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.fullName,
            }),
            searchParams: (text) => ({ name: text }),
            colSpan: 5,
        },
        {
            key: 'courseId',
            placeholder: translate.formatMessage(commonMessage.courseName),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.course.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.name,
            }),
            searchParams: (text) => ({ name: text }),
            colSpan: 6,
        },
    ];

    const columns = [
        {
            title: '#',
            dataIndex: 'studentAvatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.studentName),
            dataIndex: 'studentName',
        },
        {
            title: translate.formatMessage(commonMessage.moneyReceived),
            dataIndex: 'totalMoneyInput',
            render: (totalMoneyInput) => {
                const formattedValue = formatMoney(totalMoneyInput, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
            align: 'right',
        },
        {
            title: translate.formatMessage(commonMessage.moneyReturn),
            dataIndex: 'totalMoneyReturn',
            render: (totalMoneyReturn) => {
                const formattedValue = formatMoney(totalMoneyReturn, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
            align: 'right',
        },
    ];
    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields })}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
        </PageWrapper>
    );
};

export default FinanceListPage;
