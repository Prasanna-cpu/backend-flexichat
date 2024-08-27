import {Server} from "socket.io"
import http from "http"
import express, {Express} from "express"

const app:Express = express()

const server=http.createServer(app)



export const io=new Server(server,{
    cors:{
        origin:["http://localhost:3000"],
        methods:["GET","POST","PUT","PATCH","DELETE"]
    }
})


export const getReceiverId=(receiverId:string)=>{
    return userSocketMap[receiverId]
}

const userSocketMap: { [userId: string]: string } = {};


io.on("connection", (socket) => {
    console.log("A user connected",socket.id)

    const userId=socket.handshake.query.userId as string

    if(!userId || userId==="undefined" || userId===undefined){
        throw new Error("No user id provided in socket")
    }

    userSocketMap[userId]=socket.id

    io.emit("getOnlineUsers",Object.keys(userSocketMap))


    socket.on("disconnect", () => {
        console.log("A user disconnected",socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })

})

export {app,server}