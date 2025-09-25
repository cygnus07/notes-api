import { Document, Types, Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
    _id: Types.ObjectId,
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'user',
    refreshTokens: string[],
    comparePassword(candidatepassword: string): Promise<boolean>,

}

const userSchema = new Schema<IUser> ({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxLength: [100, 'Name cannot exceed 100 characters']
    },
    role: {
        type : String,
        enum: {
            values: ['admin', 'user'],
            message: 'Invalid role'
        },
        default: 'user'
    },
    refreshTokens: [{
        type: String,
        select: false
    }]
}, {
    timestamps: true
})

userSchema.index({ role: 1})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    
    try {
       const salt = await bcrypt.genSalt(10)
       this.password = await bcrypt.hash(this.password, salt)
    } catch (error) {
        next(error as Error)
    }
})

userSchema.methods.comparePassword = async function(
    candidatepassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatepassword, this.password)
    } catch (error) {
        return false
    }
}

userSchema.methods.toJSON = function() {
    const obj = this.toObject()
    delete obj.password
    delete obj.refreshTokens
    delete obj.__v
    return obj
}


export const User = model<IUser>('User', userSchema)