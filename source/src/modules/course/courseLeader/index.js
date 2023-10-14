import { BookOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DATE_DISPLAY_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { lectureState, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { formatMoney } from '@utils';
import { Button, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

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

const CourseLeaderListPage = () => {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(lectureState, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const leaderName = queryParameters.get('leaderName');
    const location = useLocation();
    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.course.getListLeaderCourse,
                getById: apiConfig.course.getById,
                delete: apiConfig.course.delete,
            },
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
                    registration: ({ id, name, state, status }) => (
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
                                                `?courseId=${id}&courseName=${name}&courseState=${state}&courseStatus=${status}`,
                                        );
                                }}
                            >
                                <TeamOutlined />
                            </Button>
                        </BaseTooltip>
                    ),

                    task: ({ id, name, subject, state, status }) => (
                        <BaseTooltip title={translate.formatMessage(message.task)}>
                            <Button
                                disabled={state === 1 || state === 5}
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const path =
                                        (leaderName ? routes.leaderCourseTaskListPage.path : routes.taskListPage.path) +
                                        `?courseId=${id}&courseName=${name}&subjectId=${subject.id}&state=${state}&courseStatus=${status}` +
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

    const searchFields = [
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
        !leaderName && {
            key: 'status',
            placeholder: translate.formatMessage(message.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ].filter(Boolean);
    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField size="large" icon={<UserOutlined />} src={`${AppConstants.contentRootUrl}${avatar}`} />
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
        // {
        //     title: translate.formatMessage(message.state),
        //     dataIndex: 'state',
        //     align: 'center',
        //     width: 120,
        //     render(dataRow) {
        //         const state = stateValues.find((item) => item.value == dataRow);
        //         return (
        //             <Tag color={state.color}>
        //                 <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
        //             </Tag>
        //         );
        //     },
        // },
        // !leaderName && mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                task: true,
                registration: !leaderName && true,
                edit: !leaderName && true,
                delete: !leaderName && true,
            },
            { width: '180px' },
        ),
    ].filter(Boolean);

    return (
        <PageWrapper routes={leaderName ? breadLeaderRoutes : breadRoutes}>
            <ListPage
                title={leaderName && <span style={{ fontWeight: 'normal' }}>{leaderName}</span>}
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={!leaderName && mixinFuncs.renderActionBar()}
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

export default CourseLeaderListPage;
