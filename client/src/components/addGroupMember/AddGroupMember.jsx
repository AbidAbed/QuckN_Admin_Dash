import React, { useEffect, useState } from 'react'
import "./addGroupMember.css"
import CancelIcon from '@mui/icons-material/Cancel';
import { useAppContext } from '../../context/appContext';
import { axiosObj } from '../../utils/axios';
import { useParams } from 'react-router-dom';
import socket from '../../socketConfig';



export const AddGroupMember = ({setOpenAddGroupMemberModal , setUsersInGroup , usersInGroup}) => {

    const [users , setUsers] = useState([])

    const {user , token} = useAppContext()

    const params = useParams()



    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axiosObj.get("/getUsersByAdmin" , {
                    headers : {
                        "admin_header" : `admin ${token}`
                    }
                })
                setUsers(response.data.filter((singleUser) => {
                    return singleUser.username !== user.username
                }))
            } catch (error) {
                //console.log(error)
            }   
        }

        getUsers()

    } , [])



    const addGroupMember = async (groupId , userId) => {
        try {
            const response = await axiosObj.patch(`/addGroupMemeber/${groupId}/${userId}` , {} , {
                headers : {
                    "admin_header" : `admin ${token}`
                }
            })
            setUsersInGroup([...usersInGroup , {...response.data}])
            setOpenAddGroupMemberModal(false)
            socket.emit("addedToGroup" , { senderId : user._id , receiverId : userId , addedUsersMembersIds : usersInGroup})        

        } catch (error) {
            //console.log(error)
        }
    }



    
  return (
    <div className='groupMember'>

    <div className='groupMember_container'>

        <div className='groupMember_container_header'>
            <h3 className='groupMember_container__header--tag'>Send a message</h3>
            <CancelIcon onClick={() => setOpenAddGroupMemberModal(false)} className='createChatCancelIcon' />
        </div>
        
        <div className='groupMember_users--container'>
            {users && users.map((singleUser) => {
                return(
                    <div onClick={() => addGroupMember(params.groupId , singleUser._id)} key={singleUser._id} className='groupMember__container__users--container--user'>{singleUser?.username}</div>
                )
            })}
        </div>

    </div>

</div>
  )
}
