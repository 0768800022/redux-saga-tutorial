export const Types = {
    GET_USERS_REQUEST: 'users/get_users_request',
    GET_USERS_SUCCESS: 'users/get_users_success',
    CREATE_USER_REQUEST: 'users/create_user_request',
    UPDATE_USER_REQUEST: 'users/update_user_request',
    DELETE_USER_REQUEST: 'users/delete_user_request',
    USERS_SUCESS: 'users/user_success',
    USERS_ERROR: 'users/user_error',
}

export const getUserRequest = () => ({
    type: Types.GET_USERS_REQUEST
});

export const getUserSuccess = ({items}) => ({
    type: Types.GET_USERS_SUCCESS,
    payload: {
        items
    }
});

export const createUserRequest = ({firstName, lastName}) => ({
    type: Types.CREATE_USER_REQUEST,
    payload: {
        firstName,
        lastName,
    }
});

export const updateUserRequest = (userId, {firstName, lastName}) => ({
    type: Types.UPDATE_USER_REQUEST,
    payload: {
        userId,
        firstName,
        lastName,
    }
})

export const deleteUserRequest = (userId) => ({
    type: Types.DELETE_USER_REQUEST,
    payload: {
        userId
    }
});

export const usersSuccess = ({success}) => ({
    type: Types.USERS_SUCESS,
    payload: {
        success
    }
})

export const usersError = ({error}) => ({
    type: Types.USERS_ERROR,
    payload: {
        error
    }
})