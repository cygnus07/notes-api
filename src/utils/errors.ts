export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public isOperational: boolean = true
    ){
        super(message)
        Object.setPrototypeOf(this, AppError.prototype)
        Error.captureStackTrace(this, this.constructor)
    }
}


export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed'){
        super(message, 401)
    }
}

export class AuthorizationError extends AppError{
    constructor(message: string = 'Access Denied'){
        super(message, 403)
    }
}

export class ValidationError extends AppError{
    constructor(message: string){
        super(message, 400)
    }
}

export class NotFoundError extends AppError{
    constructor(message: string = "Resource not found"){
        super(message, 404)
    }
}

export class ConflictError extends AppError{
    constructor(message: string){
        super(message, 409)
    }
}