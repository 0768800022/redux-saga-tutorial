import { useState, useEffect } from 'react';
import * as api from './users';
import axios from 'axios';
import { Api } from './apiConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const useSavePage = (apiConfig) => {
    const [data, setData] = useState([]);

    const navigate = useNavigate();
    const { state } = useLocation();
    const User = Api.user;
    const News = Api.news;
    const isEditMode = !!state?.user; //xem state.user có tồn tại kh

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
            
    };
    
    const handleUpdate = (updatedUser) => {
        return axios.put(User.update(updatedUser.id).url, updatedUser)
            .then((response) => {
                return response.data;
            });
    };
    
    const handleCreate = (values) => {
        console.log("Created User:", values);
        handleSubmit(values)
            .then(() => {
                notification.success({
                    message: 'Success',
                    description: 'Created Successfully!',
                });
                navigate('/users')
            })
            .catch(e => {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update user.',
                });
            })
    };

    const onFinish = (values) => {
        if (isEditMode) {
            const updatedUser = { id: state.user.id, ...values };//lấy id và các giá trị còn lại
            console.log("Updated User:", updatedUser); 
            handleUpdate(updatedUser)
                .then(() => {
                    notification.success({
                        message: 'Success',
                        description: 'Updated Successfully!',
                    });

                    navigate('/users')
                })
                .catch((e) => {
                    notification.error({
                        message: 'Error',
                        description: 'Failed to update user.',
                    });
                })
        } else {
            console.log("eeee");
        }
    };
    
    return {
        data,
        handleSubmit,
        handleUpdate,
        handleCreate,
        onFinish,
    };
};

export default useSavePage;
