import express from "express";
import Conversation from "../model/conversation";
import Message from "../model/message";

export const sendMessage = async (req: express.Request, res: express.Response) => {
    try {

        const { message } = req.body;
        const { id: receiverId } = req.params;

        const senderId = req.user?.id;
        if (!senderId) {
            return res.status(401).json({ message: "Sender ID not found, unauthorized" });
        }
        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId]
            }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });


        conversation.messages.push(newMessage._id);


        await Promise.all([
            conversation.save(),
            newMessage.save()
        ])

        return res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages=async(req:express.Request,res:express.Response) => {
    try{
        const {id:userToChatId} = req.params;

        const senderId=req.user?.id;

        const conversation=await Conversation.findOne({
            participants:{
                $all: [senderId,userToChatId]
            }
        }).populate("messages")

        if(!conversation){
            return res.status(200).json([])
        }

        return res.status(200).json(conversation?.messages);

    }
    catch(error){
        console.error("Error getting message:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}












