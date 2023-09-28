import apiConfig from '@constants/apiConfig';
import GroupFoodListPage from '.';
import GroupFoodSavePage from './GroupFoodSavePage';
import FoodListPage from './FoodListPage';
import FoodSavePage from './FoodSavePage';
import GroupFoodVariantListPage from './GroupFoodVariantListPage';
import GroupFoodVariantSavePage from './GroupFoodVariantSavePage';
export default {
    groupFoodListPage: {
        path: '/:restaurantId/menu/category-service/service/:serviceCategoryId',
        title: 'Group Food',
        auth: true,
        permissions: [apiConfig.groupFood.getList.baseURL],
        component: GroupFoodListPage,
    },
    groupFoodSavePage: {
        path: '/:restaurantId/menu/category-service/service/:serviceCategoryId/:id',
        title: 'Group Food',
        auth: true,
        component: GroupFoodSavePage,
    },
    groupFoodVariantListPage: {
        path: '/:restaurantId/menu/category-service/service/:serviceCategoryId/:serviceId/variant',
        title: 'Group Food Variant',
        auth: true,
        component: GroupFoodVariantListPage,
    },
    groupFoodVariantSavePage: {
        path: '/:restaurantId/menu/category-service/service/:serviceCategoryId/:serviceId/variant/:id',
        title: 'Group Food Variant Save',
        auth: true,
        component: GroupFoodVariantSavePage,
    },
    foodListPage: {
        path: '/:restaurantId/menu/group-food/food/:groupFoodId',
        title: 'Food',
        auth: true,
        permissions: [apiConfig.food.getList.baseURL],
        component: FoodListPage,
    },
    foodSavePage: {
        path: '/:restaurantId/menu/group-food/food/:groupFoodId/:id',
        title: 'Food',
        auth: true,
        permissions: [apiConfig.food.getById.baseURL],
        component: FoodSavePage,
    },
};
