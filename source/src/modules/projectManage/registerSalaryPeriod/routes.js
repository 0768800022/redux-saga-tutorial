import apiConfig from '@constants/apiConfig';

import RegisterSalaryPeriodListPage from '.';


export default {
    RegisterSalaryPeriodList: {
        path: '/register-salary-period',
        title: 'Salary Period',
        auth: true,
        component: RegisterSalaryPeriodListPage,
        permissions: [apiConfig.registerSalaryPeriod.getList.baseURL],
    },
    // salaryPeriodSavePage: {
    //     path: '/salary-period/:id',
    //     title: 'Salary Period Save Page',
    //     auth: true,
    //     component: SalaryPeriodSavePage,
    //     permissions: [apiConfig.salaryPeriod.create.baseURL, apiConfig.salaryPeriod.update.baseURL],
    // },
  
};
