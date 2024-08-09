import React from 'react'
import "./topBar.css"
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
import logoSvg from "../../assets/logoNoBg.svg"
import headerSvg from "../../assets/Header.svg"



const TopBar = () => {
  return (
    <div className='topBar'>

        <div className='topBarWrapper'>

            <div className='topLeft'>
                <Link to="/" style={{textDecoration : "none"}}>
                    <img src={logoSvg} alt="" className='logoSvg' />
                </Link>
            </div>


            <div className='topMiddle'>
                <Link style={{textDecoration : "none"}} to="/">
                    <span className='logoName'>Chat Admin Panel</span>
                </Link>
            </div>


            <div className='topRight'>
                <img src={headerSvg} alt="" className='logoSvg' />
            </div>

        </div>

    </div>
  )
}

export default TopBar