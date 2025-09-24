import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { config } from '../config/config.js'



export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = 500
    let message = 'Internal Server Error'
    let isOperational = false

    if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
        isOperational = err.isOperational
    }

    console.error('Error: ', {
        message: err.message,
        stack: err.stack,
        statusCode,
        url: req.url,
        method: req.method,
        ip: req.ip
    })

    res.status(statusCode).json({
        success: false,
        error: {
            message: config.env === 'production' && !isOperational
            ? 'Something went wrong'
            : message,
            ...(config.env === 'development' && {
                stack: err.stack,
                details: err
            })
        }
    })
}