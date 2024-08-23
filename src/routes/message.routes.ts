import express from "express"
import {getMessages, sendMessage} from "../controllers/message.controller";
import {protectRoute} from "../middleware/protect";
import message from "../model/message";


const messageRoutes = express.Router()



messageRoutes.get("/:id", protectRoute,getMessages)
messageRoutes.post("/send/:id",protectRoute,sendMessage)



export default messageRoutes