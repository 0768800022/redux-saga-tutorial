import ListPage from '@components/common/layout/ListPage';
import React, { useEffect } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DATE_DISPLAY_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '@routes';
import route from '@modules/task/routes';
import { convertDateTimeToString } from '@utils/dayHelper';
import { formSize, lectureState, statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import { formatMoney } from '@utils';
import { BaseTooltip } from '@components/common/form/BaseTooltip';

const message = defineMessages({
    name: 'Tên khoá học',
    home: 'Trang chủ',
    subject: 'Môn học',
    objectName: 'course',
    course: 'Khoá học',
    description: 'Mô tả',
    dateRegister: 'Ngày bắt đầu',
    dateEnd: 'Ngày kết thúc',
    state: 'Tình trạng',
    status: 'Trạng thái',
    leader: 'Leader',
    registration: 'Đăng ký',
    task: 'Task',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(lectureState, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const leaderName = queryParameters.get('leaderName');
    const location = useLocation();
    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.course,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.changeFilter = (filter) => {
                    const leaderId = queryParams.get('leaderId');
                    const leaderName = queryParams.get('leaderName');
                    if (leaderId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ leaderId: leaderId, leaderName: leaderName, ...filter }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(serializeParams(filter));
                    }
                };
                funcs.additionalActionColumnButtons = () => ({
                    registration: ({ id, name, state }) => (
                        <BaseTooltip title={translate.formatMessage(message.registration)}>
                            <Button
                                type="link"
                                disabled={state === 1}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    state !== 1 &&
                                        navigate(
                                            routes.registrationListPage.path +
                                                `?courseId=${id}&courseName=${name}&courseState=${state}`,
                                        );
                                }}
                            >
                                <TeamOutlined />
                            </Button>
                        </BaseTooltip>
                    ),

                    task: ({ id, name, subject, state }) => (
                        <BaseTooltip title={translate.formatMessage(message.task)}>
                            <Button
                                disabled={state === 1 || state === 5}
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const path =
                                        (leaderName ? routes.leaderCourseTaskListPage.path : routes.taskListPage.path) +
                                        `?courseId=${id}&courseName=${name}&subjectId=${subject.id}&state=${state}` +
                                        (leaderName ? `&leaderName=${leaderName}` : '');
                                    state !== 1 &&
                                        state !== 5 &&
                                        navigate(path, { state: { pathPrev: location.search } });
                                }}
                            >
                                <BookOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                });
            },
        });
    const breadRoutes = [
        { breadcrumbName: translate.formatMessage(message.home) },

        { breadcrumbName: translate.formatMessage(message.course) },
    ];
    const breadLeaderRoutes = [
        { breadcrumbName: translate.formatMessage(message.home) },
        { breadcrumbName: translate.formatMessage(message.leader), path: routes.leaderListPage.path },
        { breadcrumbName: translate.formatMessage(message.course) },
    ];

    const setSearchField = () => {
        let searchFields = [
            {
                key: 'name',
                placeholder: translate.formatMessage(message.name),
            },
            {
                key: 'state',
                placeholder: translate.formatMessage(message.state),
                type: FieldTypes.SELECT,
                options: stateValues,
            },
        ];
        !leaderName &&
            searchFields.push({
                key: 'status',
                placeholder: translate.formatMessage(message.status),
                type: FieldTypes.SELECT,
                options: statusValues,
            });
        return searchFields;
    };
    const setColumns = () => {
        const columns = [
            {
                title: '#',
                dataIndex: 'avatar',
                align: 'center',
                width: 80,
                render: (avatar) => (
                    <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                    />
                ),
            },
            {
                title: translate.formatMessage(message.name),
                dataIndex: 'name',
                width: 200,
            },
            {
                title: translate.formatMessage(message.subject),
                dataIndex: ['subject', 'subjectName'],
                width: 150,
            },
            {
                title: translate.formatMessage(message.leader),
                dataIndex: ['leader', 'leaderName'],
                width: 80,
            },
            {
                title: <FormattedMessage defaultMessage="Học phí" />,
                dataIndex: 'fee',
                width: '120px',
                render: (fee) => {
                    const formattedValue = formatMoney(fee, {
                        currentcy: 'đ',
                        currentDecimal: '0',
                        groupSeparator: ',',
                    });
                    return <div>{formattedValue}</div>;
                },
            },
            {
                title: <FormattedMessage defaultMessage="Phí hoàn trả" />,
                dataIndex: 'returnFee',
                width: '120px',
                render: (returnFee) => {
                    const formattedValue = formatMoney(returnFee, {
                        currentcy: 'đ',
                        currentDecimal: '0',
                        groupSeparator: ',',
                    });
                    return <div>{formattedValue}</div>;
                },
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
                            {dayjs(dateEnd, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                        </div>
                    );
                },
                width: 130,
                align: 'center',
            },
            {
                title: translate.formatMessage(message.state),
                dataIndex: 'state',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const state = stateValues.find((item) => item.value == dataRow);
                    return (
                        <Tag color={state.color}>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                        </Tag>
                    );
                },
            },
            // {
            //     title: translate.formatMessage(message.status),
            //     dataIndex: 'status',
            //     align: 'center',
            //     width: 120,
            //     render(dataRow) {
            //         console.log(dataRow);
            //         const status = statusValues.find((item) => item.value == dataRow);
            //         return <Tag color={status.color}>{status.label}</Tag>;
            //     },
            // },
        ];
        !leaderName && columns.push(mixinFuncs.renderStatusColumn({ width: '120px' }));
        columns.push(
            mixinFuncs.renderActionColumn(
                {
                    task: true,
                    registration: !leaderName && true,
                    edit: !leaderName && true,
                    delete: !leaderName && true,
                },
                { width: '180px' },
            ),
        );
        return columns;
    };

    return (
        <PageWrapper routes={leaderName ? breadLeaderRoutes : breadRoutes}>
            <ListPage
                title={leaderName && <span style={{ fontWeight: 'normal' }}>{leaderName}</span>}
                searchForm={mixinFuncs.renderSearchForm({ fields: setSearchField(), initialValues: queryFilter })}
                actionBar={!leaderName && mixinFuncs.renderActionBar()}
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
};

export default CourseListPage;
