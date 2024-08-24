import { Alert } from 'antd';
import NewUserForm from './NewUserForm';
import UsersList from './UsersList';

function User({ data, handleSubmit, handleUpdateUser, handleDeleteUserClick, handleCloseAlert, success }) {
    return ( 
        <div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
        {data.success && (
          <Alert
            message="Success"
            description={data.success}
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