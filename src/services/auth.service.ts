import { IUser, User } from "../models/user.model.js"
import { AuthenticationError, ConflictError} from "../utils/errors.js"
import { JWTUtil } from "../utils/jwt.utils.js"

export interface RegisterData {
    email: string
    password: string
    name: string
    role?: string
}

export interface LoginData {
    email: string
    password: string
}

export interface AuthResponse {
    user: IUser
    token: string
    refreshToken: string
}

export const generateTokens = (
    userId: string,
    email: string,
    role: string
    ): { token: string; refreshToken: string } => {
    const token = JWTUtil.generateToken({ userId, email, role })
    const refreshToken = JWTUtil.generateRefreshToken(userId)
    return { token, refreshToken }
}

export class AuthService {
    static async register(data: RegisterData) : Promise<AuthResponse> {
        // destructure the register data
        // verify that email does not exist
        // create the user
        // generate access and refresh tokens
        // push the refreshToken in the user.rt
        // return user, token and refreshToken

        const { email, name, password, role} = data
        const existingUser = await User.findOne({ email })
        if(existingUser){
            throw new ConflictError('Email already registered')
        }

        const user = await User.create({
            email,
            password, 
            name,
            role
        })

        const { token, refreshToken } = generateTokens(
            user._id.toString(),
            user.email,
            user.role
        )

        user.refreshTokens.push(refreshToken)
        await user.save()

        return { user, token, refreshToken}
    }

    static async login(data: LoginData): Promise<AuthResponse> {
        // destructure the login data
        // verify if user exists, throw notfounderror
        // verify the user password
        // generate accessToken and 
        // return auth resposne

        const { email, password} = data
        const user = await User.findOne({ email })
        if(!user) {
            throw new AuthenticationError('user not found')
        }

        const isValidPassword = await user.comparePassword(password)
        if(!isValidPassword){
            throw new AuthenticationError('Invalid Credentials')
        }

        const {token, refreshToken} = generateTokens (
            user._id.toString(),
            user.email,
            user.role
        )

        user.refreshTokens.push(refreshToken)
        if(user.refreshTokens.length > 5){
            user.refreshTokens = user.refreshTokens.slice(-5)
        }

        await user.save()

        return { user, token, refreshToken}
    }

    static async refreshToken(refreshToken: string): Promise<Omit<AuthResponse, 'user'>> {
        const decoded = JWTUtil.verifyToken(refreshToken)
        if(!decoded.userId){
            throw new AuthenticationError('Invalid Refresh TOken')
        }

        const user = await User.findById(decoded.userId).select('+refreshTokens')
        if(!user || !user.refreshTokens.includes(refreshToken)){
            throw new AuthenticationError('Invalid Refresh Token')
        }

        const { token, refreshToken: newRefreshToken} = generateTokens(
            user._id.toString(),
            user.email,
            user.role
        )

        user.refreshTokens.filter(rt => rt !== refreshToken)
        await user.save()

        return { token, refreshToken: newRefreshToken}
    }

    static async logout(userId: string, refreshToken?: string): Promise<void> {
        const user = await User.findById(userId).select('+refreshTokens')
        if(!user) return

        if(refreshToken){
            user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken)
        } else {
            user.refreshTokens = []
        }

        await user.save()
    }
}