import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DATE_DISPLAY_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
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
                student: ({ id, name, state }) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                                routes.registrationListPage.path +
                                    `?courseId=${id}&courseName=${name}&courseState=${state}`,
                            );
                        }}
                    >
                        <TeamOutlined />
                    </Button>
                ),

                task: ({ id, name, subject }) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                                route.taskListPage.path + `?courseId=${id}&courseName=${name}&subjectId=${subject.id}`,
                            );
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
            width: 180,
        },
        {
            title: translate.formatMessage(message.subject),
            dataIndex: ['subject', 'subjectName'],
            width: 180,
        },
        {
            title: translate.formatMessage(message.leader),
            dataIndex: ['leader', 'leaderName'],
            width: 180,
        },
        {
            title: translate.formatMessage(message.dateRegister),
            dataIndex: 'dateRegister',
            render: (dateRegister) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(dateRegister, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            width: 130,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.dateEnd),
            dataIndex: 'dateEnd',
            render: (dateEnd) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(dateEnd, 'DD/MM/YYYY HH:MM:SS').format('DD/MM/YYYY')}
                    </div>
                );
            },
            width: 130,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.status),
            dataIndex: 'state',
            align: 'center',
            width: 150,
            render(dataRow) {
                const status = statusValues.find((item) => item.value == dataRow);

                return <Tag color={status.color}>{status.label}</Tag>;
            },
        },
        mixinFuncs.renderActionColumn({ task: true, student: true, edit: true, delete: true }, { width: '150px' }),
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
