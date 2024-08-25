import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import User from './User';
import News from './News'; 
import EditUser from './EditUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<User />} />
        <Route path="/news" element={<News />} /> 
        <Route path="/users/edit/:id" element={<EditUser />} />
      </Routes>
    </Router>
  );
}

export default App;













// const dispatch = useDispatch();
    // const users = useSelector(state => state.users); //lấy state users từ redux store
    // const [listUsers, setListUsers] = useState([]); //biến res -> data của axios -> data của api trả về
    
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