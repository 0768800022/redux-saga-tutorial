// import { useDispatch, useSelector } from 'react-redux';
// import { getUserRequest, createUserRequest, updateUserRequest, deleteUserRequest, usersSuccess, usersError } from '../actions/users';
import userListPage from "../api/useUserListPage";
import apiConfig from '../api/apiConfig';
import User from './User';

function App() {

    // const dispatch = useDispatch();
    // const users = useSelector(state => state.users); //lấy state users từ redux store
    // const [listUsers, setListUsers] = useState([]); //biến res -> data của axios -> data của api trả về
    
    const {data,
          handleSubmit,
          handleUpdateUser,
          handleDeleteUserClick,
          handleCloseAlert,
          success
    } = userListPage(apiConfig.Api);

    // const handleSubmit = ({firstName, lastName}) => {
    //   dispatch(createUserRequest({ firstName, lastName}));
    // };

    // const handleUpdateUser = (updatedUser) => {
    //   console.log("Update check", updatedUser);
      
    //   dispatch(updateUserRequest(updatedUser));
    // }


    // const handleDeleteUserClick = (userId) => {
    //   dispatch(deleteUserRequest(userId));
    // };

    // const handleCloseAlert = () => {
    //   dispatch(usersSuccess({ success: ''}));
    // };
    
    return (
      <User 
        data={data}
        handleSubmit={handleSubmit}
        handleUpdateUser={handleUpdateUser}
        handleDeleteUserClick={handleDeleteUserClick}
        handleCloseAlert={handleCloseAlert}
      />
    );
}

export default App;