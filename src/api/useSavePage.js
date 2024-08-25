import { useState, useEffect } from 'react';
import * as api from './users';
import axios from 'axios';
import { Api } from './apiConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const useSavePage = (apiConfig) => {
    const [data, setData] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();//dùng khi liên quan đến vị trí hiện tại hoặc chuyển trang
    const { state } = location;
    const User = Api.user;
    const News = Api.news;
    const isEditMode = !!state?.user || !!state?.news; //xem state.user có tồn tại kh

    const Path = () => {
        if (location.pathname.startsWith('/users')) {
            //kiểm tra xem đường dẫn có bắt đầu là /users kh
            return '/users';
        } else if (location.pathname.startsWith('/news')) {
            return '/news';
        }
        return '/';
    };

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

    const onUpdate = (values) => {
        if (isEditMode) {
            // const updatedUser = { id: state.user.id, ...values };
            const updatedUser = { 
                id: state?.user?.id || state?.news?.id, 
                //dòng này nghĩa là nếu state.user.id tồn tại thì nó dùng 
                //còn kh thì dùng state.news.id 
                ...values 
            };
            
            console.log("Updated User:", updatedUser); 
            handleUpdate(updatedUser)
                .then(() => {
                    notification.success({
                        message: 'Success',
                        description: 'Updated Successfully!',
                    });
                    navigate(Path()); 
                })
                .catch((e) => {
                    notification.error({
                        message: 'Error',
                        description: 'Failed to update user.',
                    });
                })
        } else {
            
        }
    };
    
    return {
        data,
        handleSubmit,
        handleUpdate,
        handleCreate,
        onUpdate,
    };
};

export default useSavePage;
