import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants/index';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Tag, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DATE_DISPLAY_FORMAT, DATE_FORMAT_DISPLAY } from '@constants';
import { formatMoney } from '@utils/index';
import { statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import { useState } from 'react';
import { useEffect } from 'react';
import useFetch from '@hooks/useFetch';
import { render } from '@testing-library/react';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const message = defineMessages({
    objectName: 'Yêu cầu công ty',
});

const CompanyRequestListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const companyId = queryParameters.get('companyId');
    const [companyOptions, setCompanyOptions] = useState([]);
    const navigate = useNavigate();
    // const companyOptions =[];
    // const companyValues = translate.formatKeys(companyOptions, ['label']);
    // console.log(companyOptions);

    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.companyRequest,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getCreateLink = () => {
                if (companyId !== null) {
                    return `${pagePath}/create?companyId=${companyId}`;
                }
                return `${pagePath}/create`;
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (item) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(mixinFuncs.getItemDetailLink(item), {
                                state: { action: 'edit', prevPath: location.pathname, data: companyRequests },
                            });
                        }}
                    >
                        <EditOutlined />
                    </Button>
                ),
            });
        },

    });
    const {
        data: companyRequests,
        // loading: getcompanyRequestLoading,
        execute: executescompanyRequests,
    } = useFetch(apiConfig.companyRequest.autocomplete, {
        immediate: true,
    });
    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên công ty" />,
            dataIndex: ['company', 'companyName'],
        },
        {
            title: <FormattedMessage defaultMessage="Số lượng công việc" />,
            dataIndex: ['numberCv'],
            align: 'center',
        },
        {
            title: <FormattedMessage defaultMessage="Mô tả ngắn" />,
            dataIndex: ['shortDescription'],
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 140,
            align: 'center',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'dueDate',
            width: 140,
            align: 'center',
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'companyId',
            placeholder: translate.formatMessage(commonMessage.companyRequest),
            type: FieldTypes.SELECT,
            options: companyOptions,

        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];
    const {
        data: companys,
        // loading: getcompanyLoading,
        execute: executescompanys,
    } = useFetch(apiConfig.company.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({
            value: item.id,
            label: item.companyName,
        })),
    });

    useEffect(() => {
        // Kiểm tra xem có dữ liệu trong companys không và không phải là trạng thái loading
        if (companys) {
            setCompanyOptions(companys);
        }
        else { console.log("No data"); }
    }, [companys]);

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.companyRequest) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};
export default CompanyRequestListPage;
