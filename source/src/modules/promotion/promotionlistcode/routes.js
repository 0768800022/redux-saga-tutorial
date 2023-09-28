import apiConfig from "@constants/apiConfig";
import PromotionListCode from ".";

export default {
    promotionListCode: {
        path: '/:restaurantId/promotion/:id/listcode',
        title: 'Promotion List Code',
        auth: true,
        component: PromotionListCode,
        permissions: [apiConfig.promotion.listPromotionCode.baseURL],
    },
};