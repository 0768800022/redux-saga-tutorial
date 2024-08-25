import { useState, useEffect } from 'react';
import * as api from './users';
import axios from 'axios';
import { Api } from './apiConfig';

const useSavePage = (apiConfig) => {
    const [data, setData] = useState([]);

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
            
    };
    
    const handleUpdate = (updatedUser) => {
        return axios.put(Api.user.update(updatedUser.id).url, updatedUser)
            .then((response) => {
                return response.data;
            });
    };
    
    
    return {
        data,
        handleSubmit,
        handleUpdate,
    };
};

export default useSavePage;
