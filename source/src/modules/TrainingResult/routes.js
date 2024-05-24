import apiConfig from '@constants/apiConfig';

import TrainingResultListPage from '.';
export default {
   
    trainingResultListPage: {
        path: '/training-result',
        title: 'Training result',
        auth: true,
        component: TrainingResultListPage,
        // permissions: [apiConfig.trainingResult.myTraniningResult.baseURL],
    },
};
