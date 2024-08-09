import React, { useEffect, useState } from 'react'
import "./user.css"
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PublishIcon from '@mui/icons-material/Publish';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Link , useParams , useNavigate} from 'react-router-dom';
import { axiosObj } from '../../utils/axios';
import { useAppContext } from '../../context/appContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from '../../socketConfig';


const User = () => {

  const toastOptions = {
    position : "top-center",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const {token , user} = useAppContext()

  const params = useParams()
  const navigate = useNavigate()

  const [formData , setFormData] = useState({
    username : "",
    email : "",
    password : "",
    isAdmin : false,
    isAnnouncing : false,
    adminOfAdmins : false
  })




  const handleChange = (e) => {

    if(e.target.name === "isAdmin") {
      setFormData({...formData , [e.target.name] : !formData.isAdmin})      
    }

    if(e.target.name === "isAnnouncing") {
      setFormData({...formData , [e.target.name] : !formData.isAnnouncing})      
    }

    if(e.target.name === "adminOfAdmins") {
      setFormData({...formData , [e.target.name] : !formData.adminOfAdmins})      
    }

    if(e.target.type === "text" || e.target.type === "email" || e.target.type === "password" ){
      setFormData({...formData , [e.target.name] : e.target.value})
    }

  }



  useEffect(() => {

    const getUser = async () => {
      try {
        const response = await axiosObj.get(`/getUserById/${params.userId}` , {
          headers : {
            "admin_header" : `admin ${token}`
          }
        })

        setFormData(response.data)

      } catch (error) {
        //console.log(error)
      }
    }

    getUser()

  }, [])



  const handleUserUpdate = async (e) => {

    e.preventDefault()

    try {
      await axiosObj.put(`/updateUser/${params.userId}` , formData , {
        headers : {
          "admin_header" : `admin ${token}`
        }
      })

      toast.success("User Updated Successfully" , toastOptions)
      
      socket.emit("logoutUser" , {receiverId : params.userId})
      
      if(params.userId === user._id && user.adminOfAdmins === true){
          window.localStorage.removeItem("token")
          window.localStorage.removeItem("user")
          window.location.reload()
          return
      }

      navigate("/users")


    } catch (error) {
      //console.log(error)
    }

  }
  



  return (
    <div className='user'>

      <div className='userTitleContainer'>
        <h1 className='userTitle'>Edit User</h1>
        <Link to="/newUser">
          <button className='addUserBtn'>create user</button>
        </Link>
      </div>

      <div className='userContainer'>

        <div className='userShow'>
          
          <div className='userShowTop'>
              
              <img src={formData.avatar ? formData.avatar : "https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"} alt="" className='userShowImg' />

              <div className='userShowTopTitle'>
                  <span className='userShowUsernamea'>{formData.username}</span>
                  <span className='userShowUserEmail'>{formData.email}</span>
              </div>

          </div>

          <div className='userShowBottom'>

          <span className="userShowTitle">Account Details</span>

            <div className="userShowInfo">
              <PermIdentityIcon className="userShowIcon" />
              <span className="userShowInfoTitle">{formData.username}</span>
            </div>

            <div className="userShowInfo">
              <MailOutlineIcon className="userShowIcon" />
              <span className="userShowInfoTitle">{formData.email}</span>
            </div>

            <div className="userShowInfo">
              <AdminPanelSettingsIcon className="userShowIcon" />
              <span className="userShowInfoTitle">{formData.isAdmin ? "Admin" : "not admin"}</span>
            </div>

            <div className="userShowInfo">
              <CampaignIcon className="userShowIcon" />
              <span className="userShowInfoTitle">{formData.isAnnouncing ? "Announcer" : "not Announcer"}</span>
            </div>

            <div className="userShowInfo">
              <SettingsSuggestIcon className="userShowIcon" />
              <span className="userShowInfoTitle">{formData.adminOfAdmins ? "System admin" : "not System admin"}</span>
            </div>
          
          </div>
        
        </div>
        
        <div className='userUpdate'>

        <span className="userUpdateTitle">Edit</span>

          <form onSubmit={handleUserUpdate} className="userUpdateForm">

            <div className="userUpdateLeft">

              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder={formData.username}
                  className="userUpdateInput"
                  name='username'
                  value={formData.username}
                />
              </div>

              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  onChange={handleChange}
                  name='email'
                  type="email"
                  placeholder={formData.email}
                  className="userUpdateInput"
                  value={formData.email}
                />
              </div>

              <div className="userUpdateItem">
                <label>Password</label>
                <input
                  name='password'
                  onChange={handleChange}
                  type="password"
                  placeholder="********"
                  className="userUpdateInput"
                />
              </div>
                    

              <div className="userUpdateItemCheckBox">
                  <span>Admin</span>
                  <input onChange={handleChange} checked={formData.isAdmin} type="checkbox" name='isAdmin' />
              </div>

              <div className="userUpdateItemCheckBox">
                  <span>Anouncer</span>
                  <input onChange={handleChange} checked={formData.isAnnouncing} type="checkbox" name='isAnnouncing' />
              </div>

              <div className="userUpdateItemCheckBox">
                  <span>System admin</span>
                  <input onChange={handleChange} checked={formData.adminOfAdmins} type="checkbox" name='adminOfAdmins' />
              </div>

              <button className="userUpdateButton">Update</button>

            </div>

            <div className="userUpdateRight">

              {/* <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src="https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
                  alt=""
                />
                <label htmlFor="file">
                  <PublishIcon className="userUpdateIcon"/>
                </label>

                <input type="file" id="file" style={{ display: "none" }} />

              </div> */}


            </div>

          </form>

        </div>

        </div>
      
      </div>
  )
}

export default User