import React from 'react'
import { useAppContext } from '../context/appContext'
import { Navigate } from 'react-router-dom'


const ProtectedRoutes = ({children}) => {

    const {user} = useAppContext()

    if(!user){
        return <Navigate to="/admin/login"/>
    }
    
    return children
    
}

export default ProtectedRoutes