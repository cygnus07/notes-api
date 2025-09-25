import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production' ]).default('development'),
    PORT: z.coerce.number().default(5000),
    MONGO_URI: z.string().startsWith('mongodb').url(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIREIN: z.string().default('7d'),
    CORS_ORIGIN: z.string().optional()
})

let envVars = envSchema.parse(process.env)

export const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    cors: {
        origin: ['http://localhost:3000' , 'https://notes-app.kuldeepdev.me'],
        credentials: true
    },
    mongoose: {
        uri: envVars.MONGO_URI,
        options: {
            maxPoolSize: 10
        }
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        expire: envVars.JWT_EXPIREIN
    }
}