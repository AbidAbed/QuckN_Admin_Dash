const mongoose = require("mongoose")


const unSeenMessagesSchema = new mongoose.Schema({
    userId : {
        type : String ,
        unique : true
    },
    conversationsId : [String]
}, {timestamps : true})



const UnSeenMessages = mongoose.model("usSeenMessages" , unSeenMessagesSchema)


module.exports = UnSeenMessages

