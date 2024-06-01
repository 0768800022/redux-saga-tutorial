import ListPage from '@components/common/layout/ListPage';
import React, { useEffect,useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    AppConstants,
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_DISPLAY,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined, BookOutlined, UserOutlined,CommentOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '@routes';
import route from '@modules/task/routes';
import { convertDateTimeToString } from '@utils/dayHelper';
import { formSize, lectureState, statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import { formatMoney } from '@utils';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import ReviewListModal from '@modules/review/student/ReviewListModal';
import styles from './knowledge.module.scss';
import useMoneyUnit from '@hooks/useMoneyUnit';
import { render } from '@testing-library/react';
const message = defineMessages({
    objectName: 'Khoá học',
});

const KnowledgeListPage = () => {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(lectureState, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const leaderName = queryParameters.get('leaderName');
    const [checkReivew,setCheckReview] = useState(true);
    const [courseId, setCourseId] = useState();
    const moneyUnit = useMoneyUnit();
    const [openReviewModal, handlersReviewModal] = useDisclosure(false);

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
                    review: ({ id, name, subject, state, status,item }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.review)}>
                            <Button
                                type="link"
                                disabled={state !== 3}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    setCourseId(id);
                                    getListReview(id);
                                    getStarReview(id);
                                    e.stopPropagation();
                                    handlersReviewModal.open();
                                }}
                            >
                                <CommentOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                });
            },
        });
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.knowledge) }];
    const breadLeaderRoutes = [
        { breadcrumbName: translate.formatMessage(commonMessage.leader), path: routes.leaderListPage.path },
        { breadcrumbName: translate.formatMessage(commonMessage.knowledge) },
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.courseName),
        },
        // {
        //     key: 'state',
        //     placeholder: translate.formatMessage(commonMessage.state),
        //     type: FieldTypes.SELECT,
        //     options: stateValues,
        // },
        !leaderName && {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
            submitOnChanged: true,
        },
    ].filter(Boolean);


    const { data: dataListReview, loading:dataListLoading, execute: listReview } = useFetch(
        apiConfig.review.listReviews,
        { immediate: false,
            mappingData: ({ data }) => data.content,
        });

    const getListReview = (id) => {
        listReview({
            pathParams: {
                courseId : id,
            },
        });
    };

    const { data: starData,loading:starDataLoading, execute: starReview } = useFetch(
        apiConfig.review.star,
        { immediate: false,
            mappingData: ({ data }) => data.content,
        });

    const getStarReview = (id) => {
        starReview({
            pathParams: {
                courseId : id,
            },
        });
    };
    const { loading:loadingData, execute: myListReview } = useFetch(apiConfig.review.myReview,{ immediate: false });

    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.courseName),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(commonMessage.subjectName),
            // dataIndex: 'name',
            render: (dataRow) => {
                return <Flex vertical>
                    <span>JavaScripts</span>
                    <span style={{ fontSize:12 }}>Leader: {dataRow?.leader?.account?.fullName}</span>
                </Flex>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Học phí" />,
            dataIndex: 'fee',
            width: 150,
            align: 'right',
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
            title: translate.formatMessage(commonMessage.endDate),
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
        //     title: translate.formatMessage(commonMessage.state),
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
        !leaderName && mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
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
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                    className: styles.search,
                })}
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
            <ReviewListModal
                open={openReviewModal}
                onCancel={() => handlersReviewModal.close()}
                data={dataListReview || {}}
                courseId = {courseId}
                checkReivew={checkReivew}
                star = {starData}
                width={800}
                loading={dataListLoading || starDataLoading || loadingData}

            />
        </PageWrapper>
    );
};

export default KnowledgeListPage;
