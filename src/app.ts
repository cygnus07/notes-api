import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { config } from './config/config.js'
import { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import apiRoutes from './routes/index.js'
import { errorHandler } from './middleware/error.middleware.js'

const createApp = () => {
    const app = express()

    app.use(express.json({ limit: '10mb'}))
    app.use(express.urlencoded({
        extended: true,
        limit: '10mb'
    }))

    if(config.env !== 'test'){
            app.use(morgan('dev'))
    }
    app.use(helmet())
    app.use(cors(config.cors))
    app.use(cookieParser())
    app.use(compression())

    app.get('/', (_req: Request, res: Response) => {
        res.status(200).json({
            status: 'ok',
            message: 'api is running'
        })
    })

    app.use('/api/v1', apiRoutes)

    app.use(errorHandler)
    return app

}

export default createApp