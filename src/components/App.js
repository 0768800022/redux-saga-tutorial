import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserRequest, createUserRequest } from '../actions/users';
import UsersList from './UsersList';
import NewUserForm from './NewUserForm';

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
    
  };

  render() {
    const users = this.props.users;
    return (
      
      <div style={{margin: '0 auto', padding: '20px', maxWidth: '600px'}}>
        <NewUserForm onSubmit={this.handleSubmit}/>
        <UsersList onDeleteUser={this.handleDeleteUserClick} users={users.items}/>
      </div>
    );
  }
}

export default connect(({users}) => ({users}), {
  getUserRequest,
  createUserRequest
})(App);
