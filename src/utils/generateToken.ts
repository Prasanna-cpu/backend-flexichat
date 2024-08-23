import jwt from "jsonwebtoken";
import express from "express";
import {Types} from "mongoose"
import dotenv from "dotenv";

dotenv.config()


const secret = process.env.JWT_TOKEN; // Make sure this matches the variable name in your .env file
console.log(secret);

export function generateToken(userId: Types.ObjectId, res: express.Response) {
    try {
        if (typeof secret === "string") {
            const token = jwt.sign({ id: userId }, secret, { expiresIn: '18d' });
            res.cookie("jwt", token, {
                maxAge: 18 * 24 * 60 * 60 * 1000, // 18 days
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });

        } else {
            throw new Error("JWT_TOKEN is not defined");
        }
    } catch (error) {
        console.error("Error generating token:", error);
    }
}