import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { generatePath, useNavigate } from 'react-router-dom';

const message = defineMessages({
    name: 'Tên môn học',
    home: 'Trang chủ',
    subject: 'Môn học',
    objectName: 'môn học',
    code: 'Mã môn học',
    id: 'Id',
    createdDate: 'Ngày tạo',
    student: 'Học viên',
});

const SubjectListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.subject,
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
    const breadRoutes = [
        { breadcrumbName: translate.formatMessage(message.home) },
        { breadcrumbName: translate.formatMessage(message.subject) },
    ];
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
    ];
    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'subjectName',
        },
        {
            title: translate.formatMessage(message.code),
            dataIndex: 'subjectCode',
            width: 200,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const modifiedDate = dayjs(createdDate, 'DD/MM/YYYY HH:mm:ss').add(7, 'hour');
                const modifiedDateTimeString = modifiedDate.format('DD/MM/YYYY HH:mm:ss');

                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateTimeString}</div>;
            },
            width: 200,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.student),
            dataIndex: 'id',
            render: (id) => {
                return (
                    <Button>
                        <TeamOutlined />
                    </Button>
                );
            },
            width: 200,
            align: 'center',
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
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

export default SubjectListPage;
