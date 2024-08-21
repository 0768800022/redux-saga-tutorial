import { Button, List, Modal, Input, Form } from "antd";
import React, { useState } from "react";

const UsersList = ({ users, onDeleteUser, onEditUser }) => {
    const [open, setOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteInModal, setDeleteInModal] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [form] = Form.useForm();

    const showModal = (userId) => {
        setDeleteInModal(userId);
        setOpen(true);
    };

    const hideModal = () => {
        setDeleteInModal(null);
        setOpen(false);
    };

    const handleDelete = () => {
        if (deleteInModal) {
            onDeleteUser(deleteInModal);
            hideModal();
        }
    };

    const showEditModal = (user) => {
        setEditUser(user);
        form.setFieldsValue({
            firstName: user.firstName,
            lastName: user.lastName,
        });
        setEditModalOpen(true);
    };

    const hideEditModal = () => {
        setEditUser(null);
        setEditModalOpen(false);
    };

    const handleEdit = (values) => {
        if (editUser) {
          onEditUser(editUser.id, values); 
          hideEditModal();
        }
      };
    

    return (
        <List>
            {users.sort((a, b) => {
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
            }).map((user) => {
                return (
                    <List.Item key={user.id} style={{ border: '1px solid #333', borderRadius: '20px' }}>
                        <section style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ marginLeft: '5px' }}>{user.firstName}</span>
                                <span style={{ marginLeft: '5px' }}>{user.lastName}</span>
                            </div>
                            <div style={{ marginRight: '5px' }}>
                                <Button type="primary" onClick={() => showModal(user.id)} danger>
                                    Delete
                                </Button>
                                <Modal
                                    title="Bạn có chắc chắn muốn xóa không?"
                                    open={open && deleteInModal === user.id}
                                    onOk={() => {
                                        handleDelete();
                                        onDeleteUser(user.id);
                                        hideModal();
                                    }}
                                    onCancel={hideModal}
                                    okText="Delete"
                                    cancelText="Cancel"
                                >
                                    <p>  </p>
                                </Modal>
                            </div>
                            <div style={{ marginRight: '5px' }}>
                                <Button type="primary" onClick={() => showEditModal(user)}>
                                    Edit
                                </Button>
                                <Modal
                                    title="Chỉnh sửa người dùng"
                                    open={editModalOpen && editUser?.id === user.id}
                                    onCancel={hideEditModal}
                                    footer={null}
                                >
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={handleEdit}
                                    >
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
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Save
                                            </Button>
                                            <Button onClick={hideEditModal} style={{ marginLeft: '10px' }}>
                                                Cancel
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                        </section>
                    </List.Item>
                );
            })}
        </List>
    );
};

export default UsersList;

