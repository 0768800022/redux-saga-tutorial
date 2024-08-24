import axios from "axios";

// Cách cấu hình cho các headers
const baseHeader = {
  'Content-Type': 'application/json',
};
// đường dẫn url
const url = 'http://mithril-rem.fly.dev/api';

const userApi = {
  getList: {
    url: `${url}/users`,
    method: 'GET',
    headers: baseHeader,
  },
  create: {
    url: `${url}/users`,
    method: 'POST',
    headers: baseHeader,
  },
  update: (userId) => ({
    url: `${url}/users/${userId}`,
    method: 'PUT',
    headers: baseHeader,
  }),
  delete: (userId) => ({
    url: `${url}/users/${userId}`,
    method: 'DELETE',
    headers: baseHeader,
  }),
};

export const getUsers = async () => {
  try {
    const response = await axios({
      url: userApi.getList.url,
      method: userApi.getList.method,
      headers: userApi.getList.headers,
    });
    return response;
  } catch (e) {
    
  }
};

export const createUser = async ({ firstName, lastName }) => {
  try {
    const response = await axios({
      url: userApi.create.url,
      method: userApi.create.method,
      headers: userApi.create.headers,
      data: { firstName, lastName },
    });
    return response;
  } catch (e) {
    
  }
};

export const updateUser = async (userId, { firstName, lastName }) => {
  try {
    const response = await axios({
      url: userApi.update(userId).url,
      method: userApi.update(userId).method,
      headers: userApi.update(userId).headers,
      data: { firstName, lastName },
    });
    return response;
  } catch (e) {
    
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios({
      url: userApi.delete(userId).url,
      method: userApi.delete(userId).method,
      headers: userApi.delete(userId).headers,
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
