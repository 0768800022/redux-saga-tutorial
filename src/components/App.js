import { useDispatch, useSelector } from 'react-redux';
import { getUserRequest, createUserRequest, updateUserRequest, deleteUserRequest, usersSuccess, usersError } from '../actions/users';
import UsersList from './UsersList';
import NewUserForm from './NewUserForm';
import { Alert } from 'antd';
import { useEffect } from 'react';

function App() {

  const dispatch = useDispatch();
  const users = useSelector(state => state.users); //lấy state users từ redux store

    useEffect(() => {
      dispatch(getUserRequest());
    }, [dispatch])

    const handleSubmit = ({firstName, lastName}) => {
      dispatch(createUserRequest({ firstName, lastName}));
    };

    const handleUpdateUser = (updatedUser) => {
      dispatch(updateUserRequest(updatedUser));
    }


    const handleDeleteUserClick = (userId) => {
      dispatch(deleteUserRequest(userId));
    };

    const handleCloseAlert = () => {
      dispatch(usersSuccess({ success: ''}));
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

export default App;