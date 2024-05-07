import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import {
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import route from '@modules/projectManage/project/routes';
import { convertUtcToLocalTime } from '@utils';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
// import styles from './member.module.scss';
import { statusOptions } from '@constants/masterData';

import useListBase from '@hooks/useListBase';

const message = defineMessages({
    objectName: 'Danh mục',
    nameCategory: 'Tên danh mục ',
});

const ProjectCategoryListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.projectCategory,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            isProjectToken : true,
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    try {
                        if (response.result === true) {
                            return {
                                data: response.data.content,
                                total: response.data.totalElements,
                            };
                        }
                    } catch (error) {
                        return [];
                    }
                };
                funcs.getCreateLink = () => {
                    return `${pagePath}/create?projectId=${projectId}&projectName=${projectName}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    const pathDefault = `?projectId=${projectId}&projectName=${projectName}`;
                    return `${pagePath}/${dataRow.id}` + pathDefault;
                };
                funcs.changeFilter = (filter) => {
                    const projectId = queryParams.get('projectId');
                    const projectName = queryParams.get('projectName');

                    mixinFuncs.setQueryParams(
                        serializeParams({ projectId: projectId, projectName: projectName, ...filter }),
                    );
                };
            },
        });

    const setBreadRoutes = () => {
        const breadRoutes = [];

        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.project),
            path: route.projectLeaderListPage.path,
        });
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.projectCategory) });

        return breadRoutes;
    };

    const columns = [
        {
            title: translate.formatMessage(message.nameCategory),
            dataIndex: 'projectCategoryName',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 170,
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '150px' },
        ),
    ].filter(Boolean);
    // const { data: teamData } = useFetch(apiConfig.team.autocomplete, {
    //     immediate: true,
    //     params: { projectId },
    //     mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.teamName })),
    // });
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.nameCategory),
        },
    ];

    return (
        
        <ListPage
            title={<span style={{ fontWeight: 'normal', fontSize: '18px' }}>{projectName}</span>}
            searchForm={mixinFuncs.renderSearchForm({
                fields: searchFields,
                initialValues: queryFilter,
                // className: styles.search,
            })}
            actionBar={mixinFuncs.renderActionBar()}
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
       
    );
};

export default ProjectCategoryListPage;
