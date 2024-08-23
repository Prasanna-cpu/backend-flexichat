import {Request,Response} from "express";
import User from "../model/user";

export const getUsersForSideBar=async(req:Request, res:Response) => {
    try {
        const signedInUserId=req.user?.id

        const allUsersExceptSelf=await User.find({
            _id:{
                $ne:signedInUserId
            }
        }).select("-password")

        return res.status(200).json(allUsersExceptSelf)
    }

    catch(err){
        console.log(err);
        res.status(500).send({"error":"Error getting users"});
    }
}