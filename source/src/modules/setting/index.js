import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect } from 'react';
import GeneralSettingForm from './GeneralSettingForm';
import { generatePath, useParams } from 'react-router-dom';
import useFetch from '@hooks/useFetch';
import { parseJson } from '@utils';
import routes from './routes';
import { useCurrency } from '@components/common/elements/Currency';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { daysOfWeekTimeWork } from '@constants/masterData';
import { DEFAULT_TIME, TIME_FORMAT_DISPLAY } from '@constants';
import dayjs from 'dayjs';
import { Card, Tabs } from 'antd';
import OrderSettingForm from './OrderSettingForm';

const messages = defineMessages({
    home: 'Trang chủ',
    objectName: 'cài đặt',
    generalSetting: 'Cài đặt chung',
    orderSetting: 'Cài đặt đơn hàng',
    setting: 'Cài đặt',
});

const SettingPage = () => {
    const { restaurantId } = useParams();
    const { fetchCurrency } = useCurrency();
    const translate = useTranslate();

    const { data: generalDetail, loading: loadingGetGeneral } = useFetch(apiConfig.restaurant.getById, {
        immediate: true,
        pathParams: { id: restaurantId },
        mappingData: (res) => ({
            ...res.data,
            settings: parseJson(res.data.settings),
            ...parseJson(res.data.settings),
            accountDto: null,
            // timezone: parseJson(res.data.settings).timezone.name,
        }),
    });

    const {
        mixinFuncs: mixinFuncsGeneral,
        loading: loadingGeneral,
        onSave: onSaveGeneral,
        setIsChangedFormValues: setIsChangedFormValuesGeneral,
        isEditing: isEditingGeneral,
        title: titleGeneral,
        setDetailId: setDetailIdGeneral,
        setSubmit: setSubmitGeneral,
        loadingUpdate: loadingUpdateGeneral,
    } = useSaveBase({
        apiConfig: {
            update: apiConfig.restaurant.updateByClient,
        },
        options: {
            objectName: translate.formatMessage(messages.objectName),
            getListUrl: generatePath(routes.settingPage.path, { restaurantId }),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...generalDetail,
                    ...data,
                    settings: JSON.stringify({
                        ...generalDetail.settings,
                        store_info: data?.store_info,
                        date_time_format: data.date_time_format,
                        email_shop: data.email_shop,
                        timezone: data.timezone,
                        group_separator: data.group_separator,
                        decimal_separator: data.decimal_separator,
                        currentcy_position: data.currentcy_position,
                        currency_ratio:data.currency_ratio,
                        currentcy: data.currentcy,
                        decimal_round: data.decimal_round,
                    }),
                };
            };
            funcs.prepareCreateData = (data) => {
                return {};
            };
            funcs.onSaveCompleted = (responseData) => {
                setSubmitGeneral(false);
                if (responseData?.data?.errors?.length) {
                    mixinFuncsGeneral.onSaveError();
                } else {
                    if (isEditingGeneral) {
                        mixinFuncsGeneral.onUpdateCompleted(responseData);
                    } else {
                        mixinFuncsGeneral.onInsertCompleted(responseData);
                    }
                }
                fetchCurrency({ pathParams: { id: generalDetail?.id } });
            };
        },
    });

    const { data: orderDetail, loading: loadingGetOrder } = useFetch(apiConfig.restaurant.getById, {
        immediate: true,
        pathParams: { id: restaurantId },
        mappingData: ({ data }) => {
            try {
                let settings = parseJson(data?.settings) || {};
                if (!settings.time_work) settings.time_work = {};
                const { ...rest } = settings.time_work;
                settings.time_work = {
                    ...getTimeWorkTabletRandomData(Object.values(rest).length ? rest : ''),
                };
                return {
                    ...data,
                    settings,
                    ...settings,
                    paymentDeliver: settings?.paymentDeliver?.map((pmt) => pmt.code),
                };
            } catch (error) {
                console.log(error);
            }
        },
    });

    const {
        mixinFuncs: mixinFuncsOrder,
        loading: loadingOrder,
        onSave: onSaveOrder,
        setIsChangedFormValues: setIsChangedFormValuesOrder,
        isEditing: isEditingOrder,
        title: titleOrder,
        setDetailId: setDetailIdOrder,
        loadingUpdate: loadingUpdateOrder,
    } = useSaveBase({
        apiConfig: {
            update: apiConfig.restaurant.updateByClient,
        },
        options: {
            objectName: translate.formatMessage(messages.objectName),
            getListUrl: generatePath(routes.settingPage.path, { restaurantId }),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                const timeWorkObj = {};
                Object.keys(data.time_work).forEach((timeWorkKey) => {
                    timeWorkObj[timeWorkKey] = data.time_work[timeWorkKey].map(
                        (timeWorkItem) => `${timeWorkItem.from.format('HH:mm')}-${timeWorkItem.to.format('HH:mm')}`,
                    );
                });
                return {
                    ...orderDetail,
                    ...data,
                    settings: JSON.stringify({
                        ...orderDetail.settings,
                        payment_deliver_method: data.payment_deliver_method.map((pmt) => ({ code: pmt })),
                        payment_method: data.payment_method.map((pmt) => ({ code: pmt })),
                        time_work: {
                            ...timeWorkObj,
                        },
                    }),
                    accountDto: null,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {};
            };
            funcs.getFormId = () => {
                return `form-order-setting`;
            };
        },
    });

    const getTimeWorkTabletRandomData = (timeWork) => {
        let timeWorkData = {};
        if (timeWork) {
            daysOfWeekTimeWork.forEach((day) => {
                timeWorkData[day.value] = timeWork[day.value].map((timeWorkItem) => {
                    const timeWorkStr = timeWorkItem.split('-');
                    return {
                        from: dayjs(timeWorkStr[0], TIME_FORMAT_DISPLAY),
                        to: dayjs(timeWorkStr[1], TIME_FORMAT_DISPLAY),
                    };
                });
            });
        } else {
            daysOfWeekTimeWork.forEach((day) => {
                timeWorkData[day.value] = [
                    { from: dayjs(DEFAULT_TIME, TIME_FORMAT_DISPLAY), to: dayjs(DEFAULT_TIME, TIME_FORMAT_DISPLAY) },
                    { from: dayjs(DEFAULT_TIME, TIME_FORMAT_DISPLAY), to: dayjs(DEFAULT_TIME, TIME_FORMAT_DISPLAY) },
                ];
            });
        }
        return timeWorkData;
    };

    return (
        <PageWrapper
            loading={loadingUpdateGeneral || loadingUpdateOrder || loadingGetGeneral || loadingGetOrder}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                { breadcrumbName: translate.formatMessage(messages.setting) },
            ]}
        >
            <Card className="card-form" bordered={false}>
                <Tabs
                    type="card"
                    items={[
                        {
                            key: 'general',
                            label: translate.formatMessage(messages.generalSetting),
                            children: (
                                <GeneralSettingForm
                                    setIsChangedFormValues={setIsChangedFormValuesGeneral}
                                    dataDetail={generalDetail ? generalDetail : {}}
                                    formId={mixinFuncsGeneral.getFormId()}
                                    isEditing={isEditingGeneral}
                                    actions={mixinFuncsGeneral.renderActions()}
                                    onSubmit={onSaveGeneral}
                                    size="big"
                                />
                            ),
                        },
                        {
                            key: 'order',
                            label: translate.formatMessage(messages.orderSetting),
                            children: (
                                <OrderSettingForm
                                    setIsChangedFormValues={setIsChangedFormValuesOrder}
                                    dataDetail={orderDetail ? orderDetail : { time_work: {} }}
                                    formId={mixinFuncsOrder.getFormId()}
                                    isEditing={isEditingOrder}
                                    actions={mixinFuncsOrder.renderActions()}
                                    onSubmit={onSaveOrder}
                                    size="1000px"
                                />
                            ),
                        },
                    ]}
                />
            </Card>
        </PageWrapper>
    );
};

export default SettingPage;
