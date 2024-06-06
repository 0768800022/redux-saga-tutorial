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
import styles from './index.module.scss';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { Button, Tag, Tooltip } from 'antd';
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
                label: item.account.fullName,
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
            width: 100,
            render: (dataRow) => {
                let result = dataRow / 60;
                if (result % 1 !== 0) {
                    return <span>{parseFloat(result.toFixed(2))}h</span>;
                } else {
                    return <span>{result.toFixed(0)}h</span>;
                }
            },
        },
        {
            title: translate.formatMessage(commonMessage.salary),
            dataIndex: 'fixSalary',
            align: 'right',
            width: 100,
            render: (fixSalary) => {
                const formattedValue = formatMoney(fixSalary ? fixSalary : 0, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '2',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.projectSalary),
            // dataIndex: 'projectSalary',
            align: 'right',
            width: 120,
            render: (dataRow) => {
                let result = dataRow.totalTimeProjectIsPaid / 60;
                let timeOff = result;
                if (result % 1 !== 0) {
                    timeOff = parseFloat(result.toFixed(2));
                } else {
                    timeOff = result.toFixed(0);
                }

                const format = ( money ) => {
                    return  formatMoney(money ? money : 0, {
                        groupSeparator: ',',
                        decimalSeparator: '.',
                        currentcy: moneyUnit,
                        currentDecimal: '2',
                    });
                };

                const formattedValue = format(dataRow?.projectSalary);
                const formattedMoneyProject = format(dataRow?.hourlySalary);
                return <Tooltip placement='bottom' title={`Tổng giờ làm: ${timeOff}h | Lương một giờ: ${formattedMoneyProject}`}>{formattedValue}</Tooltip>;
            },
        },
        {
            title: <FormattedMessage defaultMessage={'Lương ref'} />,
            dataIndex: 'refSalary',
            align: 'right',
            width: 140,
            render: (refSalary) => {
                const formattedValue = formatMoney(refSalary, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '2',
                });
                return <div>{formattedValue}</div>;
            },
        },

        {
            title: translate.formatMessage(commonMessage.totalTimeOff),
            // dataIndex: 'totalTimeOff',
            align: 'right',
            width: 140,
            render: (dataRow) => {
                let result = dataRow.totalTimeOff / 60;
                let timeOff = result;
                if (result % 1 !== 0) {
                    timeOff = parseFloat(result.toFixed(2));
                } else {
                    timeOff = result.toFixed(0);
                }
                const formattedValue = formatMoney(dataRow?.dayOffSalary ? dataRow.dayOffSalary*(-1) : 0, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '2',
                });
                return <Tooltip title={`Số giờ nghỉ: ${timeOff}h`} placement='bottom'>
                    {formattedValue}
                </Tooltip>;
            },
        },
        {
            title: <span style={{ color:'red' }}><FormattedMessage defaultMessage={'Tiền phạt bug'} /></span>,
            // dataIndex: 'bugMoney',
            align: 'right',
            width: 140,
            render: (dataRow) => {
                let result = dataRow.totalTimeBug / 60;
                let timeOff = result;
                if (result % 1 !== 0) {
                    timeOff = parseFloat(result.toFixed(2));
                } else {
                    timeOff = result.toFixed(0);
                }

                const formattedValue = formatMoney(dataRow?.bugMoney ? dataRow.bugMoney*(-1) : 0, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '2',
                });

                
                return <Tooltip title={`Tổng số giờ: ${timeOff}h`} placement='bottom'>{formattedValue}</Tooltip>;
            },
        },
        {
            title: <FormattedMessage defaultMessage={'Tổng tiền'} />,
            align: 'right',
            width: 140,
            render: (dataRow) => {
                const totalSalary = sumMoneyItem(dataRow);
                // const hoursPerDay = 8;
                // const workingDaysPerMonth = 24;
                // const _totalTimeOff = dataRow.totalTimeOff / 60; //Đổi ra giờ
                // const totalDayOff = _totalTimeOff / hoursPerDay; // Số ngày nghỉ = _totalTimeOff / 8
                
                // const totalDayWorking = workingDaysPerMonth - totalDayOff; //Số ngày làm việc = 24 - só ngày nghỉ
                // //Tổng tiền = (lương cứng * (số ngày làm việc / 24)  + lương dự án + lương refer) - lương bug
                
                // const fixedSalaryProportion = dataRow.fixSalary * (totalDayWorking / workingDaysPerMonth);
                // const totalSalary = Number(fixedSalaryProportion.toFixed(2)) + Number(dataRow.projectSalary.toFixed(2)) + Number(dataRow.refSalary.toFixed(2)) - Number(dataRow.bugMoney.toFixed(2));

                const formattedValue = formatMoney(totalSalary||0, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '2',
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

    const sumMoneyItem = (data) => {
        const hoursPerDay = 8;
        const workingDaysPerMonth = 24;
        const _totalTimeOff = data.totalTimeOff / 60; //Đổi ra giờ
        const totalDayOff = _totalTimeOff / hoursPerDay; // Số ngày nghỉ = _totalTimeOff / 8
        const totalDayWorking = workingDaysPerMonth - totalDayOff; //Số ngày làm việc = 24 - só ngày nghỉ
        //Tổng tiền = (lương cứng * (số ngày làm việc / 24)  + lương dự án + lương refer) - lương bug
        const fixedSalaryProportion = data.fixSalary * (totalDayWorking / workingDaysPerMonth);
        const totalSalary = Number(fixedSalaryProportion.toFixed(2)) + Number(data.projectSalary.toFixed(2)) + Number(data.refSalary.toFixed(2)) - Number(data.bugMoney.toFixed(2));
        return totalSalary;
    };

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

    const formatMoneyValue = (value) => {
        return formatMoney(value ? value : 0, {
            groupSeparator: ',',
            decimalSeparator: '.',
            currentcy: moneyUnit,
            currentDecimal: '2',
        });
    };

    const sumMoney = (data) => {
        const totalAmount = data?.reduce((accumulator, item) => {
            return accumulator + sumMoneyItem(item);
        }, 0);

        return totalAmount;
    };

    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                })}
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }} className={styles.title}>
                        <div></div>
                        <div>
                            <span style={{ marginLeft: '5px' }}>
                                Tổng tiền: { data ? formatMoneyValue(sumMoney(data)) : formatMoneyValue(0)}
                            </span>
                        </div>
                    </div>
                }
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
