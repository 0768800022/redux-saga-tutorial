import axios from "axios";
import { Api } from './apiConfig';


export const getUsers = async () => {
  try {
    const response = await axios({
      url: Api.getList.url,
      method: Api.getList.method,
      headers: Api.getList.headers,
    });
    return response;
  } catch (e) {
    
  }
};

export const createUser = async ({ firstName, lastName }) => {
  try {
    const response = await axios({
      url: Api.create.url,
      method: Api.create.method,
      headers: Api.create.headers,
      data: { firstName, lastName },
    });
    return response;
  } catch (e) {
    
  }
};

export const updateUser = async (userId, { firstName, lastName }) => {
  try {
    const response = await axios({
      url: Api.update(userId).url,
      method: Api.update(userId).method,
      headers: Api.update(userId).headers,
      data: { firstName, lastName },
    });
    return response;
  } catch (e) {
    
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios({
      url: Api.delete(userId).url,
      method: Api.delete(userId).method,
      headers: Api.delete(userId).headers,
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
