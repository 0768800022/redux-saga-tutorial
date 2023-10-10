import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DATE_DISPLAY_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { taskState } from '@constants/masterData';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag } from 'antd';
import React from 'react';
import { Link, generatePath, useLocation, useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';
import { date } from 'yup/lib/locale';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';

const message = defineMessages({
    objectName: 'Danh sách khóa học',
    studentId: 'Tên sinh viên',
    home: 'Trang chủ',
    state: 'Trạng thái',
    task: 'Task',
    course: 'Khóa học',
    leader: 'Leader',
});

function TaskListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const leaderName = queryParameters.get('leaderName');
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const subjectId = queryParameters.get('subjectId');
    const state = queryParameters.get('state');
    const location = useLocation();

    const statusValues = translate.formatKeys(taskState, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.task,
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
            funcs.getCreateLink = () => {
                return `${pagePath}/lecture?courseId=${courseId}&courseName=${courseName}&subjectId=${subjectId}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?courseId=${courseId}&courseName=${courseName}&subjectId=${subjectId}`;
            };
        },
    });
    const setColumns = () => {
        const columns = [
            {
                title: translate.formatMessage(message.task),
                dataIndex: ['lecture', 'lectureName'],
            },
            {
                title: translate.formatMessage(message.studentId),
                dataIndex: ['student', 'fullName'],
            },
            {
                title: 'Ngày bắt đầu',
                dataIndex: 'startDate',
                width: 140,
                render: (startDate) => {
                    return (
                        <div style={{ padding: '0 4px', fontSize: 14 }}>
                            {dayjs(startDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                        </div>
                    );
                },
                align: 'center',
            },
            {
                title: 'Ngày kết thúc',
                dataIndex: 'dueDate',
                width: 140,
                render: (dueDate) => {
                    return (
                        <div style={{ padding: '0 4px', fontSize: 14 }}>
                            {dayjs(dueDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                        </div>
                    );
                },
                align: 'center',
            },
            {
                title: translate.formatMessage(message.state),
                dataIndex: 'state',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const status = statusValues.find((item) => item.value == dataRow);

                    return <Tag color={status.color}>{status.label}</Tag>;
                },
            },
        ];
        if (!leaderName) {
            columns.push(mixinFuncs.renderActionColumn({ edit: true, delete: false }, { width: '120px' }));
        }
        return columns;
    };
    const setBreadRoutes = () => {
        const breadRoutes = [{ breadcrumbName: translate.formatMessage(message.home) }];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.leader),
                path: routes.leaderListPage.path,
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.course),
                path: generatePath(routes.leaderCourseListPage.path + location?.state?.pathPrev),
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.course),
                path: generatePath(routes.courseListPage.path),
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(message.task) });

        return breadRoutes;
    };

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    title={
                        <span
                            style={
                                state != 2 ? { fontWeight: 'normal' } : { fontWeight: 'normal', position: 'absolute' }
                            }
                        >
                            {courseName}
                        </span>
                    }
                    actionBar={state == 2 ? mixinFuncs.renderActionBar() : ''}
                    baseTable={
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={setColumns()}
                        />
                    }
                />
            </div>
        </PageWrapper>
    );
}

export default TaskListPage;
