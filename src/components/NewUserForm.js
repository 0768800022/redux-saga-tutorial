import React, {Component} from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

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
        e.preventDefault();

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
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label>
                        FirstName
                    </Label>
                    <Input 
                        required
                        placeholder="First Name" 
                        onChange={this.handleFirstNameChange}
                        value={this.state.firstName}/>
                </FormGroup>
                <FormGroup>
                    <Label>
                        LastName
                    </Label>
                    <Input 
                        required
                        placeholder="Last Name" 
                        onChange={this.handleLastNameChange} 
                        value={this.state.lastName}/>
                </FormGroup>
                <FormGroup>
                    <Button block outline type="submit" color="primary">
                        Create
                    </Button>
                </FormGroup>
            </Form>        
        )
    }
}

export default NewUserForm;