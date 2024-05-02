import apiConfig from '@constants/apiConfig';
import React, { useEffect, useState } from 'react';

import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { apiTenantId, envType, storageKeys } from '@constants';
import useFetch from '@hooks/useFetch';
import useQueryParams from '@hooks/useQueryParams';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { getData, setData } from '@utils/localStorage';
import { Tabs, notification } from 'antd';
import { defineMessages } from 'react-intl';
import ProjectLeaderTaskListPage from './projectDevelopStory';
import ProjectCategoryListPage from './projectCategory';
import ProjectLeaderMemberListPage from './projectLeaderMember';

const message = defineMessages({
    objectName: 'setting',
});
const ProjectDevelopTabPage = () => {
    const translate = useTranslate();
    const { params: queryParams, setQueryParams, serializeParams, deserializeParams } = useQueryParams();
    const projectName = queryParams.get('projectName');
    const [searchFilter, setSearchFilter] = useState([]);
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem(routes.projectTabPage.keyActiveTab)
            ? localStorage.getItem(routes.projectTabPage.keyActiveTab)
            : translate.formatMessage(commonMessage.story),
    );
    const projectId = queryParams.get('projectId');

    const { execute: executeGetTokenProject } = useFetch(apiConfig.project.getTokenForProject, {
        immediate: false,
    });
    const tenantIdUrl = envType !== 'dev' && window.location.href.split('.')[0].split('//')[1].split('-')[0];
    const tenantId = envType === 'dev' ? apiTenantId : tenantIdUrl;
    useEffect(() => {
        executeGetTokenProject({
            data: {
              
                projectId: projectId,
                tenantId : tenantId,
            },
            onCompleted: (res) => {
            
                setData(storageKeys?.USER_PROJECT_ACCESS_TOKEN,res?.data?.access_token);
             
            },
        });
    }, []);
    const userTokenProject = getData(storageKeys.USER_PROJECT_ACCESS_TOKEN);
    
    const dataTab = [
        {
            label: translate.formatMessage(commonMessage.story),
            key: translate.formatMessage(commonMessage.story),
            children: <ProjectLeaderTaskListPage setSearchFilter={setSearchFilter} />,
        },
        // {
        //     label: translate.formatMessage(commonMessage.team),
        //     key: translate.formatMessage(commonMessage.team),
        //     children: <TeamListPage setSearchFilter={setSearchFilter} />,
        // },
        {
            label: translate.formatMessage(commonMessage.member),
            key: translate.formatMessage(commonMessage.member),
            children: <ProjectLeaderMemberListPage setSearchFilter={setSearchFilter} />,
        },
        // {
        //     label: translate.formatMessage(commonMessage.projectCategory),
        //     key: translate.formatMessage(commonMessage.projectCategory),
        //     children: <ProjectCategoryListPage setSearchFilter={setSearchFilter} />,
        // },
    ];

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.project),
            path: routes.projectLeaderListPage.path,
        },
        {
            breadcrumbName: translate.formatMessage(commonMessage.generalManage),
        },
    ];

    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                title={<div style={{ fontWeight: 'normal' }}>{projectName}</div>}
                baseTable={
                    <Tabs
                        style={{ marginTop: 20 }}
                        type="card"
                        onTabClick={(key) => {
                            setActiveTab(key);
                            localStorage.setItem(routes.projectTabPage.keyActiveTab, key);
                        }}
                        activeKey={activeTab}
                        items={dataTab.map((item) => {
                            return {
                                label: item.label,
                                key: item.key,
                                children: item.children,
                            };
                        })}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ProjectDevelopTabPage;
