import './App.css';
import SideBar from './components/sideBar/SideBar';
import TopBar from './components/topBar/TopBar';
import Home from './pages/home/Home';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import UsersList from './pages/usersList/UsersList';
import User from "./pages/user/User"
import NewUser from './pages/newUser/NewUser';
import Approve from './components/approveModal/Approve';
import Login from './pages/login/Login';
import { useAppContext } from './context/appContext';
import ProtectedRoutes from './components/ProtectedRoutes';
import AllGroups from './pages/groups/AllGroups';
import EditGroup from './pages/editGroup/EditGroup';
import Messages from './pages/messages/Messages';
import Files from './pages/files/Files';
import UsersFiles from './pages/usersFiles/UsersFiles';
import FileDeleteApprove from "./components/fileDeleteApprove/FileDeleteApprove"
import { useEffect } from 'react';
import socket from './socketConfig';
import Profile from './pages/profile/Profile';



function App() {


  const { user, token } = useAppContext()






  return (

    <Router basename='/dash'>

      {user && <TopBar />}

      <div className='appContainer'>

        {user && <SideBar />}

        <Routes>

          {/* protected routes */}
          <Route exact path='/' element={<ProtectedRoutes>
            <Home />
          </ProtectedRoutes>} />

          <Route path='/users' element={<ProtectedRoutes>
            <UsersList />
          </ProtectedRoutes>} />

          <Route path='/user/:userId' element={<ProtectedRoutes>
            <User />
          </ProtectedRoutes>} />

          <Route path='/newUser' element={<ProtectedRoutes>
            <NewUser />
          </ProtectedRoutes>} />

          <Route path='/approveModal/:userId' element={<ProtectedRoutes>
            <Approve />
          </ProtectedRoutes>} />

          <Route path='/fileApproveDeleteModal/:fileId' element={<ProtectedRoutes>
            <FileDeleteApprove />
          </ProtectedRoutes>} />

          <Route path='/getGroups' element={<ProtectedRoutes>
            <AllGroups />
          </ProtectedRoutes>} />

          <Route path='/editGroup/:convId/:groupId' element={<ProtectedRoutes>
            <EditGroup />
          </ProtectedRoutes>} />

          <Route path='/messages' element={<ProtectedRoutes>
            <Messages />
          </ProtectedRoutes>} />


          <Route path='/files' element={<ProtectedRoutes>
            <Files />
          </ProtectedRoutes>} />

          <Route path='/userFiles' element={<ProtectedRoutes>
            <UsersFiles />
          </ProtectedRoutes>} />

          <Route path='/profile' element={<ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>} />


          <Route path='/admin/login' element={<Login />} />

        </Routes>

      </div>

    </Router>

  );
}

export default App;
