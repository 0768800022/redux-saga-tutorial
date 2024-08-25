import { useState, useEffect } from 'react';
import * as api from './users';
import axios from 'axios';
import { Api } from './apiConfig';
import { useNavigate } from 'react-router-dom';


const useListPage = (apiConfig, onDeleteUser) => {
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState('');

    const useModal = (initial = false) => {
        const[open, setOpen] = useState(initial);
        const handle = {
            open: () => setOpen(true),
            close: () => setOpen(false)
        }
        return [open, handle];
    }

    const [deleteInModal, setDeleteInModal] = useState(null);
    const [open, handleShow] = useModal(false);

    const User = Api.user;
    const News = Api.news;

    const fetchData = async () => {
        try {
            const res = await api.getUsers();
            setData(res.data.data);
        } catch (e) {
        }
    };

    useEffect(() => {
        fetchData();
    }, [apiConfig]);
    
    const navigate = useNavigate();
    const handleConvert = (listUser) => {
        navigate(`/users/edit/${listUser.id}`, {state: {user: listUser}});
    }

    const handleSubmit = ({ firstName, lastName }) => {
        return axios.post(User.create.url, { firstName, lastName })
            .then(() => {
                fetchData(); 
            })
            .catch((e) => {
            });
    };
    
    
    const handleDelete = (userId) => {
        return axios.delete(User.delete(userId).url)
            .then(() => {
                fetchData(); 
            })
            .catch((e) => {
            });
    };

    const handleDeleteModal = async () => {
        if (deleteInModal) {
            try {
                onDeleteUser({
                    ...deleteInModal,
                });
                hideModal();
            } catch (e) {
                
            }
        }
    };
    
    // const [editInModal, setEditInModal] = useState(null);
    // const handleEdit = (values) => {
    //     console.log("Get User", values)
    //     if (editInModal) {
    //         onEditUser({
    //             ...editInModal,
    //             firstName: values.firstName,
    //             lastName: values.lastName,
                
    //         });
    //     }
    // };

    
    
    const showModal = (userId) => {
        setDeleteInModal(userId);
        handleShow.open();
    };
    
    const hideModal = () => {
        setDeleteInModal(null);
        handleShow.close();
    };

    const handleCloseAlert = () => {
        setSuccess('');
    };
    return {
        data,
        handleSubmit,
        handleDelete,
        handleDeleteModal,
        handleCloseAlert,
        handleConvert,
        showModal,
        hideModal,
        success,
    };
};

export default useListPage;



