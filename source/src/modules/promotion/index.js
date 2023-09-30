import { CheckCircleOutlined, CodeOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import Currency from '@components/common/elements/Currency';
import DateFormat from '@components/common/elements/DateFormat';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import {
    DISCOUNT_TYPE_PERCENT,
    STATE_PROMOTION_CANCEL,
    STATE_PROMOTION_CREATED,
    STATE_PROMOTION_END,
    promotionKindOption,
    statePromotionOptions,
} from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Button, Modal, Tag, Tooltip } from 'antd';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';

const message = defineMessages({
    activePromotionSuccess: 'Active promotion successfully',
    activePromotionFailed: 'Active promotion failed',
    objectName: 'promotion',
    activatedPromotion: 'This promotion has been activated',
    confirmActivePromotion: 'Are you sure to active this promotion?',
    active: 'Active',
    cancel: 'Cancel',
    name: 'Name',
    discountType: 'Discount type',
    discountValue: 'Discount value',
    state: 'State',
    startDate: 'Start date',
    endDate: 'End date',
    home: 'Home',
    promotion: 'Promotion',
    kindPromotion: 'Loại',
});

function PromotionListPage() {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const { execute: executeActivePromotion } = useFetch(apiConfig.promotion.activePromotion);
    const notification = useNotification();
    const kindPromotion = translate.formatKeys(promotionKindOption, ['label']);
    const statePromotion = translate.formatKeys(statePromotionOptions, ['label']);
    const { restaurantId } = useParams();
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.promotion,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.getItemDetailLink = (dataRow) => {
                return generatePath(routes.promotionSavePage.path, { restaurantId, id: dataRow.id });
            };
            funcs.additionalActionColumnButtons = () => {
                return {
                    active: ({ buttonProps, ...dataRow }) => {
                        if (dataRow.state === STATE_PROMOTION_CANCEL) return;
                        return (
                            <span>
                                {dataRow.state === STATE_PROMOTION_CREATED ? (
                                    <Tooltip title="Active">
                                        <Button
                                            type="link"
                                            style={{ padding: 0 }}
                                            onClick={(e) => {
                                                showActiveConfirm(dataRow.id);
                                            }}
                                        >
                                            <CheckCircleOutlined />
                                        </Button>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Code">
                                        <Button
                                            type="link"
                                            style={{ padding: 0 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(
                                                    generatePath(routes.promotionListCode.path, {
                                                        restaurantId,
                                                        id: dataRow.id,
                                                    }),
                                                );
                                            }}
                                        >
                                            <CodeOutlined />
                                        </Button>
                                    </Tooltip>
                                )}
                            </span>
                        );
                    },
                    edit: ({ buttonProps, ...dataRow }) => {
                        return (
                            <Button
                                {...buttonProps}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(mixinFuncs.getItemDetailLink(dataRow), {
                                        state: { action: 'edit', prevPath: location.pathname },
                                    });
                                }}
                                type="link"
                                style={{ padding: 0 }}
                            >
                                {dataRow.state != STATE_PROMOTION_END && dataRow.state != STATE_PROMOTION_CANCEL ? (
                                    <EditOutlined />
                                ) : (
                                    <EyeOutlined />
                                )}
                            </Button>
                        );
                    },
                };
            };
        },
    });

    const handleActive = (id) => {
        executeActivePromotion({
            pathParams: { id },
            onCompleted: (response) => {
                if (response.result === true) {
                    notification({ message: translate.formatMessage(message.activePromotionSuccess) });
                    mixinFuncs.getList();
                } else {
                    notification({
                        type: 'error',
                        message: translate.formatMessage(message.activePromotionFailed),
                    });
                }
            },
            onError: () => {
                notification({
                    type: 'error',
                    message: translate.formatMessage(message.activePromotionFailed),
                });
            },
        });
    };

    const showActiveConfirm = (id) => {
        if (!apiConfig.promotion.activePromotion) throw new Error('promotion active is not defined');

        Modal.confirm({
            title: translate.formatMessage(message.confirmActivePromotion),
            content: '',
            okText: translate.formatMessage(message.active),
            cancelText: translate.formatMessage(message.cancel),
            onOk: () => {
                handleActive(id);
            },
        });
    };

    const columns = [
        { title: translate.formatMessage(message.name), dataIndex: 'name' },
        {
            title: translate.formatMessage(message.kindPromotion),
            dataIndex: 'kindPromotion',
            width: 150,
            align: 'center',
            render(dataRow) {
                const state = kindPromotion.find((item) => item.value == dataRow);

                return <div>{state.label}</div>;
            },
        },
        {
            title: translate.formatMessage(message.discountValue),
            dataIndex: 'discountValue',
            width: 150,
            align: 'center',
            render: (data, dataRow) => {
                if (dataRow.discountType === DISCOUNT_TYPE_PERCENT) return `${data}%`;
                return <Currency value={data} />;
            },
        },

        {
            title: translate.formatMessage(message.startDate),
            dataIndex: 'startDate',
            width: 200,
            align: 'center',
            render: (data, dataRow) => {
                return <DateFormat onlyDate={true}>{data}</DateFormat>;
            },
        },
        {
            title: translate.formatMessage(message.endDate),
            dataIndex: 'endDate',
            width: 200,
            align: 'center',
            render: (data, dataRow) => {
                return <DateFormat onlyDate={true}>{data}</DateFormat>;
            },
        },
        {
            title: translate.formatMessage(message.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = statePromotion.find((item) => item.value == dataRow);

                return <Tag color={state.color}>{state.label}</Tag>;
            },
        },
        mixinFuncs.renderActionColumn({ active: true, edit: true, delete: true }, { width: '150px', align: 'right' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.promotion) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
}

export default PromotionListPage;
