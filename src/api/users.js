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


