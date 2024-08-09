import React, { useEffect, useState } from 'react'
import './profile.css'
import sidebar from "../../assets/sidebar.svg"
import { axiosObj } from '../../utils/axios';
import { useAppContext } from '../../context/appContext';


const Profile = () => {
  
  
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
    });
  

    const {token , user} = useAppContext()


    useEffect(() => {
        
        const getAdminProfile = async () => {
            try {
                const response = await axiosObj.get(`/getUserById/${user._id}` , {
                    headers : {
                        "admin_header" : `admin ${token}`
                    }    
                })    

                const {username , email} = response.data

                setFormData({...formData , username , email})

            } catch (error) {  
                //console.log(error)
            }    
        }    

        getAdminProfile()

    } , [user])    

    


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  };




  const handleSubmit = async (e) => {

    e.preventDefault()

    try {
        const response = await axiosObj.put(`/updateAdminProfile/${user._id}` , formData , {
            headers : {
                "admin_header" :  `admin ${token}` 
            }
        })
        //console.log(response.data)

        window.localStorage.removeItem("user")
        window.localStorage.removeItem("token")

        window.location.reload()

    } catch (error) {
        //console.log(error);
    }
  }





  return (

    <div className='layer-bg'>

    <div className='profile-svg-container'>
        <img src={sidebar} alt="" className='profile-svg-container-img' />
    </div>

    <div className="profile-update-container">

      <div className="profile-update-form">

        <h1 className='admin-profile-header'>Admin Profile</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-group-admin">

            <label className='admin-label' htmlFor="username">Username</label>

            <input
              className="admin-profiile-input"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

          </div>

          <div className="form-group-admin">

            <label className='admin-label' htmlFor="email">Email</label>

            <input
              className="admin-profiile-input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div className="form-group-admin">

            <label className='admin-label' htmlFor="password">Password</label>

            <input
              className="admin-profiile-input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

          </div>


          <div className='form-group-admin'>
            <button className='adminProfileBtn' type="submit">Update Profile</button>
          </div>  


        </form>


      </div>


    </div>
    </div>
  );
};

export default Profile;
