import React from 'react'
import "./approve.css"
import { Link, useParams , useNavigate } from 'react-router-dom'
import { axiosObj } from '../../utils/axios'
import {useAppContext} from "../../context/appContext"
import socket from "../../socketConfig"


const Approve = ({setBlock , users , setOpenApproveModal , setAprroveDelete , setUsers}) => {

  
    const params = useParams()
    const navigate = useNavigate()
    const {token} = useAppContext()

    
    const handleDeleteUser = async () => {
  
          try {
            const response = await axiosObj.delete(`/deleteUser/${params.userId}` , {
              headers : {
                "admin_header" : `admin ${token}`
              }
            })

            socket.emit("logoutUser" , {receiverId : params.userId})

            setBlock(prev => !prev)

            // setUsers(response.data)

          } catch (error) {
            //console.log(error)        
          }
                    
          navigate("/users")

        }




  return (
    <div className='approveModal'>
      
        <div className='approveModalContainer'>
          
            <div className='approveModalContainerContent'>
               
                <h5 className='approveModalContainerContentHeader'>Are you sure to Block this User ?</h5>
                
                <div className='approveModalActionsContainer'>

                    <button onClick={handleDeleteUser} className='approveModalActionsContainerDeleteBtn'>Block</button>

                    <Link to="/users">
                        <button className='approveModalActionsContainerCancelBtn'>Cancel</button>
                    </Link>

                </div>

            </div>

        </div>

    </div>
  )
}


export default Approve