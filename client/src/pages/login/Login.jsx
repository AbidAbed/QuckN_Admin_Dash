import React from 'react'
import { useState , useEffect} from "react";
import "./login.css"
import { useAppContext} from '../../context/appContext';
import { useNavigate } from 'react-router-dom';
import loginSvg from "../../assets/loginSvgLogo.svg"
import loginBigSvg from "../../assets/sidebar.svg"
import gg from "../../assets/gg.svg"


function Login() {

    const {adminLogin , user} = useAppContext()
    const navigate = useNavigate()

    useEffect(() => {
        if(user){
            navigate("/")
        }
    } , [user])


    const [formData , setFormData] = useState({
        email : "" , 
        password : ""
    })



    const handleChange = (e) => {
      setFormData({...formData , [e.target.name] : e.target.value})
    }

    const {email , password} = formData

    const handleSubmit = (e) => {

        e.preventDefault()

        if(!email || !password) return

        adminLogin({email , password})

    }



  return (

    <div className='login'>

      <div className='login-svg-container'>
        <img src={loginSvg} alt="" className='login-svg' />
      </div>

      <div className='login-container'>

            <div className='form-container'>

            <div className='form-inputs-container'>
              
              <div className='form-inputs-header'>
                <h3 className='admin-header'>Admin Login</h3>
                <span className='admin-header-span'>please login to access the system</span>
              </div>

              <form onSubmit={handleSubmit} className='login-form'>
                
              <div className='single-input-first'>
                <label className='single-input-label' htmlFor="">Email</label>
                <input onChange={handleChange} placeholder='adminUser@example.com' className='single-input-text' type="email" name='email' value={email} />
              </div>

              <div className='single-input'>
                <label className='single-input-label' htmlFor="">Password</label>
                <input onChange={handleChange} placeholder='********' className='single-input-text' type="password" value={password} name='password' />
              </div>
              
              <div className='single-input'>
                <button className='admin-login-btn'>log in</button>
              </div>

              </form>

            </div>
            
            </div>


            <div className='background-container'>
 
              <div className='background-svg-container'>
                <img className='background-svg-container-svg' src={gg} alt="" />
              </div> 

              <div className='background-text-container'>
                <h5 className='background-text-container-header'>Novel Era Chat <br /> System Admin</h5>
              </div>

            </div>

      </div>


    </div>
  );
}

export default Login;









// <div id="login-page">

// <div className='loginSvgContainer'>
//   <img src={loginSvg} className='loginSvg' alt="" />
// </div>

// <div class="login">

//   <h2 class="login-title">Admin Login</h2>

//   <p class="notice">Please login to access the system</p>

//   <form onSubmit={handleSubmit} class="form-login">

//     <label className='loginLabel' for="email">E-mail</label>

//     <div class="input-email">

//       <i class="fas fa-envelope icon"></i>

//       <input
//         className='input-email'
//         value={email}
//         type="email"
//         name="email"
//         placeholder="Enter your e-mail"
//         required
//         onChange={handleChange}
//       />

//     </div>

//     <label className='loginLabel' for="password">Password</label>

//     <div class="input-password">

//       <i class="fas fa-lock icon"></i>

//       <input
//         className='input-password'
//         value={password}
//         type="password"
//         name="password"
//         placeholder="Enter your password"
//         required
//         onChange={handleChange}
//       />

//     </div>

//     <button type="submit" className='loginSubmitBtn'>
//       Sign in
//     </button>

//   </form>

// </div>


// <div class="background">

//   <h1 style={{marginRight : "30px" , whiteSpace : "no-wrap" , wordBreak : "break-word"}}>
//     NOVEL ERA CHAT SYSTEM ADMIN
//   </h1>

// </div>


// </div>