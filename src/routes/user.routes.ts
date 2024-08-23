import express from "express";
import {getUsersForSideBar} from "../controllers/user.controller";
import {protectRoute} from "../middleware/protect";


const userRoutes=express.Router();

userRoutes.get("/",protectRoute,getUsersForSideBar)



export default userRoutes;