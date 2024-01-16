import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { FileSearchOutlined } from '@ant-design/icons';
import { DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { salaryPeriodState, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styles from './salaryPeriod.module.scss';

import useNotification from '@hooks/useNotification';
import { Button, Tag } from 'antd';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
const message = defineMessages({
    objectName: 'Kỳ lương',
});
const SalaryPeriodListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const stateValues = translate.formatKeys(salaryPeriodState, ['label']);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.salaryPeriod,
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
                    detail: ({ id }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.detail)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(routes.salaryPeriodDetailListPage.path + `?salaryPeriodId=${id}`);
                                }}
                            >
                                <FileSearchOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                });
            },
        });

    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
        return convertDateTimeToString(dateConvert, DEFAULT_FORMAT);
    };

    // const searchFields = [
    //     {
    //         key: 'name',
    //         placeholder: translate.formatMessage(commonMessage.projectName),
    //     },
    // ].filter(Boolean);
    const handleOnClick = (event, record) => {
        event.preventDefault();
        localStorage.setItem(routes.projectTabPage.keyActiveTab, translate.formatMessage(commonMessage.task));
        navigate(
            routes.projectTabPage.path +
                `?projectId=${record.id}&projectName=${record.name}&active=${!!record.status == 1}`,
        );
    };
    const columns = [
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'start',
            render: (startDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
            },
            width: 180,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'end',
            render: (endDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
            },
            width: 180,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(createdDate)}</div>;
            },
            width: 180,
            align: 'center',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                detail: true,
                edit: true,
                delete: true,
            },
            { width: '90px' },
        ),
    ].filter(Boolean);

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(message.objectName),
        },
    ];
    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    // fields: searchFields,
                    initialValues: queryFilter,
                })}
                actionBar={mixinFuncs.renderActionBar()}
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

export default SalaryPeriodListPage;
