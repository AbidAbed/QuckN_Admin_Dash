import React, { useEffect } from 'react'
import "./editGroup.css"
import {useParams} from "react-router-dom"
import { axiosObj } from '../../utils/axios'
import { useAppContext } from '../../context/appContext'
import { useState } from 'react'
import { AddGroupMember } from '../../components/addGroupMember/AddGroupMember'
import socket from '../../socketConfig'


const EditGroup = () => {

  const params = useParams()

  const {token , user} = useAppContext()

  const [usersInGroup , setUsersInGroup] = useState([])

  const [openAddGroupMemberModal , setOpenAddGroupMemberModal] = useState(false)

  

  const getGroupMembers = async () => {
    try {
      const response = await axiosObj.get(`/getUsersInGroup/${params.groupId}` , {
        headers : {
          "admin_header" : `admin ${token}`
        }
      })
      setUsersInGroup(response.data)
    } catch (error) {
      //console.log(error)
    }
  }



  useEffect(() => {

    getGroupMembers()      

  } , []) 






  const removeGroupMember = async (memberId , groupId , convId) => {
    try {
      const response = await axiosObj.patch(`/removeGroupMember/${groupId}/${memberId}` , {} , {
        headers : {
          "admin_header" : `admin ${token}`
        }
      })

      usersInGroup.map((groupUser) => {
        socket.emit("removedFromGroup" , { senderId : user._id , receiverId : groupUser._id , convId , removedUserId : memberId})        
      })
      
      setUsersInGroup(prev => prev.filter((user) => user._id !== memberId))

    } catch (error) {
      //console.log(error)
    }
  }




  return (
    <div className='editGroup'>

      <button onClick={() => setOpenAddGroupMemberModal(true)} className='addGroupMemberBtn'>add group member</button>
      
      <table>

        <tr>

          <th>Group Member</th>
          <th>Member id</th>
          <th>Action</th>

        </tr>

        {usersInGroup && usersInGroup.map((singleUser) => {
          return(
            <tr key={singleUser?._id}>
              <td className='tableData'>{singleUser?.username}</td>
              <td className='tableData'>{singleUser?._id}</td>
              <td className='tableData'>
                <button onClick={() => removeGroupMember(singleUser._id , params.groupId , params.convId)} className='removeGroupMemberBtn'>remove member</button>
              </td>
            </tr>
          )
        })}


      </table>
      
      {openAddGroupMemberModal && <AddGroupMember usersInGroup={usersInGroup} setUsersInGroup={setUsersInGroup} setOpenAddGroupMemberModal={setOpenAddGroupMemberModal}/>}

    </div>
  )
}

export default EditGroup