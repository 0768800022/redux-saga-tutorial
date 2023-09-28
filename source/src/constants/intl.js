import { defineMessages } from 'react-intl';

export const commonLabel = defineMessages({
    videos: 'Videos',
    articles: 'Articles',
    games: 'Games',
    quiz: 'Quiz',
    lesson: 'lesson',

    welcomeUser: 'Welcome, {user}',
});

export const commonButton = defineMessages({
    login: 'Login',
});

export const statusMessage = defineMessages({
    active: 'Active',
    pending: 'Pending',
    inactive: 'Inactive',
});
export const dateFilterMessage = defineMessages({
    today: 'Today',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    custom: 'Custom',
});
export const orderStateMessage = defineMessages({
    done: 'Done',
    pending: 'Pending',
    cancel: 'Cancel',
});

export const genderMessage = defineMessages({
    male: 'Male',
    female: 'Female',
});

export const salaryTypeMessage = defineMessages({
    share: 'Share',
    full: 'Full',
});

export const dayOfWeek = defineMessages({
    monday: 'Thứ 2',
    tuesday: 'Thứ 3',
    wednesday: 'Thứ 4',
    thursday: 'Thứ 5',
    friday: 'Thứ 6',
    saturday: 'Thứ 7',
    sunday: 'Chủ nhật',
});

export const promotionKindOptionIntl = defineMessages({
    one: 'Nhiều mã',
    multiple: 'Một mã',
});

export const discountTypeOptionIntl = defineMessages({
    percent: 'Phần trăm',
    money: 'Tiền',
});

export const statePromotion = defineMessages({
    cancel: 'Huỷ',
    end: 'Kết thúc',
    running: 'Đang chạy',
    created: 'Mới tạo',
});