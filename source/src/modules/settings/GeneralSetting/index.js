import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { Button,Avatar } from 'antd';
import React, { useState,useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { EditOutlined } from '@ant-design/icons';
import EditGenralModal from './EditGenralModal';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import { UserOutlined } from '@ant-design/icons';
import { AppConstants } from '@constants';

const message = defineMessages({
    objectName: 'Cài đặt chung',
    home: 'Trang chủ',
});
const GeneralSettingPage = ({ groupName }) => {
    const translate = useTranslate();
    const [sliderData, setSlider] = useState({});
    const [openedEdit, handlersEdit] = useDisclosure(false);
    const [detail, setDetail] = useState();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.settings,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content.filter((item) => {
                            if (item.keyName === 'slider') {
                                setSlider(JSON.parse(item.valueData));
                                return false;
                            }

                            // if (item.keyName === 'introduce') {
                            //     return false;
                            // }

                            return true;
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
                editSetting: (item) => (
                    <Button
                        type="link"
                        style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDetail(item);
                            handlersEdit.open();
                        }}
                    >
                        <EditOutlined />
                    </Button>
                ),
            });
        },
    });
    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên" />,
            dataIndex: 'keyName',
            width: 200,
        },
        {
            title: <FormattedMessage defaultMessage="Giá trị" />,
            dataIndex: 'valueData',
        },
        mixinFuncs.renderActionColumn({ editSetting: true, delete: false }, { width: '120px' }),
    ];
    const columnsSlider = [
        {
            title: '#',
            dataIndex: 'imageUrl',
            align: 'center',
            width: 80,
            render: (imageUrl) => (
                <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    src={imageUrl ? `${AppConstants.contentRootUrl}${imageUrl}` : null}
                />
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Tiêu đề" />,
            dataIndex: 'title',
            width: 200,
        },
        {
            title: <FormattedMessage defaultMessage="Mô tả ngắn" />,
            dataIndex: 'shortDescription',
        },
        {
            title: <FormattedMessage defaultMessage="Đường dẫn" />,
            dataIndex: 'targetUrl',
        },
        mixinFuncs.renderActionColumn({ editSetting: true, delete: true }, { width: '120px' }),
    ];
    const { execute: executeUpdate } = useFetch(apiConfig.settings.update,{ immediate: false });
    const {
        data: listSetting,
        loading: dataLoading,
        execute: executeLoading,
    } = useFetch(apiConfig.settings.getList, {
        immediate: false,
        mappingData : (response) => {
            if (response.result === true) {
                console.log(response.data.content);
                return {
                    data: response.data.content.filter((item) => {
                        if (item.keyName === 'slider') {
                            setSlider(JSON.parse(item.valueData));
                            return false;
                        }
                        return true;
                    }),        
                };
            }
        },
    });
    return (
        <div>
            <BaseTable
                onChange={mixinFuncs.changePagination}
                columns={columns}
                dataSource={listSetting ? listSetting?.data : data}
                loading={loading ||dataLoading}
                pagination={pagination}
            />
            <BaseTable
                onChange={mixinFuncs.changePagination}
                columns={columnsSlider}
                dataSource={sliderData.length > 0 ? sliderData : []}
                loading={loading}
                pagination={pagination}
            />
            <EditGenralModal open={openedEdit} onCancel={() => handlersEdit.close()} data={detail || {}} executeUpdate={executeUpdate} executeLoading={executeLoading} />
        </div>
    );
};

export default GeneralSettingPage;
