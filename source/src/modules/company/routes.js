import apiConfig from "@constants/apiConfig";
import CompanyListPage from ".";
import CompanySavePage from "./CompanySavePage";
import ServiceCompanySubListPage from './serviceCompanySubscription/index';
import ServiceCompanySubscriptionSavePage from './serviceCompanySubscription/ServiceCompanySubscriptionSavePage';
export default {
    companyListPage: {
        path: '/company',
        title: 'Company',
        auth: true,
        component: CompanyListPage,
        permissions: [apiConfig.company.getList.baseURL],
    },
    companySavePage: {
        path: '/company/:id',
        title: 'Company Save Page',
        auth: true,
        component: CompanySavePage,
        separateCheck: true,
        permission: [apiConfig.company.create.baseURL, apiConfig.company.update.baseURL],
    },
    serviceCompanySubListPage: {
        path: '/sevice-company-subscription',
        title: 'Service Company Subscription',
        auth: true,
        component: ServiceCompanySubListPage,
        separateCheck: true,
        permissions: [apiConfig.serviceCompanySubscription.getList.baseURL],
    },
    serviceCompanySubSavePage: {
        path: '/sevice-company-subscription/:id',
        title: 'Service Company Subscription Save page',
        auth: true,
        component: ServiceCompanySubscriptionSavePage,
        separateCheck: true,
        permissions: [apiConfig.serviceCompanySubscription.create.baseURL,apiConfig.serviceCompanySubscription.update.baseURL],
    },
};