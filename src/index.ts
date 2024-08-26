import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes";
import connectToDB from "./database/Connect";
import messageRoutes from "./routes/message.routes";
import userRoutes from "./routes/user.routes";
import cors from "cors";


dotenv.config()

process.env.NODE_ENV = 'development';

console.log("Hi")

const port=process.env.PORT

const uri=process.env.MONGO_URI



const app = express()


app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:3000"
}))

// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true,
// }))



app.options('*', cors());



app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)
app.use("/api/user",userRoutes)


app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello World")
})


// app.get('/set-cookie', (req, res) => {
//     res.cookie('testCookie', 'testValue', {
//         maxAge: 1000 * 60 * 15, // 15 minutes
//         httpOnly: true,
//         secure: false,
//         sameSite: 'none'
//     });
//     console.log(req.cookies)
//     console.log('Set-Cookie header:', res.getHeader('Set-Cookie'));
//     res.send('Cookie has been set');
// });



connectToDB(uri).then(r => console.log("connected to db successfully"))

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})




