import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { salaryPeriodState } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Tag } from 'antd';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
const message = defineMessages({
    objectName: 'Đăng ký kỳ lương',
});
const RegisterSalaryPeriodListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const stateValues = translate.formatKeys(salaryPeriodState, ['label']);
 

    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.registerSalaryPeriod,
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
                 
                });
            },
        });

    const convertDate = (date, format = DEFAULT_FORMAT, addHour = 0) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT).add(addHour, 'hour');
        return convertDateTimeToString(dateConvert, format);
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.salaryPeriodName),
        },
    ].filter(Boolean);
    const handleOnClick = (event, record) => {
        // event.preventDefault();
        navigate(routes.salaryPeriodDetailListPage.path + `?salaryPeriodId=${record.id}`);
        // console.log(record);
    };

    const columns = [
        {
            title: translate.formatMessage(commonMessage.projectName),
            dataIndex: ["project","name"],
            width: 300,
           
        },
        {
            title: translate.formatMessage(commonMessage.dueDate),
            dataIndex: 'dueDate',
            render: (startDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate, DATE_FORMAT_DISPLAY)}</div>
                );
            },
            width: 180,
            align: 'center',
        },
        // {
        //     title: translate.formatMessage(commonMessage.endDate),
        //     dataIndex: 'end',
        //     render: (endDate) => {
        //         return (
        //             <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate, DATE_FORMAT_DISPLAY)}</div>
        //         );
        //     },
        //     width: 180,
        //     align: 'center',
        // },
        // {
        //     title: translate.formatMessage(commonMessage.createdDate),
        //     dataIndex: 'createdDate',
        //     render: (createdDate) => {
        //         return (
        //             <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(createdDate, DEFAULT_FORMAT, 7)}</div>
        //         );
        //     },
        //     width: 180,
        //     align: 'center',
        // },
     
      
        mixinFuncs.renderActionColumn(
            {
                edit: false,
                delete: false,
            },
            { width: '100px' },
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
                    fields: searchFields,
                    initialValues: queryFilter,
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
                                handleOnClick(e,record);
                            },
                        })}
                    />
                }
            />
        </PageWrapper>
    );
};

export default RegisterSalaryPeriodListPage;
