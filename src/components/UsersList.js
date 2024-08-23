import { Button, List, Modal, Input, Form } from "antd";
import { useId, useState } from "react";

const UsersList = ({ users, onDeleteUser, onEditUser }) => {

    const useModal = (initial = false) => {
        const[open, setOpen] = useState(initial);
        const handle = {
            open: () => setOpen(true),
            close: () => setOpen(false)
        }
        return [open, handle];
    }


    const [open, handleShow] = useModal(false);
    const [openEdit, handleEditModal] = useModal(false);
    const [deleteInModal, setDeleteInModal] = useState(null);
    const [editInModal, setEditInModal] = useState(null);
    const [editForm] = Form.useForm();

    const showModal = (userId) => {
        setDeleteInModal(userId);
        handleShow.open();
    };

    const hideModal = () => {
        setDeleteInModal(null);
        handleShow.close();
    };

    const handleDelete = (user) => {
        if (deleteInModal) {
            onDeleteUser({
                ...deleteInModal,
                // // user: user.id,
                // firstName: user.firstName,
                // lastName: user.lastName,
            });
            hideModal();
        }
    };

    const showEditModal = (user) => {
        setEditInModal(user);
        handleEditModal.open();
        editForm.setFieldsValue(user);
    };

    const hideEditModal = () => {
        setEditInModal(null);
        handleEditModal.close();
    };

    const handleEdit = (values) => {
        if (editInModal) {
            onEditUser({
                ...editInModal,
                firstName: values.firstName,
                lastName: values.lastName,
            });
            hideEditModal();
        }
    };
    

    return (
        <>
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
                                    
                                </div>

                                <div style={{ marginRight: '5px' }}>
                                    <Button type="primary" onClick={() => showEditModal(user)}>
                                        Edit
                                    </Button>
                                    
                                </div>
                            </section>
                        </List.Item>
                    );
                })}
            </List>


             <Modal
                title="Bạn có chắc chắn muốn xóa không?"
                open={open}
                onOk={() => {
                    handleDelete();
                    onDeleteUser();
                    hideModal();
                }}
                onCancel={hideModal}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
            </Modal>

            <Modal
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
        </>
        
    );
};

export default UsersList;

