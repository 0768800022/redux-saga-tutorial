import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DATE_DISPLAY_FORMAT, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined, BookOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { useNavigate, generatePath, useParams, useLocation } from 'react-router-dom';
import routes from '@modules/registration/routes';
import route from '@modules/task/routes';
import { convertDateTimeToString } from '@utils/dayHelper';
import { formSize, lectureState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import route1 from '@modules/student/routes';
import { DATE_FORMAT_DISPLAY } from '@constants';

const message = defineMessages({
    name: 'Tên khoá học',
    home: 'Trang chủ',
    subject: 'Môn học',
    objectName: 'course',
    course: 'Khoá học',
    description: 'Mô tả',
    dateRegister: 'Ngày bắt đầu',
    dateEnd: 'Ngày kết thúc',
    dateCreated: 'Ngày khởi tạo',
    status: 'Tình trạng',
    leader: 'Người hướng dẫn',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const statusValues = translate.formatKeys(lectureState, ['label']);
    const paramid = useParams();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const stuId = queryParameters.get('studentId');
    const stuName = queryParameters.get('studentName');
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig:
        {
            // getList : apiConfig.student.getAllCourse,
            getList: apiConfig.registration.getList,
            delete: apiConfig.registration.delete,
            update: apiConfig.course.update,
            getById: apiConfig.course.getById,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            // funcs.prepareGetListPathParams = () => {
            //     return {
            //         // id: stuId,
            //         id : paramid.id,
            //     };
            // };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?studentId=${stuId}`;
            };
        },
    });
    const breadRoutes = [
        { breadcrumbName: translate.formatMessage(message.home) },
        {
            breadcrumbName: <FormattedMessage defaultMessage="Sinh viên" />,
            path: generatePath(route1.studentListPage.path),
        },
        { breadcrumbName: translate.formatMessage(message.course) },
    ];
    const searchFields = [
        {
            key: 'courseName',
            placeholder: translate.formatMessage(message.name),
        },
    ];
    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: ['courseInfo', 'name'],
        },
        {
            title: translate.formatMessage(message.subject),
            dataIndex: ['courseInfo', 'subject', 'subjectName'],
            width: 250,
        },
        {
            title: translate.formatMessage(message.dateCreated),
            dataIndex: 'createdDate',
            width: 150,
            render: (createdDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{dayjs(createdDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}</div>;
            },
            align: 'center',
        },
        {
            title: translate.formatMessage(message.status),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const status = statusValues.find((item) => item.value == dataRow);

                return <Tag color={status.color}>{status.label}</Tag>;
            },
        },
        mixinFuncs.renderActionColumn({ delete: true }, { width: '120px' }),
    ];

    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                title={<p style={{ fontSize: '18px' }}>Sinh viên: <span style={{ fontWeight: 'normal' }}>{stuName}</span></p>}
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

export default CourseListPage;