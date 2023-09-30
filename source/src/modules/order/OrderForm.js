import Currency from '@components/common/elements/Currency';
import NumericField from '@components/common/form/NumericField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { formSize, orderStateOptions, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Avatar, Modal, Button, Card, Col, Divider, Form, List, Row, Steps, Tag, InputNumber } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss';
import { defineMessages } from 'react-intl';
import {
    PhoneOutlined,
    FieldBinaryOutlined,
    HomeFilled,
    PushpinFilled,
    UserOutlined,
    DeleteOutlined,
    CreditCardOutlined,
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import BaseTable from '@components/common/table/BaseTable';
import {
    AppConstants,
    DEFAULT_TABLE_ITEM_SIZE,
    PAYMENT_TYPE_CARD,
    PAYMENT_TYPE_CASH,
    PAYMENT_TYPE_ONLINE_PAYPAL,
} from '@constants';
import { fitString } from '@store/utils';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import LoadingWrapper from '@components/common/form/LoadingWrapper';
import DateFormat from '@components/common/elements/DateFormat';
import useListBase from '@hooks/useListBase';
const messages = defineMessages({
    name: 'Name',
    phone: 'Phone',
    address: 'address',
    customerName: 'Name',
    itemName: 'Item name',
    customerPhone: 'Phone',
    totalMoney: 'Total Money',
    status: 'Status',
    orderInfo: 'Order information',
    customerInfo: 'Customer information',
    orderItems: 'Order Items',
    createdDate: 'Created Date',
    timeDeliver: 'Time deliver',
    code: 'Code',
    sale: 'Sale Off',
    priceAfterSale: 'Price After Sale',
    order: 'Order',
    verified: 'Verified',
    packaging: 'Packaging',
    shipping: 'Shipping',
    finished: 'Finished',
    totalPoints: 'Total Points',
    orderAddress: 'Order Address',
    changeAddress: 'Change Shipping Address',
    items: 'List items',
    amount: 'Amount',
    money: 'Price',
    description: 'Description',
    orderProcessing: 'Order Processing',
    update: 'Update Order',
    action: 'Action',
    total: 'Total',
    confirmDeleteItem: 'Are you sure to remove this item?',
    yes: 'Yes',
    cancel: 'Cancel',
    removeItemSuccess: 'Remove Item Successfully',
    removeItemFail: 'Remove Item Failed',
    updateOrderSuccess: 'Update Order Successfully',
    updateOrderFail: 'Update Item Failed',
    paymentMethod: 'Payment method',
    shippingType: 'Shipping type',
    pickUp: 'Pick Up',
    deliver: 'Deliver',
    offlineCash: 'Offline Cash',
    offlineCard: 'Offline Card',
    onlinePaypal: 'Online Paypal',
    historyOrder: 'History Order',
    state: 'State',
});
const OrderForm = (props) => {
    const translate = useTranslate();
    const {
        formId,
        actions,
        onGetDetail,
        dataDetail,
        onSubmit,
        setIsChangedFormValues,
        isEditing,
        size = 'small',
        action,
    } = props;
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const { id, phone } = useParams();
    const { execute: executeUpdateOrder, loading: loadingExcecuteUpdateOrder } = useFetch(apiConfig.order.update, {
        immediate: false,
    });
    const {
        data: dataHistoryOrder,
        loading,
        pagination,
        changePagination,
    } = useListBase({
        apiConfig: apiConfig.order,
        options: {
            pageSize: 10,
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content.map((item) => ({ ...item, id: item.id })),
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    phone,
                };
            };
        },
    });
    const orderStateValues = translate.formatKeys(orderStateOptions, ['label']);
    const [dataTable, setDataTable] = useState([]);
    const [isBlockDelete, setIsBlockDelete] = useState(false);
    const [stateArray, setStateArray] = useState([]);
    const [shippingType, setShippingType] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_TYPE_CARD);

    const handleRemoveItem = (itemId) => {
        Modal.confirm({
            title: translate.formatMessage(messages.confirmDeleteItem),
            content: '',
            okText: translate.formatMessage(messages.yes),
            cancelText: translate.formatMessage(messages.cancel),
            onCancel: () => {
                return false;
            },
            onOk: () => {
                let data = JSON.parse(JSON.stringify(dataTable));
                const indexTotal = data.findIndex((item) => item.id == 9999);
                if (indexTotal > -1) {
                    data.splice(indexTotal, 1);
                }
                const indexRemove = data.findIndex((item) => item.id == itemId);
                if (indexRemove > -1) {
                    data.splice(indexRemove, 1);
                }
                data = data.map((item) => {
                    delete item.id;

                    return {
                        ...item,
                        note: '',
                    };
                });
                executeUpdateOrder({
                    data: {
                        customerName: dataDetail.customerName,
                        customerObjectRef: null,
                        customerPhone: dataDetail.customerPhone,
                        customerShippingAddress: dataDetail.customerShippingAddress,
                        note: dataDetail.note,
                        orderId: id,
                        orderItems: data,
                        paymentMethod,
                        promotionCode: null,
                        saleOff: dataDetail.saleOff,
                        state: form.getFieldValue('state'),
                        typeOrder: shippingType,
                        timeDeliver: dataDetail.timeDeliver,
                    },
                    onCompleted: () => {
                        showSucsessMessage(translate.formatMessage(messages.updateOrderSuccess));
                        onGetDetail();
                        return true;
                    },
                    onError: (error) => {
                        console.log(error);
                        showErrorMessage(translate.formatMessage(messages.updateOrderFail));
                        return false;
                    },
                });
            },
        });
    };
    const handleOnchangeState = (value) => {
        form.setFieldValue('state', value);
    };
    const handleOnchangeItemAmount = (value, itemId) => {
        if (value == 0) {
            if (!handleRemoveItem(itemId)) {
                form.setFieldValue(`amount${itemId}`, 1);
            }
        } else {
            setDataTable((prev) => {
                const resIndex = prev.findIndex((item) => item.id == itemId);
                prev[resIndex].amount = value;
                prev.pop();
                prev.push({
                    amount: prev.reduce((acc, cur) => acc + cur.amount, 0),
                    totalMoney: prev.reduce((acc, cur) => acc + cur.amount * cur.money, 0),
                    money: prev.reduce((acc, cur) => acc + cur.money, 0),
                    saleOff: form.getFieldValue('saleOff'),
                    name: translate.formatMessage(messages.total),
                    id: 9999,
                });
                return [...prev];
            });
        }
    };
    const handleUpdateOrder = () => {
        let data = JSON.parse(JSON.stringify(dataTable));
        const indexTotal = data.findIndex((item) => item.id == 9999);
        if (indexTotal > -1) {
            data.splice(indexTotal, 1);
        }
        data = data.map((item) => {
            // let serviceId = item.id;
            // delete item.name;
            delete item.id;

            return {
                ...item,
                note: '',
            };
        });
        executeUpdateOrder({
            data: {
                customerName: dataDetail.customerName,
                customerObjectRef: null,
                customerPhone: dataDetail.customerPhone,
                customerShippingAddress: dataDetail.customerShippingAddress,
                note: dataDetail.note,
                orderId: id,
                orderItems: data,
                paymentMethod,
                promotionCode: null,
                saleOff: dataDetail.saleOff,
                state: form.getFieldValue('state'),
                typeOrder: shippingType,
                timeDeliver: dataDetail.timeDeliver,
            },
            onCompleted: () => {
                showSucsessMessage(translate.formatMessage(messages.updateOrderSuccess));
                onGetDetail();
            },
            onError: (error) => {
                console.log(error);
                showErrorMessage(translate.formatMessage(messages.updateOrderFail));
            },
        });
    };
    const handleChangeShippingType = (value) => {
        if (dataDetail.state == 0 && action != 'view') {
            setShippingType(value);
        }
    };
    const handleChangePayMentMethod = (value) => {
        if (dataDetail.state == 0 && action != 'view') {
            setPaymentMethod(value);
        }
    };
    const columns = [
        {
            title: translate.formatMessage(messages.itemName),
            dataIndex: 'name',
            render: (data, dataRow) => (
                <span
                    style={{
                        fontWeight: 'bold',
                        color: dataRow.name == translate.formatMessage(messages.total) ? 'black' : '#6c6cac',
                        textTransform: dataRow.name == translate.formatMessage(messages.total) ? 'uppercase' : 'normal',
                    }}
                >
                    {data}
                </span>
            ),
        },
        {
            title: translate.formatMessage(messages.amount),
            dataIndex: 'amount',
            align: 'right',
            width: 100,
            render: (data, dataRow) =>
                dataRow.name != translate.formatMessage(messages.total) ? (
                    <NumericField
                        min={isBlockDelete ? 1 : 0}
                        name={`amount${dataRow.id}`}
                        onChange={(value) => handleOnchangeItemAmount(value, dataRow.id)}
                        defaultValue={data}
                        readOnly={dataDetail.state != 0 || action == 'view'}
                        controls
                        className={`${dataDetail.state != 0 || action == 'view' ? 'readOnly' : ''}`}
                    />
                ) : (
                    <span
                        style={{
                            fontWeight: 'bold',
                            paddingRight: '11px ',
                        }}
                    >
                        {data}
                    </span>
                ),
        },
        {
            title: translate.formatMessage(messages.sale),
            dataIndex: 'saleOff',
            align: 'right',
            width: 100,
            render: (data, dataRow) => {
                return (
                    <span
                        style={{
                            fontWeight: dataRow.name == translate.formatMessage(messages.totalMoney) ? 'bold' : '',
                        }}
                    >
                        {data}
                    </span>
                );
            },
        },
        {
            title: translate.formatMessage(messages.money),
            dataIndex: 'money',
            align: 'right',
            width: 120,
            render: (data, dataRow) => (
                <Currency
                    value={data}
                    style={{
                        fontWeight: dataRow.name == translate.formatMessage(messages.total) ? 'bold' : '',
                    }}
                />
            ),
        },
        {
            title: translate.formatMessage(messages.totalMoney),
            dataIndex: 'totalMoney',
            align: 'right',
            width: 150,
            render: (data, dataRow) => (
                <Currency
                    value={
                        dataRow.name == translate.formatMessage(messages.total) ? data : dataRow.amount * dataRow.money
                    }
                    style={{
                        fontWeight: dataRow.name == translate.formatMessage(messages.total) ? 'bold' : '',
                    }}
                />
            ),
        },
        {
            title: translate.formatMessage(messages.action),
            dataIndex: 'action',
            align: 'center',
            width: 120,
            render: (data, dataRow) => {
                return dataRow.name != translate.formatMessage(messages.total) ? (
                    <Button
                        type="link"
                        disabled={isBlockDelete || action == 'view' ? true : false}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(dataRow.id);
                        }}
                        style={{ padding: 0 }}
                    >
                        <DeleteOutlined />
                    </Button>
                ) : (
                    <></>
                );
            },
        },
    ];
    const historyOrderColumn = [
        {
            title: translate.formatMessage(messages.createdDate),
            dataIndex: 'createdDate',
        },
        {
            title: translate.formatMessage(messages.totalMoney),
            dataIndex: 'totalMoney',
            align: 'right',
            render: (data, dataRow) => <Currency value={data} />,
        },
        {
            title: translate.formatMessage(messages.state),
            dataIndex: 'state',
            align: 'right',
            render(dataRow) {
                const state = orderStateValues.find((item) => item.value == dataRow);
                return <Tag color={state.color}>{state.label}</Tag>;
            },
            width: 100,
        },
    ];
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        if (Object.keys(dataDetail).length > 0) {
            if (dataDetail.orderItems) {
                setDataTable(() => {
                    let result = dataDetail?.orderItems?.map((item) => ({ ...item }));
                    result.push({
                        amount: result.reduce((acc, cur) => acc + cur.amount, 0),
                        totalMoney: result.reduce((acc, cur) => acc + cur.amount * cur.money, 0),
                        money: result.reduce((acc, cur) => acc + cur.money, 0),
                        saleOff: form.getFieldValue('saleOff'),
                        name: translate.formatMessage(messages.total),
                        id: 9999,
                    });
                    return result;
                });
            }
            if (dataDetail.state != 0) {
                setIsBlockDelete(true);
            }
            if (dataDetail.state == -1) {
                setStateArray([
                    {
                        title: translate.formatMessage(messages.order),
                    },
                    {
                        title: translate.formatMessage(messages.cancel),
                    },
                ]);
            } else {
                setStateArray([
                    {
                        title: translate.formatMessage(messages.order),
                    },
                    {
                        title: translate.formatMessage(messages.verified),
                    },
                    {
                        title: translate.formatMessage(messages.finished),
                    },
                ]);
            }
            setShippingType(dataDetail.typeOrder);
            setPaymentMethod(dataDetail.paymentMethod);
        }
    }, [dataDetail]);
    useEffect(() => {
        if (dataTable.length == 2) {
            setIsBlockDelete(true);
        }
    }, [dataTable]);
    return (
        <LoadingWrapper loading={loadingExcecuteUpdateOrder}>
            <Form
                style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}
                id={formId}
                onFinish={mixinFuncs.handleSubmit}
                form={form}
                layout="vertical"
                onValuesChange={onValuesChange}
                className="order-wrapper"
            >
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '900px' }}>
                        <Steps
                            size="middle"
                            status={dataDetail.state == -1 ? 'error' : 'process'}
                            current={dataDetail.state == 0 ? 0 : dataDetail.state == 1 ? 2 : 1}
                            items={stateArray}
                            style={{ width: 'fit-content', minWidth: '500px' }}
                        />
                        <Card
                            className="card-form"
                            bordered={false}
                            title={
                                <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {translate.formatMessage(messages.customerInfo)}
                                </span>
                            }
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div className={styles.textFieldWrapper}>
                                    <Avatar
                                        size={'large'}
                                        icon={<UserOutlined />}
                                        src={
                                            form.getFieldValue('avatar')
                                                ? `${AppConstants.contentRootUrl}${form.getFieldValue('avatar')}`
                                                : null
                                        }
                                    />
                                    <span style={{ color: '#6c6cac' }}>
                                        {fitString(form.getFieldValue('customerName'), 20)}
                                    </span>
                                </div>
                                {/* <Tag color="purple">VIP S</Tag>
                                <div className={styles.textFieldWrapper}>
                                    <PhoneOutlined rotate={'90'} style={{ fontSize: '1.4rem' }} />
                                    <span>{form.getFieldValue('customerPhone')}</span>
                                </div>
                                <div className={styles.textFieldWrapper}>
                                    <Tag>YD</Tag>
                                    <span>{translate.formatMessage(messages.totalPoints)}:</span>
                                </div>
                                <div className={styles.textFieldWrapper}>
                                    <FieldBinaryOutlined style={{ fontSize: '1.4rem', marginTop: '2px' }} />
                                </div> */}
                            </div>
                            <Divider style={{ margin: '26px 0px' }} />
                            <div className={styles.textFieldWrapper} style={{ alignItems: 'unset' }}>
                                <div className={styles.splitCardWrapper}>
                                    <div
                                        style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}
                                    >
                                        <HomeFilled style={{ fontSize: '1.3rem' }} />
                                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                            {translate.formatMessage(messages.orderAddress)}:
                                        </span>
                                    </div>
                                    <div className={styles.listAddressWrapper}>
                                        <span>{form.getFieldValue('customerName')}</span>
                                        <span>{form.getFieldValue('customerPhone')}</span>
                                        <span>{form.getFieldValue('customerShippingAddress')}</span>
                                    </div>
                                    {/* <Link>{translate.formatMessage(messages.changeAddress)}</Link> */}
                                </div>
                                <Divider
                                    style={{
                                        height: '145px',
                                    }}
                                    type="vertical"
                                />
                                <div className={styles.splitCardWrapper}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <PushpinFilled style={{ fontSize: '1.3rem' }} />
                                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                            {translate.formatMessage(messages.description)}:
                                        </span>
                                    </div>
                                    {dataDetail.timeDeliver && (
                                        <div style={{ display: 'flex', fontWeight: 'normal', gap: '5px' }}>
                                            <span>{translate.formatMessage(messages.timeDeliver)}:</span>
                                            <span>
                                                <span>{form.getFieldValue('timeDeliver')}</span>
                                            </span>
                                        </div>
                                    )}
                                    <p style={{ margin: '0px', fontWeight: '400' }}>{form.getFieldValue('note')}</p>
                                </div>
                            </div>
                            <Divider style={{ margin: '10px 0px 0px 0px' }} />
                        </Card>
                        <Card
                            className={`card-form`}
                            bordered={false}
                            title={
                                <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {translate.formatMessage(messages.items)}
                                </span>
                            }
                        >
                            <BaseTable dataSource={dataTable} columns={columns} />
                        </Card>
                        <Card
                            className={`card-form`}
                            bordered={false}
                            title={
                                <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {translate.formatMessage(messages.historyOrder)}
                                </span>
                            }
                        >
                            <BaseTable
                                dataSource={dataHistoryOrder}
                                columns={historyOrderColumn}
                                onChange={changePagination}
                                pagination={pagination}
                                loading={loading}
                            />
                        </Card>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            marginTop: '52px',
                            minWidth: '400px',
                        }}
                    >
                        <Card
                            className={`card-form ${styles.miniCardWrapper}`}
                            bordered={false}
                            title={
                                <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {translate.formatMessage(messages.orderInfo)}
                                </span>
                            }
                        >
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <span style={{ width: '100px' }}>{translate.formatMessage(messages.code)}:</span>
                                <span style={{ color: '#2a2a86', fontWeight: '600' }}>
                                    {form.getFieldValue('code')}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', marginTop: '5px' }}>
                                <span style={{ width: '100px' }}>{translate.formatMessage(messages.createdDate)}:</span>
                                <span>
                                    <DateFormat>{form.getFieldValue('createdDate')}</DateFormat>
                                </span>
                            </div>
                            <div className={styles.typeOrderWrapper}>
                                <span className={`${styles.typeOrderLabel}`}>
                                    {translate.formatMessage(messages.shippingType)}:
                                </span>
                                <div className={`${styles.typeOrderCardWrapper}`}>
                                    <div
                                        className={`${shippingType == 2 ? styles.active : ''} ${styles.typeOrderCard} ${
                                            action == 'view' || dataDetail.state != 0 ? styles.readOnly : ''
                                        }`}
                                        onClick={() => {
                                            handleChangeShippingType(2);
                                        }}
                                    >
                                        <span>{translate.formatMessage(messages.deliver)}</span>
                                        <div>
                                            <img
                                                width="40"
                                                height="40"
                                                src="https://store-fe.developteam.net/_next/static/media/delivery.b2d4995a.svg"
                                                alt="delivery method"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={`${shippingType == 1 ? styles.active : ''} ${styles.typeOrderCard} ${
                                            action == 'view' || dataDetail.state != 0 ? styles.readOnly : ''
                                        }  `}
                                        onClick={() => {
                                            handleChangeShippingType(1);
                                        }}
                                    >
                                        <span>{translate.formatMessage(messages.pickUp)}</span>
                                        <div>
                                            <img
                                                width="40"
                                                height="40"
                                                src="https://store-fe.developteam.net/_next/static/media/pickup.0e4c9636.svg"
                                                alt="external-Pick-Up-delivery-flat-berkahicon"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.paymentMethodWrapper}>
                                <div className={styles.paymentMethodLabel}>
                                    <img
                                        width="30"
                                        height="30"
                                        src="https://img.icons8.com/ios-filled/50/receive-change.png"
                                        alt="receive-change"
                                    />
                                    <span>{translate.formatMessage(messages.paymentMethod)}:</span>
                                </div>
                                <div className={styles.paymentMethodCardWrapper}>
                                    <div
                                        className={`${paymentMethod == PAYMENT_TYPE_CARD ? styles.active : ''} ${
                                            styles.paymentMethodCard
                                        } ${action == 'view' || dataDetail.state != 0 ? styles.readOnly : ''} `}
                                        onClick={() => {
                                            handleChangePayMentMethod(PAYMENT_TYPE_CARD);
                                        }}
                                    >
                                        <span>{translate.formatMessage(messages.offlineCard)}</span>
                                        <div>
                                            <img
                                                width="50"
                                                height="50"
                                                src="https://store-fe.developteam.net/_next/static/media/mastercard.d1f80049.svg"
                                                alt="bank-cards"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={`${
                                            paymentMethod == PAYMENT_TYPE_ONLINE_PAYPAL ? styles.active : ''
                                        } ${styles.paymentMethodCard} ${
                                            action == 'view' || dataDetail.state != 0 ? styles.readOnly : ''
                                        } `}
                                        onClick={() => {
                                            handleChangePayMentMethod(PAYMENT_TYPE_ONLINE_PAYPAL);
                                        }}
                                    >
                                        <span>{translate.formatMessage(messages.onlinePaypal)}</span>
                                        <div>
                                            <img
                                                width="50"
                                                height="50"
                                                src="https://store-fe.developteam.net/_next/static/media/paypal.650caa57.svg"
                                                alt="paypal"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={`${paymentMethod == PAYMENT_TYPE_CASH ? styles.active : ''} ${
                                            styles.paymentMethodCard
                                        } ${action == 'view' || dataDetail.state != 0 ? styles.readOnly : ''} `}
                                        onClick={() => {
                                            handleChangePayMentMethod(PAYMENT_TYPE_CASH);
                                        }}
                                    >
                                        <span>{translate.formatMessage(messages.offlineCash)}</span>
                                        <div>
                                            <img
                                                width="50"
                                                height="50"
                                                src="https://store-fe.developteam.net/_next/static/media/mastercard.d5ecfaf8.svg"
                                                alt="cash"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card
                            className={`card-form ${styles.miniCardWrapper}`}
                            bordered={false}
                            title={
                                <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {translate.formatMessage(messages.orderProcessing)}
                                </span>
                            }
                            style={{ height: 'fit-content' }}
                        >
                            <SelectField
                                name="state"
                                allowClear={false}
                                options={orderStateValues}
                                onChange={(value) => {
                                    if (dataDetail.state == 0) {
                                        handleOnchangeState(value);
                                    }
                                }}
                                open={dataDetail.state != 0 ? false : undefined}
                                className={`${dataDetail.state != 0 || action == 'view' ? 'readOnly' : ''}  `}
                            />
                        </Card>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleUpdateOrder}
                            disabled={dataDetail.state != 0 || action == 'view'}
                        >
                            {translate.formatMessage(messages.update)}
                        </Button>
                    </div>
                </div>
            </Form>
        </LoadingWrapper>
    );
};
export default OrderForm;
