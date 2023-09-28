import useValidatePermission from '@hooks/useValidatePermission';
import { validatePermission } from '@utils';


function HasPermission({ children, requiredPermissions, requiredKind, onValidate = validatePermission, fallback = null }) {
    const validate = useValidatePermission();

    return validate(requiredPermissions, requiredKind, onValidate) ? children : fallback;
}

export default HasPermission;
