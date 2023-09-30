import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import GroupFoodForm from './GroupFoodForm';
import routes from './routes';
import { STATUS_ACTIVE } from '@constants';
import FoodForm from './FoodForm';
import useFetch from '@hooks/useFetch';

const FoodSavePage = () => {
    const { id, restaurantId, groupFoodId } = useParams();
    const { data: groupFoodDetail } = useFetch(apiConfig.groupFood.getById, {
        immediate: true,
        pathParams: { id: groupFoodId },
        mappingData: (res) => res.data,
    });
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: apiConfig.groupFood,
        options: {
            getListUrl: generatePath(routes.groupFoodListPage.path, { restaurantId }),
            objectName: 'Group Food',
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => ({
                ...data,
                groupSetting: '{}',
                restaurantId,
                id,
            });
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    groupSetting: '{}',
                    restaurantId,
                    status: STATUS_ACTIVE,
                };
            };

            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: 'Home' },
                {
                    breadcrumbName: 'Group Food',
                    path: generatePath(routes.groupFoodListPage.path, { restaurantId }),
                },
                {
                    breadcrumbName: groupFoodDetail?.name,
                    path: generatePath(routes.foodListPage.path, { restaurantId, groupFoodId }),
                },
                { breadcrumbName: title },
            ]}
        >
            <FoodForm
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

export default FoodSavePage;
