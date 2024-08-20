import axios from "axios";

export const getUsers = () => {
    return axios.get('/users', {
        params: {
            limit: 1000,
        }
    });
};

export const createUser = ({firstName, lastName}) => {
    return axios.post('/users', {
        firstName,
        lastName
    });
};



// const createUser = async ({ firstName, lastName }) => {
//     try {
//         const response = await fetch('http://mithril-rem.fly.dev/api/users', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ firstName, lastName })
//         });
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//     }
// };

    // return (axios({
    //     headers: { 
    //         'content-type': 'application/json'
    //     },
    //     method: 'post',
    //     url: '/users',
    //     params: {
    //         firstName,
    //         lastName
    //     }
    // })
    // .then((response) => response.data)
    // .catch((error) => error))