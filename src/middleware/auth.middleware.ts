import { NextFunction, Response } from "express";
import { AuthRequest } from "../controllers/auth.controller.js";
import jwt from 'jsonwebtoken'
import { AuthenticationError, AuthorizationError } from "../utils/errors";
import { JWTUtil } from "../utils/jwt.utils";
import { User } from "../models/user.model";


export const authenticate = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
) : Promise<void> => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
        if(!token){
            throw new AuthenticationError("Token not provided")
        }

        const decoded = JWTUtil.verifyToken(token)
        const user = await User.findById(decoded.userId).select('+refreshTokens')
        if(!user){
            throw new AuthorizationError('User not found')
        }

        req.user = user
        next()
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            next(new AuthenticationError('Invalid token'))
        } else {
            next (error)
        }
    }
}