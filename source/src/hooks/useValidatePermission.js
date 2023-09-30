import { validatePermission } from '@utils';
import React, { useCallback } from 'react';
import useAuth from './useAuth';

function useValidatePermission() {
    const { permissions, kind } = useAuth();

    const hasPermission = useCallback((requiredPermissions, requiredKind, onValidate = validatePermission) => {
        const _onValidate = onValidate ?? validatePermission;
        return _onValidate(requiredPermissions, permissions, requiredKind, kind);
    }, [permissions, kind]);

    return hasPermission;
}

export default useValidatePermission;
