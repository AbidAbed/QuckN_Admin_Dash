import React, { useState } from 'react'
import "./sideBar.css"
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link , useParams } from 'react-router-dom';
import { useAppContext } from '../../context/appContext';
import sidebar from "../../assets/sidebar.svg"


const SideBar = () => {

    const {logout , user} = useAppContext()

    const [clicked , setClicked] = useState(false)

    const params = useParams()


  return (
    <div className='sideBar'>
        
        <div className='sideBarWrapper'>

            <div className='sideBarMenu'>

                <h3 className='sideBarTitle'>DashBoard</h3>

                <ul className='sideBarList'>

                        <Link to="/">
                        <li className="sideBarListItem">
                                <HomeIcon/>
                                Home
                        </li>                        
                        </Link>

                        <Link to="/users">
                        <li className='sideBarListItem'>
                            <PersonIcon/>
                            Users
                        </li>                        
                        </Link>

                        <Link to="/newUser">
                        <li className='sideBarListItem'>
                            <PersonIcon/>
                            Add User
                        </li>                        
                        </Link>
                        
                        <Link to="/getGroups">
                        <li className='sideBarListItem'>
                            <GroupsIcon/>
                            Groups
                        </li>                        
                        </Link>

                        <Link to="/messages">
                        <li className='sideBarListItem'>
                            <MessageIcon/>
                            Messages
                        </li>
                        </Link>

                        <Link to="/files">
                        <li className='sideBarListItem'>
                            <InsertDriveFileIcon/>
                            Files
                        </li>                       
                        </Link>

                </ul>

            </div>


            <div className='sideBarMenu'>

                <h3 className='sideBarTitle'>Admin</h3>

                <ul className='sideBarList'>

                        <Link to="/profile">
                        <li className='sideBarListItem'>
                            <AccountCircleIcon/>
                            Profile
                        </li>                        
                        </Link>

                        <li onClick={logout} className='sideBarListItem'>
                            <LogoutIcon/>
                            Logout
                        </li>
                        
                </ul>

            </div>


            <div className='sideBarMenu'>

                <h3 className='sideBarTitleAdminName'>Logged user : {user.username}</h3>

            </div>


            <div className='sideBarSvgMenu'>

                <img src={sidebar} alt="" className='sideBarSvgMenuImg' />

            </div>

        </div>

    </div>
  )
}


export default SideBar