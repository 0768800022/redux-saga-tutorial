import { connect } from 'react-redux';
import { getUserRequest, createUserRequest, updateUserRequest, deleteUserRequest, usersSuccess, usersError } from '../actions/users';
import UsersList from './UsersList';
import NewUserForm from './NewUserForm';
import { Alert } from 'antd';
import { useEffect } from 'react';


function App({users, getUserRequest, createUserRequest, updateUserRequest, deleteUserRequest, usersSuccess, usersError}) {

  useEffect(() => {
    getUserRequest();
  }, [getUserRequest])

  const handleSubmit = ({firstName, lastName}) => {
    createUserRequest({ firstName, lastName});
  };

  const handleUpdateUser = (updatedUser) => {
    updateUserRequest(updatedUser);
  }


  const handleDeleteUserClick = (userId) => {
    deleteUserRequest(userId)
  };

  const handleCloseAlert = () => {
    usersSuccess({ success: ''});
  };

    return (
      <div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
        {users.success && (
          <Alert
            message="Success"
            description={users.success}
            type="success"
            showIcon
            closable
            onClose={handleCloseAlert}
          />
        )}
        <NewUserForm onSubmit={handleSubmit}/>
        <UsersList onEditUser={handleUpdateUser} onDeleteUser={handleDeleteUserClick} users={users.items}/>
      </div>
    );
}

export default connect(({ users }) => ({ users }), {
  getUserRequest,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest,
  usersSuccess,
  usersError
})(App);
