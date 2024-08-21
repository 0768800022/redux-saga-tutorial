import React, {Component} from "react";
import { Form, Button, Input} from 'antd';

class NewUserForm extends Component {

    state = {
        firstName: '',
        lastName: '',
    }

    handleFirstNameChange = e => {
        this.setState({
            firstName: e.target.value
        });
    }

    handleLastNameChange = e => {
        this.setState({
            lastName: e.target.value
        })
    }

    //xử lý dữ liệu form
    handleSubmit = e => {
        // e.preventDefault();

        this.props.onSubmit({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
        })

        this.setState({
            firstName: '',
            lastName: '',
        })
    }

    render() {
        return (
            <Form onFinish={this.handleSubmit}>
                <Form.Item label = "First Name" name = "firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
                    <Input 
                        required
                        placeholder="First Name" 
                        onChange={this.handleFirstNameChange}
                        value={this.state.firstName}/>
                </Form.Item>
                <Form.Item label = "Last Name" name = "lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
                    <Input 
                        required
                        placeholder="Last Name" 
                        onChange={this.handleLastNameChange} 
                        value={this.state.lastName}/>
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        {this.props.userId ? 'Update' : 'Create'}
                    </Button>
                </Form.Item>
            </Form>        
        )
    }
}

export default NewUserForm;


