import { Button, Popconfirm, List, Modal, Input, Form } from "antd";
import { Table } from "react-bootstrap";
import useListPage from "../api/useListPage";
import apiConfig from '../api/apiConfig';

const UsersList = () => {
    
    const {data, handleConvert, handleDeleteModal, hideModal, showModal} = useListPage(apiConfig.Api); 
    console.log("Check data", data);

    return (
        <>
            <List>
                {data.sort((a, b) => {
                    if (a.firstName > b.firstName) {
                        return 1;
                    } else if (a.firstName < b.firstName) {
                        return -1;
                    } else if (a.lastName > b.lastName) {
                        return 1;
                    } else if (a.lastName < b.lastName) {
                        return -1;
                    } else {
                        return 0;
                    }
                }).map((listUser) => {
                    return (
                        <List.Item key={listUser.id} >
                            <section style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                {/* <div style={{ flex: 1 }}>
                                    <span style={{ marginLeft: '5px' }}>{user.firstName}</span>
                                    <span style={{ marginLeft: '5px' }}>{user.lastName}</span>
                                </div> */}
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th></th>
                                        <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <td>{listUser.firstName}</td>
                                        <td>{listUser.lastName}</td>
                                        <td>
                                            <div style={{  }}>
                                                <Popconfirm
                                                    title="Xóa người dùng"
                                                    description="Bạn có chắc chắn muốn xóa người dùng này không?"
                                                    onConfirm={() => {
                                                        handleDeleteModal();
                                                        hideModal();
                                                    }}
                                                    onCancel={hideModal}
                                                    okText="Delete"
                                                    cancelText="Cancel"
                                                >
                                                    <Button type="primary" onClick={() => showModal(listUser.id)} danger>
                                                        Delete
                                                    </Button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ marginRight: '5px' }}>
                                                <Button type="primary" onClick={() => {handleConvert(listUser)}}>
                                                    Edit
                                                </Button>
                                            </div>
                                        </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </section>
                        </List.Item>
                    );
                })}
            </List>
        </> 
    );
};

export default UsersList;






















{/* <Modal
                title="Chỉnh sửa thông tin người dùng"
                open={openEdit}
                onOk={() => editForm.submit()}
                onCancel={hideEditModal}
                okText="Save"
                cancelText="Cancel"
            >
                <Form form={editForm} layout="vertical" onFinish={handleEdit}>
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'Please input first name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Please input last name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal> 
            
            // const [openEdit, handleEditModal] = useModal(false);
            // const [editForm] = Form.useForm();
                
            */}