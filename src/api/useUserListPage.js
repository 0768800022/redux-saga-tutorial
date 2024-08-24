import { useState, useEffect } from 'react';
import * as api from './users';
import axios from 'axios';

const useUserListPage = (apiConfig) => {
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState('');

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
        axios.post(apiConfig.Api, { firstName, lastName })
            .then(() => {
                fetchData(); 
            })
            .catch((e) => {
            });
    };
    
    const handleUpdateUser = (updatedUser) => {
        axios.put(`${apiConfig.Api}/users/${updatedUser.id}`, updatedUser)
            .then(() => {
                fetchData(); 
            })
            .catch((e) => {
            });
    };
    
    const handleDeleteUserClick = (userId) => {
        axios.delete(`${apiConfig.Api}/users/${userId}`)
            .then(() => {
                fetchData(); 
            })
            .catch((e) => {
            });
    };
    
    const handleCloseAlert = () => {
        setSuccess('');
    };
    return {
        data,
        handleSubmit,
        handleUpdateUser,
        handleDeleteUserClick,
        handleCloseAlert,
        success,
    };
};

export default useUserListPage;
