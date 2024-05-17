import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, PaymentState } from '@constants';
import apiConfig from '@constants/apiConfig';
import { salaryPeriodState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { Button, Tag } from 'antd';
import AvatarField from '@components/common/form/AvatarField';
import { FieldTypes } from '@constants/formConfig';
import { render } from '@testing-library/react';
import useMoneyUnit from '@hooks/useMoneyUnit';
import { formatMoney } from '@utils';
const message = defineMessages({
    objectName: 'Chi tiết kỳ lương',
});
const SalaryPeriodDetailListPage = () => {
    const moneyUnit = useMoneyUnit();
    const translate = useTranslate();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const salaryPeriodId = queryParameters.get('salaryPeriodId');
    const stateValues = translate.formatKeys(PaymentState, ['label']);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.salaryPeriodDetail,
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
                    return `${routes.salaryPeriodDetailListPage.path}/create?salaryPeriodId=${salaryPeriodId}`;
                };
                const prepareGetListParams = funcs.prepareGetListParams;
                funcs.prepareGetListParams = (params) => {
                    return {
                        ...prepareGetListParams(params),
                        salaryPeriodId,
                    };
                };
                funcs.changeFilter = (filter) => {
                    const salaryPeriodId = queryParams.get('salaryPeriodId');
                    mixinFuncs.setQueryParams(serializeParams({ salaryPeriodId, ...filter }));
                };
            },
        });

    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
        return convertDateTimeToString(dateConvert, DEFAULT_FORMAT);
    };

    const searchFields = [
        {
            key: 'developerId',
            placeholder: <FormattedMessage defaultMessage={'Tên lập trình viên'} />,
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.developer.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.studentInfo.fullName,
            }),
            searchParams: (text) => ({ name: text }),
        },
        {
            key: 'projectId',
            placeholder: <FormattedMessage defaultMessage={'Tên dự án'} />,
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.project.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.name,
            }),
            searchParams: (text) => ({ name: text }),
        },
    ].filter(Boolean);
    const columns = [
        {
            title: '#',
            dataIndex: ['developer', 'account', 'avatar'],
            align: 'center',
            width: 40,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.developer),
            dataIndex: ['developer', 'account', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.totalTimeWorking),
            dataIndex: 'totalTimeWorking',
            align: 'center',
            width: 130,
            // render(totalTimeWorking) {
            //     if (totalTimeWorking) return <div>{Math.ceil((totalTimeWorking / 60) * 10) / 10} h</div>;
            // },
        },
        {
            title: translate.formatMessage(commonMessage.salary),
            dataIndex: 'fixSalary',
            align: 'center',
            width: 120,
            render: (fixSalary) => {
                const formattedValue = formatMoney(fixSalary ? fixSalary : 0, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.projectSalary),
            dataIndex: 'projectSalary',
            align: 'center',
            render: (projectSalary) => {
                const formattedValue = formatMoney(projectSalary ? projectSalary : 0, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage={'Lương ref'} />,
            dataIndex: 'refSalary',
            align: 'center',
            width: 120,
            render: (refSalary) => {
                const formattedValue = formatMoney(refSalary, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },

        {
            title: translate.formatMessage(commonMessage.totalTimeOff),
            dataIndex: 'totalTimeOff',
            align: 'center',
            width: 120,
            // render(totalTimeOff) {
            //     if (totalTimeOff) return <div>{Math.ceil((totalTimeOff / 60) * 10) / 10} h</div>;
            // },
        },
        {
            title: <FormattedMessage defaultMessage={'Tiền bug'} />,
            dataIndex: 'bugMoney',
            align: 'center',
            width: 120,
            render: (bugMoney) => {
                const formattedValue = formatMoney(bugMoney ? bugMoney : 0, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        // {
        //     title: translate.formatMessage(commonMessage.payoutStatus),
        //     dataIndex: 'payoutStatus',
        //     align: 'center',
        //     width: 120,
        //     render(payoutStatus) {
        //         const state = stateValues.find((item) => item.value == payoutStatus);
        //         return (
        //             <div>
        //                 <Tag color={state?.color}>
        //                     <div style={{ padding: '0 1px', fontSize: 14 }}>
        //                         {state?.label}
        //                     </div>
        //                 </Tag>
        //             </div>
        //         );
        //     },
        // },
        {
            title: <FormattedMessage defaultMessage={'Tổng tiền'} />,
            // dataIndex: 'refSalary',
            align: 'center',
            width: 120,
            render: (record) => {
                console.log(record);
                let sum =
                    (record?.fixSalary ?? 0) +
                    (record?.projectSalary ?? 0) +
                    (record?.refSalary ?? 0) -
                    (record?.bugMoney ?? 0);
                const formattedValue = formatMoney(sum, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        mixinFuncs.renderActionColumn(
            {
                delete: false,
            },
            { width: '120px' },
        ),
    ].filter(Boolean);

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.salaryPeriod),
            path: routes.salaryPeriodListPage.path,
        },
        {
            breadcrumbName: translate.formatMessage(message.objectName),
        },
    ];
    const handleOnClick = (event, record) => {
        navigate(routes.salaryPeriodDetailLogListPage.path + `?salaryPeriodId=${salaryPeriodId}&detailId=${record.id}`);
    };
    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                })}
                // actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                        onRow={(record, rowIndex) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                handleOnClick(e, record);
                            },
                        })}
                    />
                }
            />
        </PageWrapper>
    );
};

export default SalaryPeriodDetailListPage;
