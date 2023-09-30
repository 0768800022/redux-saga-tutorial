import React from 'react';

import { UserTypes, accessRouteTypeEnum, storageKeys } from '@constants';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import routes from '.';
import PublicLayout from '@modules/main/PublicLayout';
import MainLayout from '@modules/main/MainLayout';
import useAuth from '@hooks/useAuth';
import PageUnauthorized from '@modules/unauthorized';
import HasPermission from '@components/common/elements/HasPermission';
import { validatePermission } from '@utils';
import { getData } from '@utils/localStorage';

const ValidateAccess = ({
    authRequire,
    component: Component,
    componentProps,
    isAuthenticated,
    permissions: routePermissions,
    onValidatePermissions,
    profile,
    layout,
}) => {
    const location = useLocation();

    const getRedirect = (authRequire) => {
        if (authRequire === accessRouteTypeEnum.NOT_LOGIN && isAuthenticated) {
            return routes.homePage.path;
        }

        if (authRequire === accessRouteTypeEnum.REQUIRE_LOGIN && !isAuthenticated) {
            return routes.loginPage.path;
        }

        return false;
    };

    const redirect = getRedirect(authRequire);

    if (redirect) {
        return <Navigate state={{ from: location }} key={redirect} to={redirect} replace />;
    }

    // currently, only support custom layout for authRequire route
    const Layout = authRequire ? layout || MainLayout : PublicLayout;

    return (
        <Layout>
            <HasPermission
                onValidate={onValidatePermissions}
                requiredPermissions={routePermissions}
                fallback={<PageUnauthorized />}
            >
                <Component {...(componentProps || {})}>
                    <Outlet />
                </Component>
            </HasPermission>
        </Layout>
    );
};

export default ValidateAccess;
