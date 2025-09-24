import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors.js";
import { AuthService } from "../services/auth.service.js";
import { config } from "../config/config.js";
import { IUser } from "../models/user.model.js";


export interface AuthRequest extends Request {
    user? : IUser
}

export const tokenOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict' as const,
    maxAge: 7*24*60*60*1000
}

export const refreshTokenOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict' as const,
    maxAge: 30*24*60*60*1000
}


export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction){
        try {
            const { email, name, password, role } = req.body
            if(!email || !name || !password ){
                throw new ValidationError('All the fields are required')
            }

            const result = await AuthService.register({
                email,
                name,
                password,
                role
            })

            res.cookie('token', result.token, tokenOptions)
            res.cookie('refreshToken', result.refreshToken, refreshTokenOptions)

            res.status(201).json({
                success: true,
                data: {
                    user: result.user,
                    token: result.token
                },
                message: 'Registration Successful'
            })

        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction){
       try {
         const { email, password } = req.body
         if(!email || !password){
             throw new ValidationError("All fields are required")
         }
 
         const result = await AuthService.login({
             email,
             password
         })
 
         res.cookie('token', result.token, tokenOptions)
         res.cookie('refreshToken', result.refreshToken, refreshTokenOptions )
 
         res.status(200).json({
             success: true,
             data: {
                 user: result.user,
                 token: result.token
             },
             message: 'Login successful'
         })
       } catch (error) {
            next(error)
       }
    }

    static async logout(req: AuthRequest, res: Response, next: NextFunction){
        try {
            const refreshToken = req.cookies.refreshToken
            if(req.user){
                await AuthService.logout(
                    (req.user._id as any).toString(),
                    refreshToken,
                )
            }

            res.clearCookie('token')
            res.clearCookie('refreshToken')

            res.json({
                success: true,
                message: 'Logout successful'
            })

        } catch (error) {
            next(error)
        }
    }

    static async refreshToken(req:Request, res: Response, next: NextFunction){
        try {
            const { refreshToken } = req.cookies
            if(!refreshToken){
                throw new ValidationError('Invalid token')
            }
    
            const result = await AuthService.refreshToken(refreshToken)
    
            res.cookie('token', result.token, tokenOptions)
            res.cookie('refreshToken', result.refreshToken, refreshTokenOptions)
    
            res.json({
                success: true,
                data: {
                    token: result.token
                },
                message: 'Token refreshed successfully'
            })
        } catch (error) {
            next(error)
        }
    }

    static async me(req: AuthRequest, res: Response, next: NextFunction){
        try {
            if(!req.user){
                throw new ValidationError("user not found")
            }
            res.json({
                success: true,
                data: {
                    user: req.user
                }
            })
        } catch (error) {
            next(error)
        }
    }
}