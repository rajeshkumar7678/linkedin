const express=require("express")
const app=express()
app.use(express.json())
require("dotenv").config()
const {connection}=require("./db")
const cors=require("cors")
app.use(cors())


const {userRoutes}=require("./routes/users.routes")
const {postRoutes}=require("./routes/posts.routes")
const {auth}=require("./middleware/auth.middleware")





app.use("/users", userRoutes)
app.use(auth)
app.use("/posts", postRoutes)










app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("database is connecting to server")
    } catch (error) {
        console.log("database is not connection to server");
        console.log(err)
    }
    console.log(`server is running on port no ${process.env.port}`)
})