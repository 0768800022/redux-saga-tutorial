import ListPage from '@components/common/layout/ListPage';
import React, { useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import {  DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { useParams,useNavigate,useSearchParams } from 'react-router-dom';
import {  useLocation } from 'react-router-dom';
import useFetch from '@hooks/useFetch';
import routes from '../routes';
import { Button }  from 'antd';
const message = defineMessages({
    objectName: 'Bài giảng',
    home: 'Trang chủ',
    student: 'Học viên',
    course: 'Khoá học',
    lectureName: 'Tên bài giảng',
    asignAll: 'Áp dụng tất cả',
    task:'Task',
});


const LectureListPage = () => {

    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get("courseId");
    const courseName = queryParameters.get("courseName");
    const { execute: executeAsign } = useFetch(apiConfig.task.asignALl,{ immediate: false });
    const navigate = useNavigate();
    const [lectureid, setLectureId] = useState();

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.lecture,
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

    const columns = [
        {
            title: translate.formatMessage(message.lectureName),
            dataIndex: 'lectureName',
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setLectureId(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.lectureKind === 1,
        }),
    };

    const asignALl = () => {
        executeAsign({
            data:{
                courseId: courseId,
                lectureId: lectureid[0],
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    return navigate(-1);
                }
            },
            onError: (err) => {
                console.log(err);
            },
        });
    };
    return (
        
        <PageWrapper 
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.course) },
                { breadcrumbName: translate.formatMessage(message.task),
                    path: routes.courseListPage.path + `/task?courseId=${courseId}&courseName=${courseName}`,
                },
                { breadcrumbName: translate.formatMessage(message.objectName) },
            ]}
        >
            <ListPage
                actionBar={
                    <div style={{ float: 'right', margin: '32px 0' }}>
                        <Button type="primary" onClick= {asignALl} >{translate.formatMessage(message.asignAll)}</Button>
                    </div>
                }
                baseTable={
                    <BaseTable
                        rowSelection={{
                            type: "radio",
                            ...rowSelection,
                        }}
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
