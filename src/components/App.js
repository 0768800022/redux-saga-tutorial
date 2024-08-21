import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserRequest, createUserRequest, updateUserRequest, deleteUserRequest, usersSuccess, usersError } from '../actions/users';
import UsersList from './UsersList';
import NewUserForm from './NewUserForm';
import { Alert } from 'antd';

class App extends Component {
  state = {
    editUserId: null,
    editUser: null
  };

  componentDidMount() {
    this.props.getUserRequest();
  }

  handleSubmit = (values) => {
    this.props.createUserRequest(values);
  };

  handleUpdateUser = (user) => {
    this.props.updateUserRequest({
        firstName: user.firstName,
        lastName: user.lastName
    });
    this.setState({ editUserId: null, editUser: null });
  };


  handleDeleteUserClick = (userId) => {
    this.props.deleteUserRequest(userId);
  };

  handleCloseAlert = () => {
    this.props.usersSuccess({
      success: ''
    });
  };

  showEditForm = (user) => {
    this.setState({ editUserId: user.id, editUser: user });
  };

  render() {
    const { users } = this.props;
    const { editUserId, editUser } = this.state;
    
    return (
      <div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
        {this.props.users.success && (
          <Alert
            message="Success"
            description={this.props.users.success}
            type="success"
            showIcon
            closable
            onClose={this.handleCloseAlert}
          />
        )}
        <NewUserForm
          onSubmit={editUserId ? this.handleUpdateUser : this.handleSubmit}
          userId={editUserId}
          initialValues={editUser}
        />
        <UsersList
          onDeleteUser={this.handleDeleteUserClick}
          onEditUser={this.showEditForm}
          users={users.items}
        />
      </div>
    );
  }
}

export default connect(({ users }) => ({ users }), {
  getUserRequest,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest,
  usersSuccess,
  usersError
})(App);
