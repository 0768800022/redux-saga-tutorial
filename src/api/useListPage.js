import { useState, useEffect } from 'react';
import * as api from './users';
import axios from 'axios';

const useListPage = (apiConfig) => {
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState('');

    const fetchData = async () => {
        try {
            const res = await api.getUsers();
            setData(res.data.data);
        } catch (e) {
        }
    };
    //create update useSavePage khi nhấn create update thì chuyển về useListPage
    //delete edit chuyển trang là của useListPage
    useEffect(() => {
        fetchData();
    }, [apiConfig]);
    
    const handleSubmit = ({ firstName, lastName }) => {
        axios.post(apiConfig.create.url, { firstName, lastName })
            .then(() => {
                fetchData(); 
            })
            .catch((e) => {
            });
    };
    
    
    const handleUpdateUser = (updatedUser) => {
        axios.put(apiConfig.update(updatedUser.id).url, updatedUser)
            .then(() => {
                fetchData(); 
            })
            .catch((e) => {
            });
    };
    
    const handleDeleteUserClick = (userId) => {
        axios.delete(apiConfig.delete(userId).url)
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

export default useListPage;
