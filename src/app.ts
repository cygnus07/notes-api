import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { config } from './config/config.js'
import { Request, Response } from 'express'

const createApp = () => {
    const app = express()

    app.use(express.json({ limit: '10mb'}))
    app.use(express.urlencoded({
        extended: true,
        limit: '10mb'
    }))
    app.use(morgan('dev'))
    app.use(helmet())
    app.use(cors(config.cors))

    app.get('/', (_req: Request, res: Response) => {
        res.status(200).json({
            status: 'ok',
            message: 'api is running'
        })
    })

    return app

}

export default createApp