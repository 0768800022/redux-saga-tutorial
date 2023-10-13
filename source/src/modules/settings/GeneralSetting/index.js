import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { Button, Avatar, Card, Col } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EditGenralModal from './EditGenralModal';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import { UserOutlined } from '@ant-design/icons';
import { AppConstants } from '@constants';
import SliderModal from './SliderModal';
import useNotification from '@hooks/useNotification';
import IntroduceModal from './IntroduceModal';
import ColumnGroup from 'antd/es/table/ColumnGroup';

const messages = defineMessages({
    objectName: 'Cài đặt chung',
    createNew: 'Thêm mới',
    deleteSuccess: 'Xoá slider thành công',
    slider: 'Slider',
});
const GeneralSettingPage = ({ groupName }) => {
    const translate = useTranslate();
    const intl = useIntl();
    const notification = useNotification();
    const [sliderData, setSliderData] = useState({});
    const [introduceData, setIntroduceData] = useState({});
    const [openedGeneralModal, handlersGeneralModal] = useDisclosure(false);
    const [openedIntroduceModal, handlersIntroduceModal] = useDisclosure(false);
    const [openedSliderModal, handlersSliderModal] = useDisclosure(false);
    const [detail, setDetail] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [parentData, setParentData] = useState({});
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.settings,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content.filter((item) => {
                            if (item.valueData) {
                                if (item?.keyName === 'slider') {
                                    const sliderDataParseJson = JSON.parse(item.valueData);
                                    const updatedSliderData = sliderDataParseJson?.map((obj) => ({
                                        ...obj,
                                        isSlider: true,
                                    }));
                                    setSliderData(updatedSliderData);
                                    setParentData(item);
                                    return false;
                                }

                                if (item?.keyName === 'introduce') {
                                    setIntroduceData(JSON.parse(item.valueData));
                                }

                                return true;
                            }
                        }),
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, groupName });
            };
            funcs.additionalActionColumnButtons = () => ({
                editSetting: (item) => {
                    return (
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setDetail(item);
                                if (item?.isSlider) {
                                    setIsEditing(true);
                                    handlersSliderModal.open();
                                } else if (item?.keyName === 'introduce') {
                                    handlersIntroduceModal.open();
                                } else {
                                    handlersGeneralModal.open();
                                }
                            }}
                        >
                            <EditOutlined />
                        </Button>
                    );
                },
                delete: (item) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteSlider(item);
                        }}
                    >
                        <DeleteOutlined />
                    </Button>
                ),
            });
        },
    });
    const deleteSlider = (item) => {
        const updateSliderData = sliderData.filter((obj) => obj.action !== item?.action);
        executeUpdate({
            data: {
                id: parentData.id,
                isSystem: parentData.isSystem,
                status: parentData.status,
                valueData: JSON.stringify(updateSliderData),
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    notification({
                        message: intl.formatMessage(messages.deleteSuccess),
                    });
                    executeLoading();
                    mixinFuncs.getList();
                }
            },
            onError: (err) => {},
        });
    };
    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên" />,
            dataIndex: 'keyName',
            width: 200,
        },
        {
            title: <FormattedMessage defaultMessage="Nội dung" />,
            dataIndex: 'valueData',
            render: (valueData, record) => {
                if (record?.keyName === 'introduce') {
                    const valueDataParseJson = JSON.parse(valueData);
                    return (
                        <div>
                            <span style={{ fontWeight: 600 }}>{valueDataParseJson?.title}</span>
                            <p>{valueDataParseJson?.message}</p>
                        </div>
                    );
                } else {
                    return <div>{valueData}</div>;
                }
            },
        },
        mixinFuncs.renderActionColumn({ editSetting: true, delete: false }, { width: '120px' }),
    ];
    const columnsSlider = [
        {
            title: '#',
            dataIndex: 'imageUrl',
            align: 'center',
            width: '100px',
            render: (imageUrl) => (
                <Avatar
                    style={{ width: '100%', height: '60px' }}
                    size="large"
                    shape="square"
                    icon={<UserOutlined />}
                    src={imageUrl ? `${AppConstants.contentRootUrl}${imageUrl}` : null}
                />
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Tiêu đề" />,
            dataIndex: 'title',
            width: '420px',
        },

        mixinFuncs.renderActionColumn({ editSetting: true, delete: true }, { width: '60px' }),
    ];
    const { execute: executeUpdate } = useFetch(apiConfig.settings.update, { immediate: false });
    const {
        data: listSetting,
        loading: dataLoading,
        execute: executeLoading,
    } = useFetch(apiConfig.settings.getList, {
        immediate: false,
        mappingData: (response) => {
            if (response.result === true) {
                return {
                    data: response.data.content.filter((item) => {
                        if (item.keyName === 'slider') {
                            setSliderData(JSON.parse(item.valueData));
                            return false;
                        }
                        return true;
                    }),
                };
            }
        },
    });
    const handleCloseSliderModal = () => {
        setIsEditing(false);
        handlersSliderModal.close();
    };

    return (
        <div>
            <Card>
                <BaseTable
                    onChange={mixinFuncs.changePagination}
                    columns={columns}
                    dataSource={listSetting ? listSetting?.data : data}
                    loading={loading || dataLoading}
                    pagination={pagination}
                />
            </Card>
            <Card style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ marginTop: '10px', fontSize: '20px' }}>{intl.formatMessage(messages.slider)}</span>
                    <Button
                        type="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(false);
                            handlersSliderModal.open();
                        }}
                    >
                        {intl.formatMessage(messages.createNew)}
                    </Button>
                </div>
                <BaseTable
                    onChange={mixinFuncs.changePagination}
                    columns={columnsSlider}
                    dataSource={sliderData.length > 0 ? sliderData : []}
                    loading={loading}
                    pagination={pagination}
                />
            </Card>
            <EditGenralModal
                open={openedGeneralModal}
                onCancel={() => handlersGeneralModal.close()}
                data={detail || {}}
                executeUpdate={executeUpdate}
                executeLoading={executeLoading}
            />
            <IntroduceModal
                open={openedIntroduceModal}
                onCancel={() => handlersIntroduceModal.close()}
                introduceData={introduceData}
                data={detail || {}}
                executeUpdate={executeUpdate}
                executeLoading={executeLoading}
            />
            <SliderModal
                open={openedSliderModal}
                onCancel={handleCloseSliderModal}
                data={detail || {}}
                reload={mixinFuncs.getList}
                sliderData={sliderData}
                parentData={parentData}
                executeUpdate={executeUpdate}
                executeLoading={executeLoading}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
            />
        </div>
    );
};

export default GeneralSettingPage;
