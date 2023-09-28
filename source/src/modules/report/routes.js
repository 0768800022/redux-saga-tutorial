import apiConfig from "@constants/apiConfig";
import ReportListPage from ".";

export default {
    reportListPage: {
        path: '/:restaurantId/menu/report',
        title: 'Report',
        auth: true,
        component: ReportListPage,
    },
};
