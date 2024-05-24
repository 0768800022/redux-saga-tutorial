import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { convertUtcToLocalTime, formatMoney } from '@utils/index';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import route from '@modules/account/student/routes';
import { useNavigate } from 'react-router-dom';
import { Button, Tag, Avatar } from 'antd';
import { returnFeeOption, stateResgistrationOptions, statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import { AppConstants } from '@constants';
import { CourseIcon } from '@assets/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import useMoneyUnit from '@hooks/useMoneyUnit';

const message = defineMessages({
    objectName: 'Kết quả training',
});

const TrainingResultListPage = () => {
    const translate = useTranslate();
    const moneyUnit = useMoneyUnit();
    const queryParameters = new URLSearchParams(window.location.search);
    const studentId = queryParameters.get('studentId');
    const studentName = queryParameters.get('studentName');
    const returnFeeState = translate.formatKeys(returnFeeOption, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: apiConfig.trainingResult,
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
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    studentId: studentId,
                };
            };
        },
    });

    const columns = [
        
        {
            title: <FormattedMessage defaultMessage="Tổng dự án" />,
            dataIndex: ['totalProject'],
            align: 'center',
            width: 120,
        },
        {
            title: translate.formatMessage(commonMessage.totalTimeWorking),
            dataIndex: 'totalTimeWorking',
            align: 'center',
            width: 140,
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
            title: translate.formatMessage(commonMessage.totalTimeBug),
            dataIndex: 'totalTimeBug',
            align: 'center',
            width: 140,
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
            title: translate.formatMessage(commonMessage.totalAssignedCourseTime),
            dataIndex: 'totalAssignedCourseTime',
            align: 'center',
            width: 140,
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
            title: translate.formatMessage(commonMessage.totalLearnCourseTime),
            dataIndex: 'totalLearnCourseTime',
            align: 'center',
            width: 140,
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
            title: translate.formatMessage(commonMessage.returnFee),
            dataIndex: 'returnFee',
            align: 'center',
            width: 140,
            render(dataRow) {
                const state = returnFeeState.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.totalReturnMoney),
            dataIndex: 'totalReturnMoney',
            align: 'right',
            width: 140,
            render: (totalMoneyReturn) => {
                const formattedValue = formatMoney(totalMoneyReturn, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentcyPosition: 'BACK',
                    currentDecimal: '2',
                });
                return <div>{formattedValue}</div>;
            },
        },
        
        // mixinFuncs.renderStatusColumn({ width: '120px' }),
        // mixinFuncs.renderActionColumn(
        //     // { task: mixinFuncs.hasPermission([apiConfig.registration.getList?.baseURL]), edit: true, delete: true },
        //     { width: '120px' },
        // ),
    ];

 
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.student), path: routes.studentListPage.path },{ breadcrumbName: translate.formatMessage(commonMessage.trainingResult) }]}>
            <ListPage
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'normal' }}>
                            {studentName}
                        </span>
                    </div>
                }
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
export default TrainingResultListPage;
