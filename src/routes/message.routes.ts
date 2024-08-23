import express from "express"
import {sendMessage} from "../controllers/message.controller";
import {protectRoute} from "../middleware/protect";


const messageRoutes = express.Router()


messageRoutes.post("/send/:id",protectRoute,sendMessage)


export default messageRoutes