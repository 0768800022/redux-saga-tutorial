import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag } from 'antd';
import React from 'react';
import { Link, generatePath, useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';
import { date } from 'yup/lib/locale';

const message = defineMessages({
    objectName: 'registration',
    student: 'Student',
    home: 'Home',
    course: 'Course',
    dateRegister: 'Date Register',
    dateEnd: 'Date End',
    isIntern: 'Is Intern',
    registration: 'Service Registration',
});

function RegistrationListPage() {
    const translate = useTranslate();

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.registration,
        options: {},
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

    const { sortedData, onDragEnd, sortColumn } = useDrapDropTableItem({
        data,
        apiConfig: apiConfig.category.update,
        setTableLoading: () => {},
        indexField: 'rank',
        idField: 'serviceCategoryId',
    });

    const columns = [
        sortColumn,
        {
            title: translate.formatMessage(message.student),
            dataIndex: 'Student',
            align: 'center',
        },
        {
            title: translate.formatMessage(message.dateRegister),
            dataIndex: 'Date Register',
            align: 'center',
            render: (dateRegister) => (
                <Tag color="#108ee9">
                    <div style={{ padding: '5px', fontSize: '16px' }}>{dateRegister}</div>
                </Tag>
            ),
        },
        {
            title: translate.formatMessage(message.dateEnd),
            dataIndex: 'Date End',
            align: 'center',
            render: (dateEnd) => (
                <Tag color="#108ee9">
                    <div style={{ padding: '5px', fontSize: '16px' }}>{dateEnd}</div>
                </Tag>
            ),
        },
        {
            title: translate.formatMessage(message.isIntern),
            dataIndex: 'Is Intern',
            align: 'center',
        },
    ];

    const searchFields = [
        {
            key: 'serviceRegistration',
            placeholder: translate.formatMessage(message.objectName),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.registration) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <DragDropTableV2
                        onDragEnd={onDragEnd}
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={sortedData}
                        columns={columns}
                        // rowKey={(record) => record._id}
                    />
                }
            />
        </PageWrapper>
    );
}

export default RegistrationListPage;
