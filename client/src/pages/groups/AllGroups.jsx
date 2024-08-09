import React, { useEffect, useState } from 'react'
import "./allGroups.css"
import {axiosObj} from "../../utils/axios"
import {useAppContext} from "../../context/appContext"
import {Link} from "react-router-dom"
import socket from "../../socketConfig"


const AllGroups = () => {

  const {token , user} = useAppContext()

  const [groups , setGroups] = useState([])


  
  useEffect(() => {

    const getGroups = async () => {
      try {
        const response = await axiosObj.get("/getGroupsByAdmin" , {
          headers : {
            "admin_header" : `admin ${token}`
          }
        })
        setGroups(response.data)
      } catch (error) {
        //console.log(error)
      }
    }

    getGroups()

  } , [])




  const removeGroupMembers = async (group) => {
    try {
      const response = await axiosObj.delete(`/deleteGroupMembers/${group._id}` , {
        headers : {
          "admin_header" : `admin ${token}`
        }
      })

      response.data.oldGroupMembers.map((oldMemberId) => {
        socket.emit("removedFromGroup" , { senderId : user._id , receiverId : oldMemberId , convId : group.conversationId , removedUserId : oldMemberId})        
        // socket.emit("removedFromGroup" , { senderId : user._id , receiverId : oldMemberId })        
      })
      
      const updatedGroups = groups.map((grp)=>{
        if(grp._id === group._id){
          grp.groupMembers = []
          return grp;
        }else return grp
      })

      // will be the all groups after the choosen one being updated
      setGroups(updatedGroups)
      
    } catch (error) {
      //console.log(error)
    }
  }



  const deleteGroup = async (group) => {
    try {

      const response = await axiosObj.delete(`/deleteGroupByAdmin/${group._id}` , {
        headers : {
          "admin_header" : `admin ${token}`
        }
      })

      response.data.oldGroupMembers.map((oldMemberId) => {
        socket.emit("removedFromGroup" , { senderId : user._id , receiverId : oldMemberId , convId : group.conversationId , removedUserId : oldMemberId})        
        // socket.emit("removedFromGroup" , { senderId : user._id , receiverId : oldMemberId })        
      })

      setGroups(groups.filter(singleGroup => singleGroup._id !== response.data.groupId))

    } catch (error) {
      //console.log(error)
    }
  }




  return (
    <div className='allGroups'>
    
      <div style={{ maxHeight: "800px" , overflowY : "auto"}}>
        
      <table>

        <tr>
          <th>id</th>
          <th>Group-name</th>
          <th>Group-members</th>
          <th>Actions</th>
        </tr>

        {groups && groups.map((singleGroup , index) => {
          return(
            <tr key={index}>
              
              <td className='tableData'>{singleGroup._id}</td>
              
              <td className='tableData'>{singleGroup.groupName}</td>

              <td className='tableData'>
                <Link to={`/editGroup/${singleGroup.conversationId}/${singleGroup._id}`}>
                  <button className='editGroupBtn'>Edit Group Members</button>
                </Link>
              </td>
              
              <td className='custom-tableData'>

                <div className='actionBtns'> 

                  
                  <button disabled={singleGroup?.groupMembers?.length === 0} onClick={() => removeGroupMembers(singleGroup)} className='editGroupBtnDelete'>Remove group members</button>
                
                  
                  <button onClick={() => deleteGroup(singleGroup)} className='editGroupBtnDelete'>Delete All Group Data</button>
                                   
                </div>
              
              </td>

            </tr>

          ) 
        })} 

        {/* {openApproveModal && <Approve users={users} setAprroveDelete={setAprroveDelete} setOpenApproveModal={setOpenApproveModal} setUsers={setUsers} />}  */}

      </table>

      </div>

    </div>
  )
}

export default AllGroups