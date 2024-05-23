import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, BUG_MONEY, DAY_OFF, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, FIXED_SALARY, PaymentState, salaryPeriodKInd, storageKeys } from '@constants';
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
import { formatMoney, moneyTotal, orderNumber, referMoneyTotal, sumMoney } from '@utils';
import { getData } from '@utils/localStorage';
import { getCacheAccessToken } from '@services/userService';
import { showSucsessMessage } from '@services/notifyService';
import { FileExcelOutlined } from '@ant-design/icons';

import axios from 'axios';
const message = defineMessages({
    objectName: 'Chi tiết nhật ký kỳ lương',
});
const SalaryPeriodDetailLogListPage = () => {
    const moneyUnit = useMoneyUnit();
    const translate = useTranslate();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const salaryPeriodId = queryParameters.get('salaryPeriodId');
    const salaryPeriodDetailId = queryParameters.get('detailId');
    const stateValues = translate.formatKeys(salaryPeriodKInd, ['label']);
    const userAccessToken = getCacheAccessToken();
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.salaryPeriodDetailLog,
            options: {
                // pageSize: DEFAULT_TABLE_ITEM_SIZE,
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
                const prepareGetListParams = funcs.prepareGetListParams;
                funcs.prepareGetListParams = (params) => {
                    return {
                        ...prepareGetListParams(params),
                        salaryPeriodId: salaryPeriodDetailId,
                        ignoreKind: 6,
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
            dataIndex: 'index',
            key: 'id',
            render: (text, record, index) => {
                return orderNumber(pagination,index);
            },
            width: 50,
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const modifiedDate = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(
                    7,
                    'hour',
                );
                const modifiedDateTimeString = convertDateTimeToString(modifiedDate, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateTimeString}</div>;
            },
            width: 180,
            align: 'start',
        },
        {
            title: translate.formatMessage(commonMessage.projectName),
            width: 200,
            render: (dataRow) => {
                return (
                    dataRow.kind === 3 ? `Ref: ${dataRow.sourceDevName}` : dataRow.projectName
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.task),
            dataIndex: 'taskName',
        },
        {
            title: translate.formatMessage(commonMessage.kind),
            dataIndex: 'kind',
            align: 'center',
            width: 80,
            render(kind) {
                const state = stateValues.find((item) => item.value == kind);
                return (
                    <div>
                        <Tag color={state?.color}>
                            <div style={{ padding: '0 1px', fontSize: 14 }}>{state?.label}</div>
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.totalTimeWorking),
            dataIndex: 'totalTime',
            align: 'right',
            width: 150,

            render: (record) => {
                if(!record)return <span></span>;

                let result = record / 60;
                let time = result;
                if (result % 1 !== 0) {
                    time = parseFloat(result.toFixed(2));
                } else {
                    time = result.toFixed(0);
                }

                return <span>{time}h</span>;
            },
       
        },
       
        {
            title: translate.formatMessage(commonMessage.salary),
            // dataIndex: 'money',
            align: 'right',
            width: 150,
            render: (dataRow) => {
                var money = dataRow.money;
                if(dataRow?.kind == BUG_MONEY ||dataRow?.kind ==DAY_OFF){
                    money = money *(-1);
                }
                var formattedValue = formatMoney(money, {
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

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.salaryPeriod),
            path: routes.salaryPeriodListPage.path,
        },
        {
            breadcrumbName: <FormattedMessage defaultMessage={'Chi tiết kì lương'} />,
            path: routes.salaryPeriodDetailListPage.path + `?salaryPeriodId=${salaryPeriodId}`,
        },
        {
            breadcrumbName: translate.formatMessage(message.objectName),
        },
    ];
    const formatMoneyValue = (value) => {
        return formatMoney(value ? value : 0, {
            groupSeparator: ',',
            decimalSeparator: '.',
            currentcy: moneyUnit,
            currentDecimal: '2',
        });
    };
    const exportToExcel = (value, nameExcel) => {
        axios({
            url: `${getData(storageKeys.TENANT_API_URL)}/v1/salary-period-detail/export-to-excel/${value}`,
            method: 'GET',
            responseType: 'blob',
            // withCredentials: true,
            headers: {
                Authorization: `Bearer ${userAccessToken}`, // Sử dụng token từ state
            },
        })
            .then((response) => {
                // const fileName="uy_nhiem_chi";
                const date = new Date();

                const excelBlob = new Blob([response.data], {
                    type: response.headers['content-type'],
                });

                const link = document.createElement('a');

                link.href = URL.createObjectURL(excelBlob);
                link.download = `KyLuong_${nameExcel}.xlsx`;
                link.click();
                showSucsessMessage('Tạo tệp ủy nhiệm chi thành công');
            })
            .catch((error) => {
                console.log(error);
                // Xử lý lỗi tải file ở đây
            });
    };
    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'normal' }}>{data?.[0]?.devName} - {data?.[0]?.salaryPeriodDetail.salaryPeriod.name}</span>

                        <div>
                            <span style={{ marginLeft: '5px' }}>
                                {/* Tổng nhận: {moneySum && formatMoneyValue(moneySum[0]?.totalMoneyInput || 0)} */}
                                Tiền giới thiệu: { data ? formatMoneyValue(referMoneyTotal(data)) : formatMoneyValue(0)}
                            </span>
                            <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>| </span>
                            <span style={{ marginLeft: '5px' }}>
                                Tổng tiền: { data ? formatMoneyValue(sumMoney(data)) : formatMoneyValue(0)}
                            </span>
                            <span style={{ marginLeft: '5px' }}>
                                <BaseTooltip title={<FormattedMessage defaultMessage={'Export'}/>}>
                                    <Button
                                    // disabled={state === PAYOUT_PERIOD_STATE_DONE}
                                        type="link"
                                        style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            exportToExcel(salaryPeriodDetailId, data?.[0]?.salaryPeriodDetail.salaryPeriod.name);
                                        }}
                                    >
                                        <FileExcelOutlined  style={{ color:'green' }} size={16}/>
                                    </Button>
                                </BaseTooltip>
                            </span>
                        </div>
                    </div>
                }
                // searchForm={mixinFuncs.renderSearchForm({
                //     fields: searchFields,
                // })}
                // actionBar={mixinFuncs.renderActionBar()}
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

export default SalaryPeriodDetailLogListPage;
