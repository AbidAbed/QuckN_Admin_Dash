import { useReducer , useContext } from "react"
import reducer from "./reducer"
import { ADMIN_LOGIN_FAILED, ADMIN_LOGIN_START, ADMIN_LOGIN_SUCCESS, ADMIN_LOGOUT } from "./actions"
import { axiosObj } from "../utils/axios"
import React from "react"
import { toast } from 'react-toastify';
import socket from "../socketConfig"


const user = localStorage.getItem("user")
const token = localStorage.getItem("token")


const toastOptions = {
    position : "top-right",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };


export const initialState = {
    user : user ? JSON.parse(user) : null ,
    token : token ? token : null ,
    isLoading : false ,
    error : null
}


const AppContext = React.createContext()


export const AppProvider = ({children}) => {


    const [state , dispatch] = useReducer(reducer , initialState)


    const setUpLocalstorage = ({user , token}) => {
        localStorage.setItem("user" , JSON.stringify(user))
        localStorage.setItem("token" , token)
    }


    const removeLocalstorage = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }


    const adminLogin = async ({email , password}) => {
        
        dispatch({type : ADMIN_LOGIN_START})

        try {
            
            const response = await axiosObj.post("/login" , {
                email ,
                password
            })
            
            dispatch({type : ADMIN_LOGIN_SUCCESS , payload : {user : response.data.adminUser , token : response.data.token}})
            
            setUpLocalstorage({user : response.data.adminUser , token : response.data.token})

            toast.success(`Welcome Back ${response.data.adminUser.username}` , toastOptions)

            socket.emit("addUser", {userId : response.data.adminUser?._id , token : `admin ${response.data.token}` , timestamp : Date.now()});
            
            
        } catch (error) {
            dispatch({type : ADMIN_LOGIN_FAILED , payload : {msg : error.response.data.msg}})
            toast.error("Invalid credentials" , toastOptions)
        }
    }


    const logout = () => {
        dispatch({type : ADMIN_LOGOUT})
        removeLocalstorage()
        window.location.reload()
    }


    return(
        <AppContext.Provider value={{...state , setUpLocalstorage , removeLocalstorage , adminLogin , logout}}>
            {children}
        </AppContext.Provider>
    )

}



export const useAppContext = () => {
    return useContext(AppContext)
}