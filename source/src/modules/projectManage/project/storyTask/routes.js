import apiConfig from '@constants/apiConfig';
import StoryTaskListPage from '.';
import StoryTaskSavePage from './StoryTaskSavePage';
export default {
    StoryTaskListPage: {
        path: '/story/task',
        title: 'Task',
        auth: true,
        component: StoryTaskListPage,
        permissions: [apiConfig.story.getList.baseURL],
    },
    StoryTaskSavePage: {
        path: '/story/task/:id',
        title: 'Task Save Page',
        auth: true,
        component: StoryTaskSavePage,
        permissions: [apiConfig.story.create.baseURL, apiConfig.story.update.baseURL],
    },
};
