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
        // console.log(action);
        // yield call(api.createUser, {firstName: action.payload, lastName: action.payload})
        // yield call(getUsers);
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to create the user'
        }));
    }
}

function* watchGetUsersRequest(){
    yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers);
}

function* watchCreateUserRequest(){
    yield takeLatest(actions.Types.CREATE_USER_REQUEST, createUser);
}

function* deleteUser({userId}){
    try {
        // yield call(api.deleteUser, userId)
        // yield call(getUsers);
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error when trying delete user'
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
    fork(watchDeleteUserRequest)
];


export default usersSagas;