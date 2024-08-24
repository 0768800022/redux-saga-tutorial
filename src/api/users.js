import axios from "axios";
import { Api } from './apiConfig';


export const getUsers = async () => {
  try {
    const response = await axios({
      url: Api.user.getList.url,
      method: Api.user.getList.method,
      headers: Api.user.getList.headers,
    });
    return response;
  } catch (e) {
    
  }
};

export const createUser = async ({ firstName, lastName }) => {
  try {
    const response = await axios({
      url: Api.user.create.url,
      method: Api.user.create.method,
      headers: Api.user.create.headers,
      data: { firstName, lastName },
    });
    return response;
  } catch (e) {
    
  }
};

export const updateUser = async (userId, { firstName, lastName }) => {
  try {
    const response = await axios({
      url: Api.user.update(userId).url,
      method: Api.user.update(userId).method,
      headers: Api.user.update(userId).headers,
      data: { firstName, lastName },
    });
    return response;
  } catch (e) {
    
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios({
      url: Api.user.delete(userId).url,
      method: Api.user.delete(userId).method,
      headers: Api.user.delete(userId).headers,
    });
    return response;
  } catch (e) {
    
  }
};


// export const getUsers = () => {
//     return axios.get('/users', {
//         params: {
//             limit: 1000,
//         }
//     });
// };

// export const createUser = ({firstName, lastName}) => {
//     return axios.post('/users', {
//         firstName,
//         lastName
//     });
// };

// export const updateUser = (userId, {firstName, lastName}) => {
//     return axios.put(`/users/${userId}`, {
//         firstName,
//         lastName
//     });
// }


// export const deleteUser = (userId) => {
//     return axios.delete(`/users/${userId}`);
// }
