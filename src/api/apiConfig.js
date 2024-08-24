

// Cách cấu hình cho các headers
const baseHeader = {
  'Content-Type': 'application/json',
};
// đường dẫn url
const url = 'https://mithril-rem.fly.dev/api';
 
 export const Api = {
    // user: {
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
    // }
  };

  export default { Api };