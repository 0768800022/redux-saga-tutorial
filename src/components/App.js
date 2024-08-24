import { useDispatch, useSelector } from 'react-redux';
import { getUserRequest, createUserRequest, updateUserRequest, deleteUserRequest, usersSuccess, usersError } from '../actions/users';
import UsersList from './UsersList';
import NewUserForm from './NewUserForm';
import * as api from '../api/users';
import { Alert } from 'antd';
import { useState, useEffect } from 'react';

function App() {

    const dispatch = useDispatch();
    // const users = useSelector(state => state.users); //lấy state users từ redux store
    const [listUsers, setListUsers] = useState([]); //biến res -> data của axios -> data của api trả về

    const fetchUsers = async () => {
      try {
        const res = await api.getUsers();
        setListUsers(res.data.data);
      } catch (e) {
        
      }
    };
  
    useEffect(() => {
      dispatch(getUserRequest());

      fetchUsers(); // Gọi hàm để get List
    }, [dispatch]);


    // const getUser = async () => {
    //     let res = await getUsers();
    //     console.log("check", res);  
    // }

    // useEffect(() => {
    //   dispatch(getUserRequest());
    //   // getUser();
    // }, [dispatch])

    const handleSubmit = ({firstName, lastName}) => {
      dispatch(createUserRequest({ firstName, lastName}));
    };

    const handleUpdateUser = (updatedUser) => {
      console.log("Update check", updatedUser);
      
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
        {listUsers.success && (
          <Alert
            message="Success"
            description={listUsers.success}
            type="success"
            showIcon
            closable
            onClose={handleCloseAlert}
          />
        )}
        <NewUserForm onSubmit={handleSubmit}/>
        <UsersList onEditUser={handleUpdateUser} onDeleteUser={handleDeleteUserClick} listUsers={listUsers.items}/>
      </div>
    );
}

export default App;