import jwt, { JwtPayload } from 'jsonwebtoken';
import express from 'express';
import User from '../model/user';

interface DecodedToken extends JwtPayload {
    id: string;
}

declare global {
    namespace Express {
        export interface Request {
            user?: {
                id: string;
                fullName: string;
                username: string;
                profilePic: string;
            }; // Adjusted type to match the properties you use from the User model
        }
    }
}

export const protectRoute = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "No token provided, unauthorized" });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN!) as DecodedToken;


        // Check if the token is valid
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token, unauthorized" });
        }

        // Find the user by ID
        const user = await User.findById(decoded.id).select("-password").exec();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Cast the user object to match the expected type for req.user
        req.user = {
            id: user._id.toString(),
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        };

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Error in protectRoute middleware:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
