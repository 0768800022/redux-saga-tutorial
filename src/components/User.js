import React from 'react';
import { Alert } from 'antd';
import NewUserForm from './NewUserForm';
import UsersList from './UsersList';
import { Api } from '../api/apiConfig';
import useListPage from "../api/useListPage";

function User() {
    
    const {data,
        handleSubmit,
        handleUpdateUser,
        handleDeleteUserClick,
        handleCloseAlert,
        success
     } = useListPage(Api.user);
    
    return ( 
        <div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
        {success && (
          <Alert
            message="Success"
            description={success}
            type="success"
            showIcon
            closable
            onClose={handleCloseAlert}
          />
        )}
        <NewUserForm onSubmit={handleSubmit}/>
        <UsersList onEditUser={handleUpdateUser} onDeleteUser={handleDeleteUserClick} listUsers={data.items}/>
      </div>
     );
}

export default User;