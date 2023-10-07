import { SaveOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { lectureKindOptions } from '@constants/masterData';
import useDragDrop from '@hooks/useDragDrop';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { Button } from 'antd';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';
import styles from './lecture.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '@store/actions/app';
import { selectedRowKeySelector } from '@selectors/app';
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
    const dispatch = useDispatch();
    const selectedRowKey = useSelector(selectedRowKeySelector);
    const { data, mixinFuncs, loading, pagination, changePagination, pagePath } = useListBase({
        apiConfig: {
            getList: apiConfig.lecture.getBySubject,
            delete: apiConfig.lecture.delete,
            update: apiConfig.lecture.update,
            getById: apiConfig.lecture.getById,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.getCreateLink = () => {
                return `${pagePath}/create?totalLecture=${data?.length || 0}`;
            };
            funcs.prepareGetListPathParams = () => {
                return {
                    subjectId: paramid.subjectId,
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
    const rowClassNameDefault = (record) => {
        let className = '';
        let lastItem;
        if (record.lectureKind == 1) {
            className += ` ${styles.cursorPoint}`;
        }
        if (record.id === selectedRowKey) {
            className += ` ${styles.highlightRowStyle}`;
            return className;
        } else if (!selectedRowKey) {
            data.map((item) => {
                if (item.lectureKind === 1) {
                    lastItem = item;
                }
            });
            if (lastItem?.id === record.id) {
                className += ` ${styles.highlightRowStyle}`;
            }
        }
        return className;
    };
    const rowClassName = (record) => {
        let className = '';
        if (record.lectureKind == 1) {
            className += ` ${styles.cursorPoint}`;
        }
        if (record?.id == selectedRowKey && record.lectureKind == 1) {
            className += ` ${styles.highlightRowStyle}`;
            return className;
        }
        return className;
    };
    const { sortedData, sortColumn, onDragEnd, handleUpdate } = useDragDrop({
        data,
        apiConfig: apiConfig.lecture.updateSort,
        setTableLoading: () => {},
        indexField: 'ordering',
    });
    const columns = [
        sortColumn,
        {
            title: translate.formatMessage(message.lectureName),
            dataIndex: 'lectureName',

            render: (lectureName, record) => {
                let styles;
                if (record?.lectureKind === 2) {
                    styles = {
                        paddingLeft: '30px',
                    };
                } else {
                    styles = {
                        textTransform: 'uppercase',
                        fontWeight: 700,
                    };
                }

                return <div style={styles}>{lectureName}</div>;
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.subject), path: `/subject` },
                { breadcrumbName: translate.formatMessage(message.objectName) },
            ]}
        >
            <ListPage
                style={{ width: '900px' }}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <>
                        <DragDropTableV2
                            onDragEnd={onDragEnd}
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={sortedData}
                            columns={columns}
                            rowClassName={selectedRowKey !== null ? rowClassName : rowClassNameDefault}
                            onRow={(record) => {
                                if (record.lectureKind === 1) {
                                    return {
                                        onClick: () => {
                                            dispatch(actions.setSelectedRowKey(record.id));
                                        },
                                    };
                                }
                            }}
                        />
                        <Button
                            style={{ marginTop: '20px', marginLeft: '710px' }}
                            key="submit"
                            htmlType="submit"
                            type="primary"
                            onClick={handleUpdate}
                            icon={<SaveOutlined />}
                        >
                            Cập nhật vị trí
                        </Button>
                    </>
                }
            />
        </PageWrapper>
    );
};

export default LectureListPage;
