import apiConfig from "@constants/apiConfig";
import CompanyListPage from ".";
import CompanySavePage from "./CompanySavePage";

export default {
    companyListPage: {
        path: '/company',
        title: 'Company',
        auth: true,
        component: CompanyListPage,
        permissions: [apiConfig.company.getList.baseURL],
    },
    studentSavePage: {
        path: '/company/:id',
        title: 'Company Save Page',
        auth: true,
        component: CompanySavePage,
        separateCheck: true,
        permission: [apiConfig.company.create.baseURL, apiConfig.company.update.baseURL],
    },
};