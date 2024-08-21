import { takeEvery, takeLatest, take, call, fork, put } from "redux-saga/effects";
import * as actions from '../actions/users';
import * as api from '../api/users';

function* getUsers(){
    try {
        const result = yield call(api.getUsers);
        yield put(actions.getUserSuccess({
            items: result.data.data
        }));
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error when trying get the users'
        }));
    }
}

function* createUser(action){
    try {
        console.log(action);
        
        // yield call(api.createUser, {firstName: action.payload, lastName: action.payload})
        // yield call(getUsers);
    } catch (e) {
        yield put(actions.usersSuccess({
            // error: 'An error occurred when trying to create the user'
            success: 'You have successfully created'
        }));
    }
}

function* watchGetUsersRequest(){
    yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers);
}

function* watchCreateUserRequest(){
    yield takeLatest(actions.Types.CREATE_USER_REQUEST, createUser);
}

function* updateUser(action) {
    try {
        //     yield call(api.updateUser, action.payload.userId, {
        //     firstName: action.payload.firstName,
        //     lastName: action.payload.lastName
        // });
        // const updatedUser = yield call(api.getUsers, action.payload.userId);
        // yield put(actions.usersSuccess({ success: 'User updated successfully' }));
        // yield put(actions.updateUserRequest({ userId: updatedUser.id, firstName: updatedUser.firstName, lastName: updatedUser.lastName })); 
    } catch (e) {
        // Handle error...
    }
}


function* watchUpdateUserRequest(){
    yield takeLatest(actions.Types.UPDATE_USER_REQUEST, updateUser)
}

function* deleteUser({userId}){
    try {
        // yield call(api.deleteUser, userId)
        // yield call(getUsers);
    } catch (e) {
        yield put(actions.usersSuccess({
            success: 'You have successfully deleted the user'
        }));
    }
}

function* watchDeleteUserRequest(){
    while(true){
        const action = yield take(actions.Types.DELETE_USER_REQUEST);
        yield call(deleteUser, {
            userId: action.payload.userId
        });
    }
}

const usersSagas = [
    fork(watchGetUsersRequest),
    fork(watchCreateUserRequest),
    fork(watchUpdateUserRequest),
    fork(watchDeleteUserRequest),
];


export default usersSagas;