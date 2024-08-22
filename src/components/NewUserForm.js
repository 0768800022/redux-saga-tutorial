import { Form, Button, Input} from 'antd';
import { useState } from 'react';

function NewUserForm({onSubmit}) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
 
    const handleFirstNameChange = e => {
        setFirstName(e.target.value);
    }

    const handleLastNameChange = e => {
        setLastName(e.target.value);
    }

    //xử lý dữ liệu form
    const handleSubmit = e => {
        // e.preventDefault();
        onSubmit({
            firstName,
            lastName
        })

        setFirstName('');
        setLastName('');
    }

    return (
        <Form onFinish={handleSubmit}>
            <Form.Item label = "First Name" name = "firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
                <Input 
                    required
                    placeholder="First Name" 
                    onChange={handleFirstNameChange}
                    value={firstName}/>
            </Form.Item>
            <Form.Item label = "Last Name" name = "lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
                <Input 
                    required
                    placeholder="Last Name" 
                    onChange={handleLastNameChange} 
                    value={lastName}/>
            </Form.Item>
            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Create
                </Button>
            </Form.Item>
        </Form>     
    )   
}

export default NewUserForm;


