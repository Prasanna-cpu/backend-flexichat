import express from "express"
import {login, logout, register} from "../controllers/auth.controller";

const authRoutes = express.Router()


authRoutes.post("/login",login)
authRoutes.post("/logout",logout)
authRoutes.post("/register",register)

export default authRoutes;