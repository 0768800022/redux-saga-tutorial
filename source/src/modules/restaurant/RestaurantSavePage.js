import PageWrapper from '@components/common/layout/PageWrapper';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TIME } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useQueryParams from '@hooks/useQueryParams';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { convertUtcToLocalTime } from '@utils';
import moment from 'moment';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';
import RestaurantForm from './RestaurantForm';

const messages = defineMessages({
    home: 'Home',
    restaurant: 'Restaurant',
});

const RestaurantSavePage = () => {
    const { restaurantId } = useParams();
    const translate = useTranslate();
    const { profile } = useAuth();
    const location = useLocation();
    const { params: queryParams } = useQueryParams();
    const { data: detail, execute: executeGet } = useFetch(apiConfig.restaurant.getById, {
        mappingData: (res) => res.data,
    });
    useEffect(() => {
        if (restaurantId) executeGet({ pathParams: { id: restaurantId } });
    }, [location.pathname]);
    const { mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getDetail: apiConfig.restaurant.getById,
            create: apiConfig.restaurant.create,
            update: apiConfig.restaurant.updateByClient,
        },
        options: {
            getListUrl: '/',
            objectName: translate.formatMessage(messages.restaurant),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...detail,
                    ...data,
                    id: detail.id,
                    accountId: profile.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    accountId: profile.id,
                };
            };

            funcs.mappingData = ({ data }) => {
                return {
                    ...data,
                    services: data.services ? data.services.split(';') : [],
                    extendDate: data?.extendDate
                        ? moment(
                            convertUtcToLocalTime(data?.extendDate, DEFAULT_FORMAT, DATE_FORMAT_VALUE),
                            DATE_FORMAT_VALUE,
                        )
                        : moment(DEFAULT_TIME, DATE_FORMAT_VALUE),
                    expiredDate: data?.expiredDate
                        ? moment(
                            convertUtcToLocalTime(data?.expiredDate, DEFAULT_FORMAT, DATE_FORMAT_VALUE),
                            DATE_FORMAT_VALUE,
                        )
                        : moment(DEFAULT_TIME, DATE_FORMAT_VALUE),
                };
            };
        },
    });


    return (
        <PageWrapper
            loading={loading}
            routes={[{ breadcrumbName: translate.formatMessage(messages.home) }, { breadcrumbName: title }]}
        >
            <RestaurantForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
            />
        </PageWrapper>
    );
};

export default RestaurantSavePage;
