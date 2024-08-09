const express = require("express")
const cors = require("cors")

require("dotenv").config()

const connectDB = require("./db/connectDB")
const fileConfig = require("./pathConfig")

const app = express()

app.use(express.json())  
app.use(cors())
 

// routes

const adminRoutes = require("./routes/adminRoutes")
app.use("/api/admin" , adminRoutes)

const errorMiddleware = require("./middlewares/errorMiddleware")
app.use(errorMiddleware)



const PORT = process.env.PORT || 3001

const start = async () => {
    try {
        app.listen(process.env.PORT , () => console.log(`admin server started on port ${PORT}`))
        await connectDB()
    } catch (error) {
        console.log(error) 
    }
}


start()