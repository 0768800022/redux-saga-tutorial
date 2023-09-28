import ReviewListPage from ".";
import ReviewSavePage from "./ReviewSavePage";

export default {
    reviewListPage: {
        path: '/:restaurantId/menu/review',
        title: 'Review',
        auth: true,
        component: ReviewListPage,
    },
    reviewSavePage: {
        path: '/:restaurantId/menu/review/:id',
        title: 'Review Save Page',
        auth: true,
        component: ReviewSavePage,
    },
};