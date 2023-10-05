import ListPage from '@components/common/layout/ListPage';
import React, { useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import {  DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { PlusOutlined } from '@ant-design/icons';
import routes from '../routes';
import { Button,Modal }  from 'antd';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import AsignAllForm from './asignAllForm';

const message = defineMessages({
    objectName: 'Bài giảng',
    home: 'Trang chủ',
    student: 'Học viên',
    course: 'Khoá học',
    lectureName: 'Tên bài giảng',
    asignAll: 'Áp dụng tất cả',
    task:'Task',
    asignAllModal: 'Tạo task',
});
const LectureListPage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get("courseId");
    const courseName = queryParameters.get("courseName");
    const subjectId = queryParameters.get("subjectId");
    const [ showPreviewModal, setShowPreviewModal ] = useState(false);

    const [lectureid, setLectureId] = useState(null);

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.lecture.getBySubject,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareGetListPathParams = () => {
                return {
                    subjectId: subjectId,
                };
            };
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
        apiConfig: apiConfig.lecture.update,
        setTableLoading: () => {},
        indexField: 'ordering',
        idField: 'lectureId',
        getList: mixinFuncs.getList,
    });

    const columns = [
        sortColumn,
        {
            title: translate.formatMessage(message.lectureName),
            dataIndex: 'lectureName',
            render: (lectureName, record) => {
                let styles;
                if (record?.lectureKind === 1) {
                    styles = {
                        paddingLeft: '30px',
                    };
                }
                return <div style={styles}>{lectureName}</div>;
            },
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setLectureId(selectedRowKeys[0]);
        },
        getCheckboxProps: (record) => ({
            disabled: record.lectureKind === 1,
        }),
    };

    const disabledSubmit = lectureid === null;


    return (
        
        <PageWrapper 
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.course) },
                { breadcrumbName: translate.formatMessage(message.task),
                    path: routes.courseListPage.path + `/task?courseId=${courseId}&courseName=${courseName}&subjectId=${subjectId}`,
                },
                { breadcrumbName: translate.formatMessage(message.objectName) },
            ]}
        >
            <ListPage
                actionBar={
                    <div style={{ float: 'right', margin: '32px 0' }}>
                        <Button 
                            type="primary" 
                            disabled={disabledSubmit}   
                            onClick={() => setShowPreviewModal(true)} >
                            <PlusOutlined />
                            {translate.formatMessage(message.asignAll)}
                        </Button>
                    </div>
                }
                baseTable={
                    <DragDropTableV2
                        rowSelection={{
                            type: "radio",
                            ...rowSelection,
                        }}
                        onDragEnd={onDragEnd}
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={sortedData}
                        columns={columns}
                    />
                }
            />
            <Modal
                title={translate.formatMessage(message.asignAllModal)}
                width={600}
                open={showPreviewModal}
                footer={null}
                centered
                lectureId = {lectureid}
                onCancel={() => setShowPreviewModal(false)}
            >
                <AsignAllForm
                    courseId = {courseId}
                    lectureId = {lectureid}
                />
            </Modal>
        </PageWrapper>
    );
};

export default LectureListPage;
