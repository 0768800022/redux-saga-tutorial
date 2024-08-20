import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserRequest } from '../actions/users';
import UsersList from './UsersList';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.props.getUserRequest();
  }

  render() {
    const users = this.props.users;
    return (
      <div style={{margin: '0 auto', padding: '20px', maxWidth: '600px'}}>
        <UsersList users={users.items}/>
      </div>
    );
  }
}

export default connect(({users}) => ({users}), {
  getUserRequest
})(App);
