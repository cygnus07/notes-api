import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production' ]).default('development'),
    PORT: z.coerce.number().default(5000),
})

let envVars = envSchema.parse(process.env)

export const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
}