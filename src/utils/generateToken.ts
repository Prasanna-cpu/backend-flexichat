import jwt from "jsonwebtoken";
import express from "express";
import { Types } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_TOKEN;

const age=1000*60*60*24*7

export function generateToken(userId:Types.ObjectId, res: express.Response) {
    // console.log(secret)

    try {
        if (typeof secret === "string") {
            const token = jwt.sign({userId}, secret, {
                expiresIn: age,

            });



            res.cookie("token",token,{
                maxAge: age,
                httpOnly: true,
                secure: process.env.NODE_ENV != 'development', // Only send over HTTPS in production
                sameSite: "strict", // Adjust if needed
            })


            // if(res.getHeader("Set-Cookie")){
            //     console.log('Set-Cookie header:', res.getHeader('Set-Cookie'));
            //     console.log("Cookies formed")
            // }
            // else{
            //     console.log("Cookies not formed")
            // }


        } else {
            throw new Error("JWT_TOKEN is not defined");
        }
    } catch (error) {
        console.error("Error generating token:", error);
    }
}
