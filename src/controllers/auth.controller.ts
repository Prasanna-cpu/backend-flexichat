import express from "express";
import {LoginValidation, RegisterValidation} from "../validation/auth.validation";
import User from "../model/user";
import bcrypt from "bcryptjs";
import {generateToken} from "../utils/generateToken";

export const login=async(req:express.Request, res:express.Response)=>{
    try{
        const {error}=LoginValidation.validate(req.body);

        if(error){
            return res.status(400).send({
                error
            });
        }

        const {username, password} = req.body;

        const user=await User.findOne({username})

        if(!user){
            return res.status(400).send({
                message:"User not found"
            })
        }


        const compare=await bcrypt.compare(password,user.password)
        if(!compare){
            return res.status(400).send({
                message:"Wrong password"
            })
        }

        generateToken(user._id,res)


        return res.status(200).send({
            _id:user._id,
            username:user.username,
            fullName:user.fullName,
            profilePic:user.profilePic

        })





    }
    catch(err){
        return res.status(500).json({
            message: err
        })
    }
}

export const register=async(req:express.Request, res:express.Response)=>{
    try{
       const {error}=RegisterValidation.validate(req.body)

        if(error){
            return res.status(400).json({
                message: error,
            })
        }

        const {fullName, username , password,confirmPassword,gender,profilePic} = req.body;

        if(password!=confirmPassword){
            return res.status(400).json({
                message: "Passwords do not match",
            })
        }

        const user=await User.findOne({username})

        if(user){
            return res.status(400).json({
                message:"User already exists",
            })
        }

        const boy=`https://avatar.iran.liara.run/public/boy?username=${username}`
        const girl=`https://avatar.iran.liara.run/public/girl?username=${username}`


        const hashedPassword=bcrypt.hashSync(password, 10)

        const newUser=await User.create({
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic:gender==="male"?boy:girl

        })

        if(newUser){
            generateToken(newUser._id,res)


            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                profilePic:newUser.profilePic,
            })
        }

    }
    catch(err){
        return res.status(500).json({
            message: err
        })
    }
}

export const logout=async(req:express.Request, res:express.Response)=>{
    try{
        res.cookie("jwt",{},{maxAge:0})
        res.status(200).json({
            "message":"Logged out"
        })
    }
    catch(err){
        return res.status(500).json({
            message: err
        })
    }
}