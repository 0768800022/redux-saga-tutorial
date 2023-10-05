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
import { TeamOutlined, BookOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import routes from '@modules/registration/routes';
import route from '@modules/task/routes';
import { convertDateTimeToString } from '@utils/dayHelper';
import { formSize, lectureState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';

const message = defineMessages({
    name: 'Tên khoá học',
    home: 'Trang chủ',
    subject: 'Môn học',
    objectName: 'course',
    course: 'Khoá học',
    description: 'Mô tả',
    dateRegister: 'Ngày bắt đầu',
    dateEnd: 'Ngày kết thúc',
    status: 'Tình trạng',
    leader: 'Người hướng dẫn',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(lectureState, ['label']);
    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.course,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.additionalActionColumnButtons = () => ({
                student: ({ id, name }) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(routes.registrationListPage.path + `?courseId=${id}&courseName=${name}`);
                        }}
                    >
                        <TeamOutlined />
                    </Button>
                ),
<<<<<<< HEAD
                task: ({ id, name,subject }) => (
=======
                task: ({ id, name, subject }) => (
>>>>>>> son_dev
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
<<<<<<< HEAD
                            navigate(route.taskListPage.path + `?courseId=${id}&courseName=${name}&subjectId=${subject.id}`);
=======
                            navigate(
                                route.taskListPage.path + `?courseId=${id}&courseName=${name}&subjectId=${subject.id}`,
                            );
>>>>>>> son_dev
                        }}
                    >
                        <BookOutlined />
                    </Button>
                ),
            });
        },
    });
    const breadRoutes = [
        { breadcrumbName: translate.formatMessage(message.home) },
        { breadcrumbName: translate.formatMessage(message.course) },
    ];
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
    ];
    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'name',
            width: 250,
        },
        {
            title: translate.formatMessage(message.subject),
            dataIndex: ['subject', 'subjectName'],
            width: 200,
        },
        {
            title: translate.formatMessage(message.leader),
            dataIndex: ['leader', 'leaderName'],
            width: 150,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.dateRegister),
            dataIndex: 'dateRegister',
            render: (dateRegister) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{dateRegister}</div>;
            },
            width: 130,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.dateEnd),
            dataIndex: 'dateEnd',
            render: (dateEnd) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{dateEnd}</div>;
            },
            width: 130,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.status),
            dataIndex: 'state',
            align: 'center',
            width: 250,
            render(dataRow) {
                const status = statusValues.find((item) => item.value == dataRow);

                return <Tag color={status.color}>{status.label}</Tag>;
            },
        },
        mixinFuncs.renderActionColumn({ task: true, student: true, edit: true, delete: true }, { width: '250px' }),
    ];

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

export default CourseListPage;
