import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import {  DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { useParams } from 'react-router-dom';
import { lectureKindOptions } from '@constants/masterData';
import { Tag } from 'antd';
const message = defineMessages({
    objectName: 'Bài giảng',
    home: 'Trang chủ',
    student: 'Học viên',
    subject: 'Môn học',
    description: 'Mô tả chi tiết',
    lectureKind: 'Loại bài giảng',
    shortDescription: 'Mô tả Ngắn',
    lectureName: 'Tên bài giảng',
    status: 'Trạng thái',
});

const LectureListPage = () => {

    const translate = useTranslate();
    const paramid = useParams();
    const lectureKindValues = translate.formatKeys(lectureKindOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.lecture.getBySubject,
            delete: apiConfig.lecture.delete,
            update: apiConfig.lecture.update,
            getById:apiConfig.lecture.getById,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareGetListPathParams = () => {
                return {
                    subjectId : paramid.subjectId,
                };
            };
            funcs.mappingData = (response) => {
                console.log(response);
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

    const columns = [
        {
            title: translate.formatMessage(message.lectureName),
            dataIndex: 'lectureName',
        },
        {
            title: translate.formatMessage(message.description),
            dataIndex: 'description',
        },
        {
            title: translate.formatMessage(message.shortDescription),
            dataIndex: 'shortDescription',
        },
        {
            title: translate.formatMessage(message.lectureKind),
            dataIndex: 'lectureKind',
            align: 'center',
            width: 250,
            render(dataRow) {
                const lectureKind = lectureKindValues.find((item) => item.value == dataRow);

                return <Tag color={lectureKind.color}>{lectureKind.label}</Tag>;
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    return (
        <PageWrapper 
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.subject),
                    path: `/subject` },
                { breadcrumbName: translate.formatMessage(message.objectName) },
            ]}
        >
            <ListPage
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

export default LectureListPage;
