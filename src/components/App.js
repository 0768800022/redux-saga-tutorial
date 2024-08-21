import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserRequest, createUserRequest, deleteUserRequest, usersSuccess, usersError } from '../actions/users';
import UsersList from './UsersList';
import NewUserForm from './NewUserForm';
import { Alert } from 'antd';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.props.getUserRequest();
  }

  handleSubmit = ({firstName, lastName}) => {
    this.props.createUserRequest({
      firstName,
      lastName
    });
  };

  handleDeleteUserClick = (userId) => {
    this.props.deleteUserRequest(userId)
  };

  handleCloseAlert = () => {
    this.props.usersSuccess({
      success: ''
    });
  };

  render() {
    const users = this.props.users;
    return (
      <div style={{margin: '0 auto', padding: '20px', maxWidth: '600px'}}>
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
        <NewUserForm onSubmit={this.handleSubmit}/>
        <UsersList onDeleteUser={this.handleDeleteUserClick} users={users.items}/>
      </div>
    );
  }
}

export default connect(({users}) => ({users}), {
  getUserRequest,
  createUserRequest,
  deleteUserRequest,
  usersSuccess,
  usersError
})(App);

