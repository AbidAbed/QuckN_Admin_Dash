const {Router} = require("express")
const verifyAdmin = require("../middlewares/verifyAdmin")

const {
        adminLogin,
        updateAdminProfile , 
        blockUser , 
        removeBlockedUser,
        updateUser , 
        createUser , 
        getUsersByAdmin , 
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
    } = require("../controllers/adminControllers")
const User = require("../models/userModel")


const router = Router()


router.post("/login" , adminLogin)

router.put("/updateAdminProfile/:adminId" , verifyAdmin , updateAdminProfile)

router.get("/countDB" , verifyAdmin , countDB)

router.get("/getUsersByAdmin" , verifyAdmin , getUsersByAdmin)

router.get("/getUserById/:userId" , verifyAdmin , getUserById)

router.post("/createUser" , verifyAdmin , createUser)

router.delete("/deleteUser/:userId" , verifyAdmin , blockUser)

router.patch("/removeUserBlock/:userId" , verifyAdmin , removeBlockedUser)

router.put("/updateUser/:userId" , verifyAdmin , updateUser)

router.get("/getGroupsByAdmin" , verifyAdmin , getGroupsByAdmin)

router.delete("/deleteGroupByAdmin/:groupId" , verifyAdmin , deleteGroupByAdmin)

router.delete("/deleteGroupMembers/:groupId" , verifyAdmin , deleteGroupMembers)

router.patch("/addGroupMemeber/:groupId/:userId" , verifyAdmin , addGroupMemeber)

router.patch("/removeGroupMember/:groupId/:userId" , verifyAdmin , removeGroupMember)

router.get("/getUsersInGroup/:groupId" , verifyAdmin , getUsersInGroup)

router.get("/getAllUsers" , verifyAdmin , getAllUsers)

router.delete("/deleteMsg/:msgId" , verifyAdmin , deleteMsg)

router.delete("/sortedDeleteMsg/:userId" , verifyAdmin , sortedDeleteMsg)

router.get("/countSortedMessages/:userId" , verifyAdmin , countSortedMessages)

router.get("/getUserAllConversation/:userId" , verifyAdmin , getAllUserConversation)

router.get("/getFileByAdmin/:fileId" , verifyAdmin , getFileByAdmin)

router.get("/getFilesByAdmin" , verifyAdmin , getFilesByAdmin)

router.delete("/deleteFile/:fileId" , verifyAdmin , deleteSpecificFile)

router.get("/getAllUserFiles/:userId" , verifyAdmin , getAllUserFiles)

router.post("/createAndUpdateUnSeenMessages/:userId" , createAndUpdateUnSeenMessages)



module.exports = router
 