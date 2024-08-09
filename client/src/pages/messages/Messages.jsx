import React, { useEffect, useState } from 'react'
import "./messages.css"
import { axiosObj } from '../../utils/axios'
import { useAppContext } from '../../context/appContext'
import socket from '../../socketConfig'



const Messages = () => {

    const { token , user } = useAppContext()

    const [users, setUsers] = useState([])
    const [sortedMessagesNum, setSortedMessagesNum] = useState(null)


    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
      ]
      

      const years = [
        "2023",
        "2024",
      ]


    const days = Array.from({ length: 31 }, (_ , i) => i + 1)


    const [formData, setFormData] = useState({
        user: '',
        msgType: '',
        converId: '',
        month: "",
        day: "",
        year: "",
    })


    //console.log(formData);

    useEffect(() => {

        const getUsers = async () => {
            try {
                const response = await axiosObj.get("/getUsersByAdmin", {
                    headers: {
                        "admin_header": `admin ${token}`
                    }
                })
                setUsers(response.data)
            } catch (error) {
                //console.log(error)
            }
        }

        getUsers()

    }, [])




    useEffect(() => {
        
        if (formData.user !== "") {
            const getuserConversations = async () => {
                try {
                    const response = await axiosObj.get(`/getUserAllConversation/${formData.user}` , {
                        headers : {
                            "admin_header" : `admin ${token}`
                        }
                    })
                    setUserConverastions(response.data)
                } catch (error) {
                    //console.log(error);
                }
            }

            getuserConversations()
        }

    }, [formData.user])




    const [filteredMessages, setFilteredMessages] = useState([])
    const [message, setMessage] = useState('')
    const [userConverastions , setUserConverastions] = useState([])


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }


    
    
    const handleDeleteSortedMessages = async (e) => {

        // let url = `/sortedDeleteMsg/${formData.user && formData.user}?${formData.converId && `converId=${formData.converId}`}${formData.msgType && `&msgType=${formData.msgType}`}${formData.conversatationType && `&conversatationType=${formData.conversatationType}`}${formData.order && `&order=${formData.order}`}${formData.month && `&month=${formData.month}`}${formData.day && `&day=${formData.day}`}${formData.year && `&year=${formData.year}`}`
        let url = `/sortedDeleteMsg/${formData.user && formData.user}?`;

        if (formData.converId) {
            url += `converId=${formData.converId}&`;
        }
        if (formData.msgType) {
            url += `msgType=${formData.msgType}&`;
        }
        if (formData.conversatationType) {
            url += `conversatationType=${formData.conversatationType}&`;
        }
        if (formData.order) {
            url += `order=${formData.order}&`;
        }
        if (formData.month) {
            url += `month=${formData.month}&`;
        }
        if (formData.day) {
            url += `day=${formData.day}&`;
        }
        if (formData.year) {
            url += `year=${formData.year}&`;
        }
        
        // Remove trailing '&' if exists
        url = url.replace(/&$/, '');  

        if(formData.user !== ""){
        
            e.preventDefault()
        
            try {

                const response = await axiosObj.delete(url , {
                    headers : {
                        "admin_header" : `admin ${token}`
                    }
                })
                

                // could be updated
                const deletedMessages = [].concat(...response.data.map((value) => {
                    return value.copiedDeletedMsgArray.map((msg) => {
                        const conversation = value.userConversations.find(conv => conv._id === msg.conversationId);
                        return {
                            messageId: msg._id,
                            conversationId: msg.conversationId,
                            members: conversation ? conversation.members : [] ,
                            sender : msg.sender
                        };
                    });
                }));
                

                deletedMessages.forEach((deletedMsg) => {
                    socket.emit("messageDeleted", {
                      message_id: deletedMsg.messageId,
                      conversationId: deletedMsg.conversationId,
                      members: deletedMsg.members,
                      senderId: deletedMsg.sender,
                    });
                  });



            } catch (error) {
                //console.log(error);
            }
        }
    }




    const countSortedMessages = async (e) => {

        let url = `/countSortedMessages/${formData.user ? formData.user : ''}?`;

        if (formData.converId) {
            url += `converId=${formData.converId}&`;
        }
        if (formData.msgType) {
            url += `msgType=${formData.msgType}&`;
        }
        if (formData.conversatationType) {
            url += `conversatationType=${formData.conversatationType}&`;
        }
        if (formData.order) {
            url += `order=${formData.order}&`;
        }
        if (formData.month) {
            url += `month=${formData.month}&`;
        }
        if (formData.day) {
            url += `day=${formData.day}&`;
        }
        if (formData.year) {
            url += `year=${formData.year}&`;
        }
        
        // Remove trailing '&' if exists
        url = url.replace(/&$/, '');    

        if(formData.user !== ""){
        
            e.preventDefault()
        
            try {

                const response = await axiosObj.get(url , {
                    headers : {
                        "admin_header" : `admin ${token}`
                    }
                })
        
                setSortedMessagesNum(response.data);
        
            } catch (error) {
                //console.log(error);
            }
        }
    }

    


    return (
        <div className='messages'>

            <h1 className='message-filter-header'>Message Filtering</h1>

            <form className='messages-form-container'>

                <div className='message-form-row'>

                    <label className='messages-label' htmlFor="msgType">Users</label>

                    <select onChange={handleChange} className='mesages-select' id="user" name="user" value={formData.user}>
                        <option disabled value="">Select</option>
                        {users && users.map((singleUser) => {
                            return (
                                <option key={singleUser._id} value={singleUser._id}>{singleUser.username}</option>
                            )
                        })}
                    </select>

                </div>



                <div className='message-form-row'>

                    <label className='messages-label' htmlFor="msgType">User Chat</label>

                    <select onChange={handleChange} disabled={formData.user === ""} className='mesages-select' id="converId" name="converId" value={formData.converId}>
                        <option disabled value="">Select</option>
                        {formData.user !== "" && userConverastions && userConverastions.map((userConversation) => {
                            return(
                                <option key={userConversation.conversationId} value={userConversation.conversationId}>{userConversation.conversationName}</option>
                            )
                        })}
                    </select>
                </div>



                <div className='message-form-row'>

                    <label className='messages-label' htmlFor="msgType">Message Type</label>

                    <select onChange={handleChange} className='mesages-select' id="msgType" name="msgType" value={formData.msgType}>
                        <option disabled value="">Select</option>
                        <option value="filesMessages">File Messages</option>
                        <option value="textMessages">Text Messages</option>
                        <option value="allMessages">All messages</option>
                    </select>
                </div>



                {/* <div className='message-form-row'>

                    <label className='messages-label' htmlFor="conversatationType">Conversation Type</label>

                    <select onChange={handleChange} className='mesages-select' id="conversatationType" name="conversatationType" value={formData.conversatationType}>
                        <option disabled value="">Select</option>
                        <option value="groupConversations">Group Conversations</option>
                        <option value="individualConversations">Individual Conversations</option>
                        <option value="allConversations">All Conversations</option>
                    </select>
                    
                </div>



                <div className='message-form-row'>

                    <label className='messages-label' htmlFor="sort">Sort By</label>

                    <select className='mesages-select' id="sort" name="sort">
                        <option value="createdAt">Created At</option>
                    </select>

                </div>



                <div className='message-form-row'>

                    <label className='messages-label' htmlFor="order">Order</label>

                    <select  onChange={handleChange} className='mesages-select' id="order" name="order">
                        <option disabled selected value="">Select</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>

                </div>
                 */}



                <div className='message-form-row'>

                <label className='messages-label'>Select Month</label>
                
                <select onChange={handleChange} value={formData.month} name='month' className='mesages-select'>
                    <option selected disabled value="">Select Month</option>
                    {months.map((month) => (
                    <option key={month.value} value={month.value}>
                        {month.label}
                    </option>
                    ))}
                </select>

                </div>



                <div className='message-form-row'>

                <label className='messages-label'>Select Day</label>
                
                <select onChange={handleChange} value={formData.day} name='day' className='mesages-select'>
                    <option selected disabled value="">Select Day</option>
                    {days.map((day) => (
                    <option key={day} value={day}>
                        {day}
                    </option>
                    ))}
                </select>

                </div>



                <div className='message-form-row'>

                <label className='messages-label'>Select Year</label>
                
                <select onChange={handleChange} value={formData.year} name='year' className='mesages-select'>
                    <option selected disabled value="">Select Year</option>
                    {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                    ))}
                </select>

                </div>



                <div className='message-form-row'>

                    <button onClick={countSortedMessages} className='messagesSortBtn'>Count sorted Messages</button>

                </div>


                <div className='message-form-row'>

                    <button className='messagesSortBtn'>Reset sort</button>

                </div>
                
                <div className='message-form-row'>

                    <button onClick={handleDeleteSortedMessages} className='messagesSortBtn'>Delete</button>

                </div>

            </form>

            {sortedMessagesNum && <p style={{fontWeight : 500 , fontSize : "35px" , color : "red"}}>{sortedMessagesNum.messagesNum} {sortedMessagesNum.messagesNum > 1 && "sorted messages"} {sortedMessagesNum.messagesNum === 1 && "sorted message"}</p>}
       
       </div>
    )
}

export default Messages      