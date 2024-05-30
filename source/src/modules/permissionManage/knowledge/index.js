import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useLocation } from 'react-router-dom';
const message = defineMessages({
    objectName: 'Loại',
    name: 'Tên',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
    home: 'Trang chủ',
    permission: 'Phân quyền kiến thức',
});

const KnowledgePermissionListPage = () => {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            // getList : apiConfig.student.getAllCourse,
            getList: apiConfig.knowledgePermission.getList,
            update: apiConfig.knowledgePermission.update,
            create: apiConfig.knowledgePermission.create,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            // funcs.getItemDetailLink = (dataRow) => {
            //     return `${pagePath}/${dataRow.id}?studentId=${stuId}`;
            // };
            funcs.getCreateLink = (dataRow) => {
                return `${pagePath}/create?knowledgeId=${dataRow?.knowledgeId}`;
            };
            // funcs.prepareGetListPathParams = () => {
            //     return {
            //         registrationId: registrationId,
            //     };
            // };
            // funcs.additionalActionColumnButtons = () => {
            //     return {
            //         deleteItem: (dataRow) => {
            //             if (!mixinFuncs.hasPermission(apiConfig.delete?.baseURL)) return null;
            //             return (
            //                 <Button
            //                     type="link"
            //                     onClick={(e) => {
            //                         e.stopPropagation();
            //                         mixinFuncs.showDeleteItemConfirm(dataRow.registration.id);
            //                     }}
            //                     style={{ padding: 0 }}
            //                 >
            //                     <DeleteOutlined style={{ color: 'red' }} />
            //                 </Button>
            //             );
            //         },
            //     };
            // };
        },
    });
    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(message.permission),
        });
        return breadRoutes;
    };
    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'categoryName',
        },
        {
            title: translate.formatMessage(message.createDate),
            dataIndex: 'createdDate',
            align: 'right',
            width: 180,
        },
        // {
        //     title: translate.formatMessage(message.status),
        //     dataIndex: 'status',
        //     align: 'center',
        //     width: 120,
        //     render(dataRow) {
        //         const status = statusValues.find((item) => item.value == dataRow);

        //         return <Tag color={status.color}>{status.label}</Tag>;
        //     },
        // },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    actionBar={mixinFuncs.renderActionBar()}
                    // searchForm={mixinFuncs.renderSearchForm({
                    //     fields: searchFields,
                    //     initialValues: queryFilter,
                    //     className: styles.search,
                    // })}
                    baseTable={
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    }
                />
            </div>
        </PageWrapper>
    );
};
export default KnowledgePermissionListPage;
