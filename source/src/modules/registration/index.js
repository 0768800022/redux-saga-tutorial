import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { stateResgistrationOptions, statusOptions } from '@constants/masterData';
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
import { CheckCircleOutlined } from '@ant-design/icons';
import style from './Registration.module.scss';
import ScheduleFile from '@components/common/elements/ScheduleFile';

const message = defineMessages({
    objectName: 'Danh sách đăng kí khóa học',
    studentId: 'Tên sinh viên',
    home: 'Trang chủ',
    courseid: 'courseId',
    createDate: 'Ngày đăng kí',
    isIntern: 'Đăng kí thực tập',
    course: 'Khóa học',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    state: 'Tình trạng',
});

function RegistrationListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const stateRegistration = translate.formatKeys(stateResgistrationOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.registration,
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
                return `${pagePath}/create?courseId=${courseId}&courseName=${courseName}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?courseId=${courseId}&courseName=${courseName}`;
            };
        },
    });
    const setColumns = () => {
        const columns = [
            {
                title: translate.formatMessage(message.studentId),
                dataIndex: ['studentInfo', 'fullName'],
            },
            {
                title: 'Lịch trình',
                dataIndex: 'schedule',
                align: 'center',
                render: (schedule) => {
                    return <ScheduleFile schedule={schedule} />;
                },
                width: 180,
            },
            {
                title: translate.formatMessage(message.isIntern),
                dataIndex: 'isIntern',
                align: 'center',
                width: 150,
                render: (item) => {
                    if (item == 0) {
                        return null;
                    } else {
                        return <CheckCircleOutlined className={style.greenCheckIcon} />;
                    }
                },
            },
            {
                title: translate.formatMessage(message.createDate),
                dataIndex: 'createdDate',
                align: 'center',
                width: 170,
            },
            {
                title: translate.formatMessage(message.state),
                dataIndex: 'state',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const state = stateRegistration.find((item) => item.value == dataRow);
                    return (
                        <Tag color={state.color}>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                        </Tag>
                    );
                },
            },
        ];
        courseStatus == 1 && columns.push(mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: 110 }));
        return columns;
    };

    const searchFields = [
        {
            key: 'id',
            placeholder: translate.formatMessage(message.studentId),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                {
                    breadcrumbName: translate.formatMessage(message.course),
                    path: '/course',
                },
                { breadcrumbName: translate.formatMessage(message.registration) },
            ]}
        >
            <ListPage
                title={
                    <span
                        style={
                            courseState != 5
                                ? { fontWeight: 'normal', fontSize: '16px' }
                                : { fontWeight: 'normal', fontSize: '16px', position: 'absolute' }
                        }
                    >
                        {courseName}
                    </span>
                }
                actionBar={courseState == 5 && courseStatus == 1 && mixinFuncs.renderActionBar()}
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
        </PageWrapper>
    );
}

export default RegistrationListPage;
