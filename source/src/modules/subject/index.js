import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { generatePath, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { convertUtcToLocalTime } from '@utils';
import routes from './routes';
import classNames from 'classnames';
import styles from './subject.module.scss';
import { statusSubjectOptions } from '@constants/masterData';
const message = defineMessages({
    name: 'Tên môn học',
    home: 'Trang chủ',
    subject: 'Môn học',
    objectName: 'môn học',
    code: 'Mã môn học',
    id: 'Id',
    createdDate: 'Ngày tạo',
    student: 'Học viên',
    status: 'Trạng thái',
});

const SubjectListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate(); 
    const statusSubject = translate.formatKeys(statusSubjectOptions, ['label']);
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
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(`./lecture/${record.id}?subjectName=${record.subjectName}`);
    };

    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'subjectName',
            render: (subjectName, record) =>
                !record.parentId ? (
                    <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                        {subjectName}
                    </div>
                ) : (
                    <div>{subjectName}</div>
                ),
        },
        {
            title: translate.formatMessage(message.code),
            dataIndex: 'subjectCode',
            width: 200,
        },
        {
            title: translate.formatMessage(message.createdDate),
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
            align: 'center',
        },
        {
            title: translate.formatMessage(message.status),
            dataIndex: 'status',
            align: 'center',
            width: 120,
            render(dataRow) {
                const status = statusSubject.find((item) => item.value == dataRow);

                return <Tag color={status.color}>{status.label}</Tag>;
            },
        },

        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    console.log(data);
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
