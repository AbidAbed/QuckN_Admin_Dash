import React, { useEffect, useState } from 'react'
import "./userslist.css"
import {DataGrid , GridColDef , GridValueGetterParams} from "@mui/x-data-grid"
import BlockIcon from '@mui/icons-material/Block';
import { Link , useParams , useNavigate} from 'react-router-dom';
import { rows} from '../../data';
import { axiosObj } from '../../utils/axios';
import axios from 'axios';
import Approve from '../../components/approveModal/Approve';
import { useAppContext as context } from '../../context/appContext';



const UsersList = () => {

    const {token} = context()

    const [users , setUsers] = useState([])

    const [openApproveModal , setOpenApproveModal] = useState(false)

    const [approveDelete , setAprroveDelete] = useState(false)
    const [block , setBlock] = useState(false)

    
    useEffect(() => {
      
      const getAllUsers = async () => {
        try {
          const response = await axiosObj.get("/getUsersByAdmin" , {
            headers : {
              "admin_header" : `admin ${token}`
            }
          })

          setUsers(response.data)

        } catch (error) {
          //console.log(error)
        }
      }

      getAllUsers()

    },[block]);
    


    
    const removeBlockedUser = async (userId) => {
      try {
        const response = await axiosObj.patch(`/removeUserBlock/${userId}` , {} , {
          headers : {
            "Admin_header" : `admin ${token}`
          }
        })

        //console.log(response.data)

        setBlock(prev => !prev)

        // setUsers(response.data)

      } catch (error) {
        //console.log(error);
      }
    }
    

  

  return (

    <div className='usersList'>
    
      <div style={{ maxHeight: "800px" , overflowY : "auto"}}>
        
      <table>

        <tr>
          <th>id</th>
          <th>Username</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Announcing</th>
          <th>Actions</th>
        </tr>

        {users && users.map((singleUser , index) => {
          return(
            <tr className={`${singleUser.isBlocked ==="true" && "isBlocked"} `} key={index}>
              
              <td className='tableData'>{singleUser._id}</td>
              <td className='tableData'>{singleUser.username}</td>
              <td className='tableData'>{singleUser.email}</td>
              <td className='tableData'>{singleUser.isAdmin ? "admin" : "not admin"}</td>
              <td className='tableData'>{singleUser.isAnnouncing ? "announcer" : "not announcer"}</td>
              
              <td className='tableData'>
                <div className='actionBtns'>

                  <Link to={`/user/${singleUser._id}`}>
                    <button className='editUserBtn'>edit</button>
                  </Link>
                  {
                    singleUser.isBlocked === "true" ? <button className='remobeBlockBtn' onClick={() => removeBlockedUser(singleUser._id)}>remove block</button> : <Link to={`/approveModal/${singleUser._id}`}><BlockIcon className='deleteUserBtn'/></Link>
                  }
        
                </div>
              
              </td>

            </tr>

          ) 
        })}

        {openApproveModal && <Approve users={users} setAprroveDelete={setAprroveDelete} setOpenApproveModal={setOpenApproveModal} setUsers={setUsers} setBlock={setBlock} />} 

      </table>

      </div>

    </div>
  )
}


export default UsersList