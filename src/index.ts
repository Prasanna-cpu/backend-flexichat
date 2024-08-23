import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes";
import connectToDB from "./database/Connect";
import messageRoutes from "./routes/message.routes";
import userRoutes from "./routes/user.routes";

dotenv.config()

const port=process.env.PORT

const uri=process.env.MONGO_URI



const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())



app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)
app.use("/api/user",userRoutes)


app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello World")
})


app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})


connectToDB(uri).then(r => console.log("connected to db successfully"))