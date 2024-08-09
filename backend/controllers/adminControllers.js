const User = require("../models/userModel")
const Group = require("../models/groupModel")
const Message = require("../models/messageModel")
const Conversation = require("../models/conversationModel")
const File = require("../models/fileModel")
const createError = require("../middlewares/createError")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const staticFolder = require("../pathConfig")
const fs = require("fs")
const path = require("path")
const UnSeenMessages = require("../models/unSeenMessages")



const adminLogin = async (req, res, next) => {

    try {

        const adminLoginSchema = Joi.object({
            email: Joi.string().required().not().empty().email(),
            password: Joi.string().not().empty().min(8)
        })

        const { error, value } = adminLoginSchema.validate(req.body)

        if (error) return next(createError(404, "Invalid Credentials"))

        const { email, password } = value

        const adminUser = await User.findOne({ email }).select("+password")

        if (!adminUser) return next(createError(404, "Invalid Credentials"))

        if(!adminUser.adminOfAdmins) return next(createError(401 , "Access denied , admin only"))

        const isPasswordMatched = await bcrypt.compare(password, adminUser.password)

        if (!isPasswordMatched) return next(createError(400, "Invalid Credentials"))

        const token = adminUser.createJWT()

        adminUser.password = undefined

        res.status(200).json({ adminUser, token })

    } catch (error) {
        next(error)
    }
}




const updateAdminProfile = async (req , res , next) => {
    try {
        const {adminId} = req.params

        const {username , email , password} = req.body

        const adminUser = await User.findById(adminId)

        if(adminUser._id.toString() !== adminId){
            return next(createError(401 , "You are not Authorized to update this admin profile"))
        }

        if(username){
            adminUser.username = username
        }

        if(email){
            adminUser.email = email
        }

        if(password){
            adminUser.password = await bcrypt.hash(password , 10)
        }

        await adminUser.save()

        res.status(200).json(adminUser)

    } catch (error) {
        next(error)
    }
}




const createUser = async (req, res, next) => {
    try {
        const newUser = new User(req.body)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newUser.password, salt)
        newUser.password = hashedPassword
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}



const blockUser = async (req, res, next) => {
    try {
        
        const { userId } = req.params
        const user = await User.findById(userId)
        user.isBlocked = "true"
        await user.save()
        res.status(200).json({ msg: "user Blocked successfully" })

    } catch (error) {
        next(error)
    }
}




const removeBlockedUser = async (req , res , next) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId)
        user.isBlocked = "false"
        await user.save()
        res.status(200).json({ msg: "Blocked removed successfully" })
    } catch (error) {
        next(error)
    }
}



const updateUser = async (req, res, next) => {
    try {

        const { userId } = req.params

        let existUser = await User.findById(userId).select("+password")

        let hashedPassword = existUser.password

        if (req.body.password) {
            hashedPassword = await bcrypt.hash(req.body.password, 10)
        }

        const user = await User.findByIdAndUpdate(userId, { ...req.body, password: hashedPassword }, { new: true })

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}




const getUsersByAdmin = async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}




const getUserById = async (req, res, next) => {
    try {
        const { userId } = req.params

        const user = await User.findOne({ _id: userId })

        if (!user) {
            return next(createError(404, "User with id not exist"))
        }

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}




const getGroupsByAdmin = async (req, res, next) => {
    try {
        const groups = await Group.find()
        res.status(200).json(groups)
    } catch (error) {
        next(error)
    }
}




const deleteGroupByAdmin = async (req, res, next) => {

    try {

        const { groupId } = req.params

        const group = await Group.findById(groupId)

        if (!group) {
            return next(createError(404, "group not exist"))
        }

        // const unSeenMessagesObj = await UnSeenMessages.findOne({conversationsId : group.conversationId})
        // unSeenMessagesObj.conversationsId = unSeenMessagesObj.conversationsId.filter(converId => converId !== group.conversationId)
        // await unSeenMessagesObj.save()

        const oldGroupMembers = group.groupMembers

        await Promise.all((group.groupMessages.map((groupMsgId) => {
            return Message.deleteMany({ _id: groupMsgId })
        })))

        await Conversation.findByIdAndDelete(group.conversationId)

        await Group.deleteOne({ _id: groupId })

        res.status(200).json({oldGroupMembers , groupId : group._id})

    } catch (error) {
        next(error)
    }
}




const deleteGroupMembers = async (req, res, next) => {
    try {
        const { groupId } = req.params

        const group = await Group.findById(groupId)
        
        if (!group) {
            return next(createError(404, "group not exist"))
        }


        // const unSeenMessagesObj = await UnSeenMessages.findOne({conversationsId : group.conversationId})
        // unSeenMessagesObj.conversationsId = unSeenMessagesObj.conversationsId.filter(converId => converId !== group.conversationId)
        // await unSeenMessagesObj.save()


        const oldGroupMembers = group.groupMembers 

        group.groupMembers = []

        const conversationGroup = await Conversation.findOne({_id : group.conversationId})
        conversationGroup.members = []
        await conversationGroup.save()

        await group.save()

        res.status(200).json({oldGroupMembers , groupId : group._id})

    } catch (error) {
        next(error)
    }
}




const addGroupMemeber = async (req, res, next) => {
    try {
        const { groupId, userId } = req.params

        const group = await Group.findById(groupId)

        // const unSeenMessagesObj = await UnSeenMessages.findOne({userId})

        if (!group) {
            return next(createError(404, "Group not exist"))
        }

        const user = await User.findById(userId)

        if (!user) {
            return next(createError(404, "User not exist"))
        }

        if (group.groupMembers.includes(userId)) {
            return next(createError(400, "User already in the group"))
        }

        group.groupMembers.push(userId)

        let groupConversation = await Conversation.findById({_id : group.conversationId})
        groupConversation.members.push(userId)
        await groupConversation.save()

        // if(!unSeenMessagesObj.conversationsId.includes(group.conversationId)){
        //     unSeenMessagesObj.conversationsId.push(group.conversationId)
        // }
        // await unSeenMessagesObj.save()

        await group.save()

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}



 
const removeGroupMember = async (req, res, next) => {
    try {
        const { groupId, userId } = req.params

        const group = await Group.findById(groupId)

        // const unSeenMessagesObj = await UnSeenMessages.findOne({userId})
        
        if (!group) {
            return next(createError(404, "Group not exist"))
        }

        const user = await User.findById(userId)

        if (!user) {
            return next(createError(404, "User not exist"))
        }

        group.groupMembers = group.groupMembers.filter((groupMember) => groupMember !== userId)


        let groupConversation = await Conversation.findById({_id : group.conversationId})
        groupConversation.members = groupConversation.members.filter(groupMember => groupMember !== userId)
        await groupConversation.save()

        // if(unSeenMessagesObj.conversationsId.includes(group?.conversationId)){
        //     unSeenMessagesObj.conversationsId = unSeenMessagesObj.conversationsId.filter(converId => converId !== group.conversationId)
        // }
        // await unSeenMessagesObj.save()
        
        await group.save()

        res.status(200).json(userId)

    } catch (error) {
        next(error)
    }

}




const getUsersInGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params

        const group = await Group.findById(groupId)

        if (!group) {
            return next(createError(404, "Group not exist"))
        }

        const groupUsers = await Promise.all(group.groupMembers.map((groupMember) => {
            return User.findById(groupMember)
        }))

        res.status(200).json(groupUsers)

    } catch (error) {
        next(error)
    }
}




const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}




const countDB = async (req, res, next) => {
    try {

        const usersNum = await User.countDocuments()
        const messagesNum = await Message.countDocuments()
        const filesNum = await File.countDocuments()

        res.status(200).json({ usersNum, messagesNum, filesNum })

    } catch (error) {

    }
}



const deleteMsg = async (req, res, next) => {
    try {
        const { msgId } = req.params

        const msg = await Message.findById(msgId)

        if (!msg) {
            return next(createError(404, "Message not found"))
        }

        if (msg.file) {
            const file = await File.findById(msg.file)

            const filePath = `${staticFolder}\\${file._doc.path}.${file._doc.type}` 

            if (
                !file.type.includes("png") &&
                !file.type.includes("jpg") &&
                !file.type.includes("jpeg") &&
                !file.type.includes("mpeg") &&
                !file.type.includes("mp4")
              )

                fs.rmdir(
                  `${staticFolder}\\${file.createdName}`,
                  {
                    recursive: true,
                  }, 
                  (err) => {
                    if (err) {
                      console.error("Error removing directory:", err)
                    } else {
                      console.log("Directory removed successfully.")
                    }
                  }
                )


            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath)
            }else {
                return next(createError(404 , `File ${filePath} not found`))
            }

            await File.deleteOne({ _id: msg.file })

            await Message.deleteOne({ _id: msgId })

            res.status(200).json({ msg: "Message and its files deleted successfully" })

        }

        await Message.deleteOne({ _id: msgId })

        res.status(200).json({ msg: "Message deleted successfully" })

    } catch (error) {
        next(error)
    }
}




const sortedDeleteMsg = async (req, res, next) => {

    try {

        const { userId } = req.params

        let userMessages = await Message.find({ sender: userId })

        let userConversations = await Conversation.find({ members: userId })

        const user = await User.findById(userId)

        const converId = req.query.converId

        const limit = req.query.limit || 10
        // const startIndex = req.query.startIndex || 0

        // const page = req.query.page || 1

        // const skip = (page - 1) * limit


        const totalMessagesForUser = await Message.countDocuments({ sender: userId })

        const totalPages = Math.ceil(totalMessagesForUser / limit)

        const msgType = req.query.msgType || ""
        const conversatationType = req.query.conversatationType || ""

        const sort = req.query.sort || "createdAt"
        const order = req.query.order || "desc"
        
        const specificYear = req.query.year || ""
        const specificMonth = req.query.month || ""
        const specificDay = req.query.day || ""

        // messages filter

        if (msgType && msgType === "textMessages") {
            userMessages = userMessages.filter(userMsg => userMsg.file === null);
        } else if (msgType && msgType === "filesMessages") {
            userMessages = userMessages.filter(userMsg => userMsg.file);
        }

        if (converId) {
            userMessages = userMessages.filter(userMsg => userMsg.conversationId === converId);
        }

 
        // If message type is "allMessages", do not apply any additional filtering
        
        // Filter messages based on conversation type
        // if (conversatationType === "groupConversations") {

        //     const groupConversationsIds = userConversations
        //         .filter(userConversation => userConversation.isGroup)
        //         .map(group => group._id.toString());
        
        //     userMessages = userMessages.filter(userMsg => groupConversationsIds.includes(userMsg.conversationId));

        // } else if (conversatationType === "individualConversations") {

        //     const individualConversationsIds = userConversations
        //         .filter(userConversation => !userConversation.isGroup)
        //         .map(user => user._id.toString());
        
        //     userMessages = userMessages.filter(userMsg => individualConversationsIds.includes(userMsg.conversationId));

        // } else if (conversatationType === "allConversations") {

        //     // Retrieve messages from all conversations
        //     const allConversationsIds = userConversations
        //         .map(conversation => conversation._id.toString());
        
        //     userMessages = userMessages.filter(userMsg => allConversationsIds.includes(userMsg.conversationId));

        // }
        
        // Optionally, if you want to retrieve only text or file messages in a specific conversation
  

    if (req.query.month !== undefined && req.query.day !== undefined ) {
        if (req.query.year !== undefined) {
            // Filter by year , month , and day when all are provided
            userMessages = userMessages.filter((userMsg) => {
            return (
                userMsg.createdAt.toISOString().split("T")[0].split("-")[0] === specificYear &&
                userMsg.createdAt.toISOString().split("T")[0].split("-")[1] === specificMonth &&
                userMsg.createdAt.toISOString().split("T")[0].split("-")[2] === specificDay
            )
        })
        } else {
        // Filter by month and day only when year is not provided
            userMessages = userMessages.filter((userMsg) => { 
            return (
                userMsg.createdAt.toISOString().split("T")[0].split("-")[1] === specificMonth &&
                userMsg.createdAt.toISOString().split("T")[0].split("-")[2] === specificDay
            )
        })
        }
        } else if (req.query.month !== undefined) {
        // Filter by month only when day is not provided
            userMessages = userMessages.filter((userMsg) => {
            return userMsg.createdAt.toISOString().split("T")[0].split("-")[1] === specificMonth
        })
        } else if (req.query.year !== undefined) {
        // Filter by year only when month and day are not provided
            userMessages = userMessages.filter((userMsg) => {
            return userMsg.createdAt.toISOString().split("T")[0].split("-")[0] === specificYear 
        })
    }



        userMessages = userMessages.sort((a, b) => {

            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)

            // desc means the latest (new one) , asc means the oldest (oldest one)
            if (order === "asc") {
                return dateA - dateB
            }

            if (order === "desc") {
                return dateB - dateA
            }
        })


        //////////////////////////////////////////////////////////////

        const copiedDeletedMsgArray = [...userMessages]

        await Promise.all(userMessages.map((userMsg) => {
            return Message.findByIdAndDelete(userMsg._id)
        }))

        let msg = userMessages.length === 0 ? "user have no messages" : "Filterd messages deleted successfully"

        res.status(200).json([{copiedDeletedMsgArray , userConversations}])

        ///////////////////////////////////////////////////////////////

        // res.status(200).json({userMessages , messagesNum : userMessages.length})

        // userMessages = userMessages.slice(startIndex, startIndex + limit)

        // res.status(200).json({messagesNum : userMessages.length , userMessages , userConversations})
        // res.status(200).json({docNum : userMessages.length , userMessages})

        // res.status(200).json(totalPages)

    } catch (error) {
        next(error)
    }
}




const countSortedMessages = async (req, res, next) => {

    try {

        const { userId } = req.params

        let userMessages = await Message.find({ sender: userId })

        let userConversations = await Conversation.find({ members: userId })

        const user = await User.findById(userId)

        const converId = req.query.converId

        const limit = req.query.limit || 10
        const startIndex = req.query.startIndex || 0

        const page = req.query.page || 1

        const skip = (page - 1) * limit

        const totalMessagesForUser = await Message.countDocuments({ sender: userId })

        const totalPages = Math.ceil(totalMessagesForUser / limit)

        const msgType = req.query.msgType || ""
        const conversatationType = req.query.conversatationType || ""

        const sort = req.query.sort || "createdAt"
        const order = req.query.order || "desc"
        
        const specificYear = req.query.year || ""
        const specificMonth = req.query.month || ""
        const specificDay = req.query.day || ""
 

        // messages filter
                
        if (msgType && msgType === "textMessages") {
            userMessages = userMessages.filter(userMsg => userMsg.file === null);
        } else if (msgType && msgType === "filesMessages") {
            userMessages = userMessages.filter(userMsg => userMsg.file !== null);
        }

        if (converId) {
            userMessages = userMessages.filter(userMsg => userMsg.conversationId === converId);
        }

        // console.log("after" , userMessages);
        // If message type is "allMessages", do not apply any additional filtering
        
        // Filter messages based on conversation type
        // if (conversatationType === "groupConversations") {

        //     const groupConversationsIds = userConversations
        //         .filter(userConversation => userConversation.isGroup)
        //         .map(group => group._id.toString());
        
        //     userMessages = userMessages.filter(userMsg => groupConversationsIds.includes(userMsg.conversationId));

        // } else if (conversatationType === "individualConversations") {

        //     const individualConversationsIds = userConversations
        //         .filter(userConversation => !userConversation.isGroup)
        //         .map(user => user._id.toString());
        
        //     userMessages = userMessages.filter(userMsg => individualConversationsIds.includes(userMsg.conversationId));

        // } else if (conversatationType === "allConversations") {

        //     // Retrieve messages from all conversations
        //     const allConversationsIds = userConversations
        //         .map(conversation => conversation._id.toString());
        
        //     userMessages = userMessages.filter(userMsg => allConversationsIds.includes(userMsg.conversationId));

        // }
        
        // Optionally, if you want to retrieve only text or file messages in a specific conversation
  
        // // get files messages inside specific conversation
        // if (msgType && msgType === "filesMessages") {
        //     userMessages = userMessages.filter((userMsg) => userMsg.file !== null)
        // }

        // // if (msgType && msgType === "filesMesasges" && converId) {
        // //     userMessages = userMessages.filter((userMsg) => userMsg.file && userMsg.conversationId === converId)
        // // } else {
        // //     // get all user files messages 
        // //     if (msgType && msgType === "filesMessages") {
        // //         userMessages = userMessages.filter((userMsg) => userMsg.file)
        // //     }
        // //     // get all mssages inside specific conversation
        // //     if (converId) {
        // //         userMessages = userMessages.filter((userMsg) => userMsg.conversationId === converId)
        // //     }
        // // }

        // if(msgType && msgType === "textMessages"){
        //     userMessages = userMessages.filter(userMsg => userMsg.file === null)
        // }

        // //////////////////////////////////////////////////////////////

        // // conversation filter
        // if (conversatationType && conversatationType === "groupConversations") {

        //     const groupConversationsIds = userConversations
        //         .filter((userConversation) => userConversation.isGroup == true)
        //         .map((group) => group._id.toString())


        //     userMessages = userMessages.filter((userMsg) => {
        //         return groupConversationsIds.includes(userMsg.conversationId)
        //     })

        // }


        // if (conversatationType && conversatationType === "individualConversations") {

        //     const userConversationsIds = userConversations
        //         .filter((userConversation) => userConversation.isGroup == false)
        //         .map((user) => user._id.toString())

        //         userMessages = await Promise.all((userConversationsIds.map((conversationId) => {
        //             return Message.findOne({conversationId})
        //         })))

        //         console.log(userMessages);

        // }


        // if (conversatationType && conversatationType === "allConversations") {

        //     const groupConversationsIds = userConversations
        //         .filter((userConversation) => userConversation.isGroup)
        //         .map((group) => group._id.toString())


        //     const userConversationsIds = userConversations
        //         .filter((userConversation) => !userConversation.isGroup)
        //         .map((user) => user._id.toString())

        //         const userAllMessages = await Promise.all((userConversationsIds.map((conversationId) => {
        //             return Message.findOne({conversationId})
        //         })))

        //         const userAllGroupsMessages = await Promise.all((groupConversationsIds.map((conversationId) => {
        //             return Group.findOne({conversationId})
        //         })))

        //         userMessages = [...userAllMessages , ...userAllGroupsMessages]
                
        // }


 
    if (req.query.month !== undefined && req.query.day !== undefined ) {
        if (req.query.year !== undefined) {
            // Filter by year , month , and day when all are provided
            userMessages = userMessages.filter((userMsg) => {
            return (
                userMsg.createdAt.toISOString().split("T")[0].split("-")[0] === specificYear &&
                userMsg.createdAt.toISOString().split("T")[0].split("-")[1] === specificMonth &&
                userMsg.createdAt.toISOString().split("T")[0].split("-")[2] === specificDay
            )
        })
        } else {
        // Filter by month and day only when year is not provided
            userMessages = userMessages.filter((userMsg) => {
            return (
                userMsg.createdAt.toISOString().split("T")[0].split("-")[1] === specificMonth &&
                userMsg.createdAt.toISOString().split("T")[0].split("-")[2] === specificDay
            )
        })
        }
        } else if (req.query.month !== undefined) {
        // Filter by month only when day is not provided
            userMessages = userMessages.filter((userMsg) => {
            return userMsg.createdAt.toISOString().split("T")[0].split("-")[1] === specificMonth
        })
        } else if (req.query.year !== undefined) {
        // Filter by year only when month and day are not provided
            userMessages = userMessages.filter((userMsg) => {
            return userMsg.createdAt.toISOString().split("T")[0].split("-")[0] === specificYear 
        })
    }



        userMessages = userMessages.sort((a, b) => {

            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)

            // desc means the latest (new one) , asc means the oldest (oldest one)
            if (order === "asc") {
                return dateA - dateB
            }

            if (order === "desc") {
                return dateB - dateA
            }
        })


        res.status(200).json({messagesNum : userMessages.length})

    } catch (error) {
        next(error)
    }
}




const getAllUserConversation = async (req, res, next) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId);

        let userGroupConversation
        let userIndividualConversation

        let userConversation = await Conversation.find({ members: userId })

        userGroupConversation = userConversation.filter((conver) => {
            return conver.isGroup
        })

        userIndividualConversation = userConversation.filter((conver) => {
            return !conver.isGroup
        })

        let userGroups = await Promise.all(userGroupConversation.map((userGroup) => {
            return Group.findOne({ conversationId: userGroup._id })
        }));

        let uniqueUserIds = []
        let userConversationIds = {}

        userIndividualConversation.forEach((singleChat) => {

            singleChat.members.forEach((member) => {

                if (member !== userId) {

                    uniqueUserIds.push(member);

                    if (!userConversationIds[member]) {
                        userConversationIds[member] = []
                    }

                    userConversationIds[member].push(singleChat._id)

                }

            })

        })

        const reciverUsers = await Promise.all(uniqueUserIds.map((reciverUser) => {
            return User.findById(reciverUser);
        }));

        const mergedData = reciverUsers.map((singleUser) => {
            const conversationIds = userConversationIds[singleUser._id] || []
            return {
                _id: singleUser._id,
                conversationName: singleUser.username,
                conversationId: conversationIds.length === 1 ? conversationIds[0] : conversationIds,
            };
        });

        const finalData = [
            ...mergedData,
            ...userGroups.map((group) => ({
                _id: group._id,
                conversationName: group.groupName,
                conversationId: group.conversationId,
            })),
        ];

        res.status(200).json(finalData)
        
    } catch (error) {
        next(error);
    }
};




const getFileByAdmin = async (req , res , next) => {

    try {

        const {fileId} = req.params

        const file = await File.findById(fileId)
        
        const fileName = `${file._doc.filename}.${file._doc.type}`

        res.status(200).sendFile(`${staticFolder}\\${file._doc.path}.${file._doc.type}` , {
            headers : {
                'Content-Disposition': `attachment; filename="${fileName}"`,
            }
        })

    } catch (error) {
        next(error) 
    }
}




const getFilesByAdmin = async (req , res , next) => {

    try {

        const {fileType , sort} = req.query
        const page = req.query.page || 1

        let filesName = []

        if(fileType === "documents"){

            fs.readdir(`${staticFolder}\\uploads` , async (err , files) => {

                if(err){
                    return next(createError(404 , "no files in this folder"))
                }

                /////////////////////////////////////////////////////////////////

                filesName = files.map((file) => {
                    return file.split(".")[0]
                })

                filesName = filesName.map((fileName) => {
                    return parseInt(fileName)
                })

                filesName = filesName.sort((a , b) => {
                    return b - a
                })

                filesName = filesName.slice((page - 1) * 10 , (page - 1) * 10 + 10)

                
                filesName = filesName.map((fileName) => {
                    return fileName.toString()
                })

                ////////////////////////////////////////////////////////////////////

                // const filesDoc = await Promise.all((filesName.map(fileName => {
                //     return File.findOne({createdName : fileName})
                // })))


                // get all files inside db that its createdName key are inside filesName array
                const filesDoc = await File.find({createdName : {$in : filesName}})

                return res.status(200).json(filesDoc) 

            })
        }



        if(fileType === "images" ){

            fs.readdir(`${staticFolder}\\images` , async (err , files) => {

                if(err){
                    return next(createError(404 , "no files in this folder"))
                }

                filesName = files.map((file) => {
                    return file.split(".")[0]
                })

                filesName = filesName.map((fileName) => {
                    return parseInt(fileName)
                })
                
                filesName = filesName.sort((a , b) => {
                    return b - a
                })

                
                filesName = filesName.slice((page - 1) * 10 , (page - 1) * 10 + 10)

                
                filesName = filesName.map((fileName) => {
                    return fileName.toString()
                })

                const filesDoc = await File.find({createdName : {$in : filesName}})

                return res.status(200).json(filesDoc) 

            })

        }



        if(fileType === "videos"){

            fs.readdir(`${staticFolder}\\videos` , async (err , files) => {

                if(err){
                    return next(createError(404 , "no files in this folder"))
                }

                filesName = files.map((file) => {
                    return file.split(".")[0]
                })

                filesName = filesName.map((file) => {
                    return parseInt(file)
                })

                filesName = filesName.sort((a , b) => {
                    return b - a
                })

                filesName = filesName.slice((page - 1) * 10 , (page - 1) * 10 + 10)

                filesName = filesName.map((file) => {
                    return file.toString()
                })
                
                const filesDoc = await File.find({createdName : {$in : filesName}})

                return res.status(200).json(filesDoc)

            })
        }



        if(fileType === "audios"){

            fs.readdir(`${staticFolder}\\voices` , async (err , files) => {

                if(err){
                    return next(createError(404 , "no files in this folder"))
                }

                filesName = files.map((file) => {
                    return file.split(".")[0]
                })

                filesName = filesName.map((file) => {
                    return parseInt(file)
                })

                filesName = filesName.sort((a , b) => {
                    return b - a
                })
 
                
                filesName = filesName.slice((page - 1) * 10 , (page - 1) * 10 + 10)
                
                
                filesName = filesName.map((file) => {
                    return file.toString()
                })
                
                const filesDoc = await File.find({createdName : {$in : filesName}})
                
                return res.status(200).json(filesDoc)

            })
        }



        if(fileType === "all"){

            const folders = ['images', 'voices', 'uploads', 'videos'];

            folders.forEach((folder) => {

                const singleFolderPath = path.join(staticFolder , `\\${folder}`)
                
                try {
 
                    const files = fs.readdirSync(singleFolderPath)
                    
                    files.map((file) => {
                        filesName.push(file.split(".")[0])
                    }) 
                
                } catch (error) {
                    next(error)
                }
                
            })
            
            filesName = filesName.map((file) => {
                return parseInt(file)
            })

            filesName = filesName.sort((a , b) => {
                return b - a
            })

            filesName = filesName.slice((page - 1) * 10 , (page - 1) * 10 + 10)
            
            filesName = filesName.map((file) => {
                return file.toString()
            })

            
            try {

                const filesDoc = await File.find({createdName : {$in : filesName}})
            
                return res.status(200).json(filesDoc)
            
            } catch (error) {
                next(error)
            }

        }
        
        if(fileType === ""){
            return res.status(200).json({msg : "No Files Type Selected"})
        }

    }catch(error){
        next(error)
    }
        
}

  


const deleteSpecificFile = async (req , res , next) => {
    try {
        const {fileId} = req.params
        
        const file = await File.findById(fileId)

        if(!file){
            return next(createError(404 , "File not exist"))
        }

        const filePath = `${staticFolder}\\${file._doc.path}.${file._doc.type}`
        
        if (
            !file.type.includes("png") &&
            !file.type.includes("jpg") &&
            !file.type.includes("jpeg") &&
            !file.type.includes("mpeg") &&
            !file.type.includes("mp4")
          )
            fs.rmdir(
              `${staticFolder}\\${file.createdName}`,
              {
                recursive: true,
              },
              (err) => {
                if (err) {
                  console.error("Error removing directory:", err)
                } else {
                  console.log("Directory removed successfully.")
                }
              }
            )

            
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }else {
            return next(createError(404 , `File ${filePath} not found`))
        }
        
        let message = Message.findOne({file : fileId})

        await Message.deleteOne({file : fileId})

        await File.deleteOne({_id : fileId})

        return res.status(200).json(message)

    } catch (error) {
        next(error)
    }
}




const getAllUserFiles = async (req , res , next) => {
    try {
         
        const {userId} = req.params
        const page = req.query.page || 1

        let allUserMessages = await Message.find({sender : userId})

        allUserMessages = allUserMessages.filter((userMsg) => {
            return userMsg.file !== null    
        })

        let allUserFiles = await Promise.all(allUserMessages.map((userMsg) => {
            return File.findOne({_id : userMsg.file})
        }))
 
        allUserFiles = allUserFiles.slice((page - 1) * 10 , (page - 1) * 10 + 10)

        res.status(200).json(allUserFiles)

    } catch (error) {
        next(error) 
    }
}





const createAndUpdateUnSeenMessages = async (req , res , next) => {
    try {

        const {userId} = req.params

        const {conversationsId} = req.body
        
        let unSeenMessagesObj = await UnSeenMessages.findOne({userId})
        
        // if it not exist
        if(!unSeenMessagesObj){

            let arr = await Promise.all((conversationsId.map(conver => {
                return Conversation.findOne({_id : new mongoose.Types.ObjectId(conver) , members : userId })
            })))

            arr = arr.filter(item => item !== null).map(item => item._id)
            
           unSeenMessagesObj = new UnSeenMessages({
            userId ,
            conversationsId : arr
           })
           
           await unSeenMessagesObj.save()

           return res.status(201).json(unSeenMessagesObj)
        
           // if it already exist
        }else{

            let arr = await Promise.all((conversationsId.map(conver => {
                return Conversation.findOne({_id : new mongoose.Types.ObjectId(conver) , members : userId })
            })))

            arr = arr.filter(item => item !== null).map(item => item._id)

            // $addToSet : add items to array without being duplicated (if items not already exist)
            // $each : add multi items into an array in one operation (one update)
            unSeenMessagesObj = await UnSeenMessages.findByIdAndUpdate(unSeenMessagesObj._id , 
            {$addToSet: { conversationsId: { $each : arr }}},
            {new : true , upsert : true})

            return res.status(200).json(unSeenMessagesObj)

        }

    } catch (error) {
        next(error)
    }
}




module.exports = {
    adminLogin,
    updateAdminProfile,
    blockUser,
    removeBlockedUser,
    updateUser,
    createUser,
    getUsersByAdmin,
    getUserById,
    getGroupsByAdmin,
    deleteGroupByAdmin,
    deleteGroupMembers,
    addGroupMemeber,
    removeGroupMember,
    getUsersInGroup,
    getAllUsers,
    countDB,
    deleteMsg,
    sortedDeleteMsg,
    getAllUserConversation,
    countSortedMessages,
    getFileByAdmin,
    getFilesByAdmin,
    deleteSpecificFile,
    getAllUserFiles,
    createAndUpdateUnSeenMessages
}