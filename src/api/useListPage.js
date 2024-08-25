import { useState, useEffect } from 'react';
import * as api from './users';
import axios from 'axios';
import { Api } from './apiConfig';
import { useLocation, useNavigate } from 'react-router-dom';


const useListPage = (apiConfig) => {
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState('');
    const {pathname} = useLocation(); //lấy đường dẫn hiện tại
    const navigate = useNavigate();

    const handlePageChange = (listUser) => {
        const baseRoute = pathname.includes('/news') ? '/news' : '/users'; // Kiểm tra đường dẫn hiện tại
        const state = pathname.includes('/news') ? { news: listUser } : { user: listUser }; // Truyền dữ liệu tương ứng
        navigate(`${baseRoute}/edit/${listUser.id}`, { state });
    };

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
                await handleDelete(deleteInModal);
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
        handlePageChange,
        showModal,
        hideModal,
        success,
    };
};

export default useListPage;



