import { useState, useEffect } from 'react';
import * as api from './users';
import axios from 'axios';
import { Api } from './apiConfig';


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
        return axios.post(Api.user.create.url, { firstName, lastName })
            .then(() => {
                fetchData(); 
            })
            .catch((e) => {
            });
    };
    
    
    const handleDelete = (userId) => {
        return axios.delete(Api.user.delete(userId).url)
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
        handleDelete,
        handleCloseAlert,
        success,
    };
};

export default useListPage;



