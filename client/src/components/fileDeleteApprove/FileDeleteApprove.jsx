import React, { useEffect, useState } from 'react'
import "./fileDeleteApprove.css"
import { useParams , Link , useNavigate , useLocation} from 'react-router-dom'
import { useAppContext } from "../../context/appContext"
import { axiosObj } from '../../utils/axios'
import socket from '../../socketConfig'


const FileDeleteApprove = () => {

    const {token} = useAppContext()

    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [prevRoute , setPrevRoute] = useState(null)

    useEffect(() => {
        setPrevRoute(location.state?.from)
    }, [location])


    //console.log(prevRoute)

    const deleteSpecificFile = async () => {
  
          try {
              const response =  await axiosObj.delete(`/deleteFile/${params.fileId}` , {
                  headers : {
                      "admin_header" : `admin ${token}`
                  }
              })

              prevRoute === "/files" ? navigate("/files") : navigate("/userFiles")

              socket.emit("messageDeleted", {
                message_id: response.data._id,
                conversationId: response.data.conversationId,
                members: response.data.members,
                senderId: response.data.sender,
              });

              
          } catch (error) {
            //console.log(error)
          }

      }



  return (
    <div className='approveModal'>
       
        <div className='approveModalContainer'>
            
            <h3 className='approveModalHeader'>File Delete Approve</h3>
            
            <div className='fileDeleteApproveContainer'>

                <button onClick={deleteSpecificFile} className='fileDeleteApproveBtn'>Approve</button>

                <Link to="/usersFiles">
                    <button className='fileDeleteCancelBtn'>Cancel</button>  
                </Link>
            </div>

        </div>

    </div>
  )
}

export default FileDeleteApprove