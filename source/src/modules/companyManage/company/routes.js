import apiConfig from "@constants/apiConfig";
import CompanyListPage from ".";
import CompanySavePage from "./CompanySavePage";
import ServiceCompanySubListPage from '../serviceCompanySubscription';
import ServiceCompanySubscriptionSavePage from '../serviceCompanySubscription/ServiceCompanySubscriptionSavePage';
import CompanySubscriptionIdListPage from '../company/CompanySubscriptionID/index';
import CompanySubscriptionIdSavePage from './CompanySubscriptionID/CompanySubscriptionIDSavePage';
import CompanySeekListPage from "./companySeek";
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
        path: '/service-company-subscription',
        title: 'Service Company Subscription',
        auth: true,
        component: ServiceCompanySubListPage,
        separateCheck: true,
        permissions: [apiConfig.serviceCompanySubscription.getList.baseURL],
    },
    serviceCompanySubSavePage: {
        path: '/service-company-subscription/:id',
        title: 'Service Company Subscription Save page',
        auth: true,
        component: ServiceCompanySubscriptionSavePage,
        separateCheck: true,
        permissions: [apiConfig.serviceCompanySubscription.create.baseURL, apiConfig.serviceCompanySubscription.update.baseURL],
    },
    companySubscriptionIdListPage: {
        path: '/company/company-subscription',
        title: 'Company Subscription By Id ',
        auth: true,
        component: CompanySubscriptionIdListPage,
        separateCheck: true,
        permissions: [apiConfig.companySubscription.getList.baseURL],
    },
    companySubscriptionIdSavePage: {
        path: '/company/company-subscription/:id',
        title: 'Company Subscription Save page By Id ',
        auth: true,
        component: CompanySubscriptionIdSavePage,
        separateCheck: true,
        permissions: [apiConfig.companySubscription.create.baseURL, apiConfig.companySubscription.update.baseURL],
    },
    companySeekListPage: {
        path: '/company-seek',
        title: 'Company seek',
        auth: true,
        component: CompanySeekListPage,
        permissions: [apiConfig.companySeek.getList.baseURL],
    },
};