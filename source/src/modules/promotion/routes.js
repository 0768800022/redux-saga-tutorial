import apiConfig from "@constants/apiConfig";
import PromotionListPage from ".";
import PromotionSavePage from "./PromotionSavePage";

export default {
    promotionListPage: {
        path: '/:restaurantId/promotion',
        title: 'Promotion',
        auth: true,
        component: PromotionListPage,
        permissions: apiConfig.promotion.getList.baseURL,
    },
    promotionSavePage: {
        path: '/:restaurantId/promotion/:id',
        title: 'Promotion Save Page',
        auth: true,
        component: PromotionSavePage,
        permissions: apiConfig.promotion.getById.baseURL,
    },
};