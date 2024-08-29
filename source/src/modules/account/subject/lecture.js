import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { convertUtcToLocalTime } from '@utils/index';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import route from '@modules/account/subject/routes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Tag, Avatar } from 'antd';
import { statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import { AppConstants } from '@constants';
import { CourseIcon } from '@assets/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import useBasicForm from '@hooks/useBasicForm';
import { BaseForm } from '@components/common/form/BaseForm';

const message = defineMessages({
    objectName: 'Bài giảng',
});

const LectureListPage = () => {
    const { id: subjectId } = useParams(); //truy cập thẳng tới tham số url
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: {
            ...apiConfig.lecture,
            getList: apiConfig.lecture.getBySubject,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        // override: (funcs) => {
        //     // funcs.prepareGetListPathParams = (response) => {
        //     //     if (response.result === true) {
        //     //         return {
        //     //             ...response.data.content,
        //     //             subjectId: response.data.content.id,
        //     //         };
        //     //     }
        //     // };

        //     funcs.prepareGetListPathParams = (params) => {
        //         console.log('Subject ID:', params.subjectId);
        //         return {
        //             subjectId: params.subjectId,
        //         };
        //         // const { subjectId, ...restParams } = params;
        //         // return {
        //         //     ...restParams,
        //         //     subjectId: subjectId,
        //         // };
        //     };
            
        //     funcs.mappingData = (response) => {
        //         try {
        //             if (response.result === true) {
        //                 SetAsignAll(response.data.content);
        //                 return {
        //                     data: response.data.content,
        //                     total: response.data.totalElements,
        //                 };
        //             }
        //         } catch (e) {
                    
        //         }
        //     };
        // },
        override: (funcs) => {
            funcs.prepareGetListPathParams = (params) => {
                return {
                    //...params,
                    subjectId: subjectId, 
                };
            };
            
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
        },
        
    });
    
    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên bài giảng" />,
            dataIndex: ['lectureName'],
            width: '50%',
        },
        
    ];

    const actionColumn = mixinFuncs.renderActionColumn(
        { edit: true, delete: true },
        { width: '120px' },
    );

    return (
        <PageWrapper routes={[
            { breadcrumbName: translate.formatMessage(commonMessage.lecture) },
        ]}> 
            <BaseForm>
                <ListPage actionBar={mixinFuncs.renderActionBar()}>
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={[...columns, actionColumn]}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                </ListPage>
            </BaseForm>
        </PageWrapper>
    );
};
export default LectureListPage;