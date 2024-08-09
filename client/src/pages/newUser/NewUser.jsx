import React, { useState } from 'react'
import "./newUser.css"
import { axiosObj } from '../../utils/axios'
import { useNavigate } from 'react-router-dom'
import {useAppContext} from "../../context/appContext"


const NewUser = () => {

  const {token} = useAppContext()
  
  const [formData , setFormData] = useState({
    username : "",
    email : "",
    password : "",
    isAdmin : false,
    isAnnouncing : false  
  })


  const handleChange = (e) => {
    setFormData({...formData , [e.target.name] : e.target.value })
  }


  const navigate = useNavigate()
  

  const createNewUser = async (e) => {

    e.preventDefault()

    try {

      await axiosObj.post("/createUser" , formData , {
        headers : {
          "admin_header" : `admin ${token}`
        }
      })

      navigate("/users")

    } catch (error) {
      //console.log(error)
    }
  }


  return (
    <div className="newUser">

    <h1 className="newUserTitle">New User</h1>

    <form onSubmit={createNewUser} className="newUserForm">

      <div className="newUserItem">
        <label>Username</label>
        <input onChange={handleChange} name='username' type="text" placeholder="username" />
      </div>

      <div className="newUserItem">
        <label>Email</label>
        <input onChange={handleChange} name='email' type="email" placeholder="name@example.com" />
      </div>

      <div className="newUserItem">
        <label>Password</label>
        <input onChange={handleChange} name='password' type="password" placeholder="********" />
      </div>
 
      <div className="newUserItem">

        <label>Admin</label>

        <select defaultValue={false} onChange={handleChange} className="newUserSelect" name="isAdmin" id="active">
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>

      </div>

      <div className="newUserItem">

        <label>announcer</label>

        <select defaultValue={false} onChange={handleChange} className="newUserSelect" name="isAnnouncing" id="active">
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>

      </div>

      <div className='newUserItem'> 
        <button className="newUserButton">Create</button>
      </div>  

    </form>

  </div>
  )
}

export default NewUser