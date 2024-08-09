import React, { useEffect, useState } from 'react'
import "./featured.css"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Link , useNavigate} from 'react-router-dom';
import {axiosObj} from "../../utils/axios"
import {useAppContext} from "../../context/appContext"


 
const Featured = () => {

    const {token} = useAppContext()
    
    const navigate = useNavigate()

    const [docNum , setDocNum] = useState({})


    useEffect(() => {
        const getDocNum = async () => {
            try {
                const response =  await axiosObj.get("/countDB" , {
                    headers : {
                        "admin_header" : `admin ${token}` 
                    }
                })
                setDocNum(response.data)
            } catch (error) {
                //console.log(error)
            }
        }

        getDocNum()
        
    } , [])




  return (
    <div className='featured'> 

        <div onClick={() => navigate("/users")} className='featuredItem'>

            <span className='featuredTitle'>Users</span>

            <div className='featuredUsersContainer'>

                <span className='featuredUsersNum'>
                    {docNum.usersNum} Users
                </span>

            </div> 
            


        </div>
        

        <div onClick={() => navigate("/messages")} className='featuredItem'>
            
            <span className='featuredTitle'>Messages</span>

            <div className='featuredUsersContainer'>

                <span className='featuredUsersNum'>
                    {docNum.messagesNum} Message
                </span>

            </div>


        </div>

        <div onClick={() => navigate("/files")} className='featuredItem'> 
            
            <span className='featuredTitle'>Files</span>

            <div className='featuredUsersContainer'>

                <span className='featuredUsersNum'>
                    {docNum.filesNum} File
                </span>

            </div>


        </div>

    </div>
  )
}

export default Featured