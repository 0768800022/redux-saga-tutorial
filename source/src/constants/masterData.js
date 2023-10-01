import {
    CurrentcyPositions,
    STATE_ORDER_CANCEL,
    STATE_ORDER_DONE,
    STATE_ORDER_PENDING,
    STATUS_ACTIVE,
    STATUS_INACTIVE,
    STATUS_PENDING,
} from '@constants';
import {
    dateFilterMessage,
    dayOfWeek,
    discountTypeOptionIntl,
    genderMessage,
    orderStateMessage,
    promotionKindOptionIntl,
    statePromotion,
    statusMessage,
} from './intl';

export const languageOptions = [
    { value: 1, label: 'EN' },
    { value: 2, label: 'VN' },
    { value: 3, label: 'Other' },
];

export const orderOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

export const commonStatus = [
    { value: STATUS_ACTIVE.toString(), label: 'Active', color: 'green' },
    { value: STATUS_PENDING.toString(), label: 'Pending', color: 'warning' },
    { value: STATUS_INACTIVE.toString(), label: 'Inactive', color: 'red' },
];

export const orderStateOptions = [
    {
        value: STATE_ORDER_PENDING,
        label: orderStateMessage.pending,
        color: '#FFBF00',
    },
    {
        value: STATE_ORDER_DONE,
        label: orderStateMessage.done,
        color: '#00A648',
    },
    {
        value: STATE_ORDER_CANCEL,
        label: orderStateMessage.cancel,
        color: '#CC0000',
    },
];
export const statusOptions = [
    {
        value: STATUS_ACTIVE,
        label: statusMessage.active,
        color: '#00A648',
    },
    {
        value: STATUS_PENDING,
        label: statusMessage.pending,
        color: '#FFBF00',
    },
    {
        value: STATUS_INACTIVE,
        label: statusMessage.inactive,
        color: '#CC0000',
    },
];

export const commonStatusOptions = [
    { value: STATUS_ACTIVE, label: 'Active' },
    { value: STATUS_PENDING, label: 'Pending' },
    { value: STATUS_INACTIVE, label: 'Inactive' },
];

export const MALE = 1;
export const FEMALE = 2;

export const genderOptions = [
    { label: genderMessage.male, value: MALE },
    { label: genderMessage.female, value: FEMALE },
];

export const formSize = {
    small: '700px',
    normal: '800px',
    big: '900px',
};

export const commonLanguages = [
    { value: 'vi', label: 'Việt Nam' },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'German' },
];

export const CATEGORY_KIND_NEWS = 1;
export const CATEGORY_KIND_DEPARTMENT = 2;
export const CATEGORY_KIND_JOB_TITLE = 3;
export const CATEGORY_KIND_EDUCATION = 4;
export const CATEGORY_KIND_SERVICE = 5;
export const CATEGORY_KIND_INVOICE_IN = 6;
export const CATEGORY_KIND_INVOICE_OUT = 7;
export const CATEGORY_KIND_KNOWLEDGE = 8;
export const CATEGORY_KIND_DEVICE = 9;
export const CATEGORY_KIND_PROVIDER_PRODUCT = 10;
export const categoryKind = {
    service: {
        title: 'Category',
        path: 'service',
        value: CATEGORY_KIND_SERVICE,
    },
};

export const employeePermissions = [
    { value: 1, label: 'Quản lý của nhà hàng' },
    { value: 2, label: 'Xoá món ăn đã đặt và in vào bếp' },
    { value: 3, label: 'Xoá món ăn đặt sai' },
    { value: 4, label: 'Xem báo cáo bán hàng' },
];

export const GoodsKinds = {
    COMMON: 1,
    CHOOSE: 5,
    // MERGE: 3,
    // CHOOSE: 4
};

export const goodsKinds = [
    { value: GoodsKinds.COMMON, label: 'Món ăn thông thường' },
    { value: GoodsKinds.CHOOSE, label: 'Món ăn chọn' },
];

const GoodsTypes = {
    DRINK: 1,
    FOOD: 2,
};

export const goodsTypes = [
    { value: GoodsTypes.DRINK, label: 'Drink' },
    { value: GoodsTypes.FOOD, label: 'Food' },
];

export const datetimeFormats = [
    { value: 'DD.MM.YYYY HH:mm', label: 'dd.MM.yyyy' },
    { value: 'YYYY.MM.DD HH:mm', label: 'yyyy.MM.dd' },
];

export const orderMethods = [
    { value: 'OFFLINE_CASH', label: 'Tiền mặt' },
    { value: 'OFFLINE_CARD', label: 'Thẻ' },
    { value: 'ONLINE_PAYPAL', label: 'Paypal' },
];

export const currentcyPositions = [
    { value: CurrentcyPositions.FRONT, label: '$ 1234,56' },
    { value: CurrentcyPositions.BACK, label: '1234,56 $' },
];

export const daysOfWeekTimeWork = [
    { value: 'monday', label: dayOfWeek.monday },
    { value: 'tuesday', label: dayOfWeek.tuesday },
    { value: 'wednesday', label: dayOfWeek.wednesday },
    { value: 'thursday', label: dayOfWeek.thursday },
    { value: 'friday', label: dayOfWeek.friday },
    { value: 'saturday', label: dayOfWeek.saturday },
    { value: 'sunday', label: dayOfWeek.sunday },
];

export const KIND_SERVICE_NORMAL = 1;
export const KIND_SERVICE_COMBO = 2;

export const serviceKinds = [
    { value: KIND_SERVICE_NORMAL, label: 'Thường' },
    { value: KIND_SERVICE_COMBO, label: 'Combo' },
];

export const FREE_STATE = 0;
export const BUSY_STATE = 1;

export const stateOptions = [
    { label: 'Rảnh', value: FREE_STATE, color: '#00A648' },
    { label: 'Bận', value: BUSY_STATE, color: '#FFBF00' },
];

export const HALF = 0;
export const FULL = 1;

export const salaryType = [
    { label: 'Chia sẻ', value: HALF },
    { label: 'Đầy đủ', value: FULL },
];

export const STATE_PROMOTION_CREATED = 'CREATED';
export const STATE_PROMOTION_RUNNING = 'RUNNING';
export const STATE_PROMOTION_END = 'END';
export const STATE_PROMOTION_CANCEL = 'CANCEL';

export const statePromotionOptions = [
    { label: statePromotion.created, value: STATE_PROMOTION_CREATED, color: '#FFBF00' },
    { label: statePromotion.running, value: STATE_PROMOTION_RUNNING, color: '#00A648' },
    { label: statePromotion.end, value: STATE_PROMOTION_END, color: '#FF3333' },
    { label: statePromotion.cancel, value: STATE_PROMOTION_CANCEL, color: '#F69501' },
];

export const PROMOTION_KIND_USE_ONCE = 2;
export const PROMOTION_KIND_USE_MULTIPLE = 1;

export const promotionKindOption = [
    { label: promotionKindOptionIntl.one, value: PROMOTION_KIND_USE_ONCE },
    { label: promotionKindOptionIntl.multiple, value: PROMOTION_KIND_USE_MULTIPLE },
];

export const DISCOUNT_TYPE_PERCENT = 1;
export const DISCOUNT_TYPE_MONEY = 2;

export const discountTypeOption = [
    { label: discountTypeOptionIntl.percent, value: DISCOUNT_TYPE_PERCENT },
    { label: discountTypeOptionIntl.money, value: DISCOUNT_TYPE_MONEY },
];
export const dateFilterOptions = [
    { value: 1, label: dateFilterMessage.today },
    { value: 2, label: dateFilterMessage.thisMonth },
    { value: 3, label: dateFilterMessage.lastMonth },
    { value: 4, label: dateFilterMessage.custom },
];