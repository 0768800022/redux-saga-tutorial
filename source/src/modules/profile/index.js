import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import useSaveBase from '@hooks/useSaveBase';
import { accountActions } from '@store/actions';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProfileForm from './ProfileForm';
import useAuth from '@hooks/useAuth';
import { UserTypes } from '@constants';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const messages = defineMessages({
    home: 'Home',
    profile: 'Profile',
});

const ProfilePage = () => {
    const { profile } = useAuth();
    const isAdmin = profile.kind === UserTypes.ADMIN;
    const translate = useTranslate();

    const { data, loading } = useFetch(apiConfig[isAdmin ? 'account' : 'organize'].getProfile, {
        immediate: true,
        mappingData: (res) => res.data,
    });
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile);
    const { mixinFuncs, onSave, setIsChangedFormValues, isEditing } = useSaveBase({
        options: {
            getListUrl: `/`,
            objectName: translate.formatMessage(messages.profile),
        },
        apiConfig: {
            getById: apiConfig[isAdmin ? 'account' : 'organize'].getProfile,
            update: apiConfig[isAdmin ? 'account' : 'organize'].updateProfile,
        },
        override: (funcs) => {
            const onSaveCompleted = funcs.onSaveCompleted;

            funcs.onSaveCompleted = (response) => {
                onSaveCompleted(response);
                executeGetProfile();
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                { breadcrumbName: translate.formatMessage(messages.profile) },
            ]}
        >
            <ProfileForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={data ? data : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                isAdmin={isAdmin}
            />
        </PageWrapper>
    );
};

export default ProfilePage;