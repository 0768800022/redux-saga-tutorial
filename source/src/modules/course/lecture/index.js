import ListPage from '@components/common/layout/ListPage';
import React, { useState, useEffect } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { PlusOutlined } from '@ant-design/icons';
import routes from '../routes';
import { Button,Modal,Radio }  from 'antd';
import AsignAllForm from './asignAllForm';
import useFetch from '@hooks/useFetch';
import BaseTable from '@components/common/table/BaseTable';
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


    const onSelectChange = (record) => {
        setLectureId(record.id);
    };
    console.log(lectureid);

    const columns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            width : '30px',
            render: (text, record, index) => {
                if (record.lectureKind === 1) {
                    return null; 
                }
                return (
                    <Radio
                        checked={lectureid && lectureid === record.id}
                        onChange={() => onSelectChange(record)}
                    />
                );
            },
        },
        {
            title: translate.formatMessage(message.lectureName),
            dataIndex: 'lectureName',
            render: (lectureName, record) => {
                let styles;
                if (record?.lectureKind === 2) {
                    styles = {
                        paddingLeft: '30px',
                    };
                }
                else {
                    styles = {
                        textTransform: 'uppercase',
                        fontWeight: 700,
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
                style={{ width: '700px' }}
                actionBar={
                    <div style={{ float: 'right', margin: '0 0 32px 0' }}>
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
                    <>
                        <BaseTable
                            // rowSelection={{
                            //     type: "radio",
                            //     ...rowSelection,
                            // }}
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    </>
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
