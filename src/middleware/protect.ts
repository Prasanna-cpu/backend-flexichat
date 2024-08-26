import jwt, { JwtPayload } from 'jsonwebtoken';
import express from 'express';
import User from '../model/user';
import dotenv from 'dotenv';

dotenv.config();

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
            };
        }
    }
}

const secret = process.env.JWT_TOKEN;

// Function to extract token from cookies
const extractTokenFromCookies = (req: express.Request): string | null => {
    const token = req.cookies?.token;
    return token || null;
};

// Middleware to protect routes
export const protectRoute = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {


        const token = extractTokenFromCookies(req);


        if (!token) {
            return res.status(401).json({ message: 'No token provided, unauthorized' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, secret!) as DecodedToken;

        // console.log(decoded)

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: 'Invalid token, unauthorized' });
        }

        // Check if the token is expired
        if (Date.now() >= (decoded.exp || 0) * 1000) {
            console.log("Token expired")
            return res.status(401).json({ message: 'Token has expired, unauthorized' });
        }


        // Find the user by ID
        const user = await User.findById(decoded.userId).select('-password').exec();

        // console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = {
            id: user._id.toString(),
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        };

        next();
    } catch (err) {
        console.log('Error in protectRoute middleware:', (err as Error).message || err);
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token is invalid or malformed, unauthorized' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
