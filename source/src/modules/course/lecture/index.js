import ListPage from '@components/common/layout/ListPage';
import React, { useState, useEffect } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { CheckCircleOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';
import routes from '../routes';
import { Button,Modal,Radio,Checkbox }  from 'antd';
import AsignAllForm from './asignAllForm';
import useFetch from '@hooks/useFetch';
import BaseTable from '@components/common/table/BaseTable';
import useDragDrop from '@hooks/useDragDrop';
import styles from './AsignAll.module.scss';
const message = defineMessages({
    objectName: 'Bài giảng',
    home: 'Trang chủ',
    student: 'Học viên',
    course: 'Khoá học',
    lectureName: 'Tên bài giảng',
    asignAll: 'Tạo task',
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
    const [checkAsign, SetCheckAsign] = useState([]);

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

    const { sortedData } = useDragDrop({
        data,
        apiConfig: apiConfig.lecture.updateSort,
        setTableLoading: () => {},
        indexField: 'ordering',
    });

    const columns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            width : '30px',
            render: (text, record, index) => {
                const checkAsignItem = checkAsign.find(item => item.id === record.id);
                const isDisabled = checkAsignItem ? checkAsignItem.status : false;
                if (record.lectureKind === 1 || isDisabled) {
                    return null; 
                }
                else{
                    return (
                        <Radio
                            checked={lectureid && lectureid === record.id}
                            onChange={() => onSelectChange(record)}
                        />
                    );
                }
                
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
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            width : '30px',
            render: (text, record, index) => {
                const checkAsignItem = checkAsign.find(item => item.id === record.id);
                const isDisabled = checkAsignItem ? checkAsignItem.status : false;
                if (record.lectureKind === 1) {
                    return null; 
                }
                else if(isDisabled){
                    return (
                        <CheckCircleOutlined className={styles.greenCheckIcon}/>
                    );
                }
        
            },
        },
    ];


    const disabledSubmit = lectureid === null;

    const { execute: executeCheckAsign } = useFetch(apiConfig.task.checkAsign,{ immediate: false });
    useEffect(() => {
        if (data.length > 0) {
            const ids = data.map(item => item.id);
            if (ids.length > 0) {
                executeCheckAsign({
                    data: {
                        courseId: courseId,
                        lectureIds: ids,
                    },
                    onCompleted: (response) => {
                        if (response.result === true) {
                            SetCheckAsign(response.data);
                        }
                    },
                    onError: (err) => {
                    },
                });
            }
        }
    }, [data, executeCheckAsign]);
    
    const rowClassName = (record) => {
        const checkAsignItem = checkAsign.find(item => item.id === record.id);
        const isDisabled = checkAsignItem ? checkAsignItem.status : false;
        if (isDisabled) {
            return styles.customRow;
        }   
        return '';
    };
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
                style={{ width: '50vw' }}
                actionBar={
                    <div style={{ float: 'right', margin: '0 0 32px 0' }}>
                        <Button 
                            type="primary" 
                            disabled={disabledSubmit}   
                            onClick={() => setShowPreviewModal(true)} >
                            {translate.formatMessage(message.asignAll)}
                        </Button>
                    </div>
                }
                baseTable={
                    <>
                        <BaseTable
                            rowClassName={rowClassName}
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={sortedData}
                            columns={columns}
                            onRow={(record) => ({
                                onClick: () => {
                                    if (record.lectureKind === 2) {
                                        onSelectChange(record);
                                    }
                                },
                            })}
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
