import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const createApp = () => {
    const app = express()

    app.use(express.json({ limit: '10mb'}))
    app.use(express.urlencoded({
        extended: true,
        limit: '10mb'
    }))
    app.use(morgan('dev'))
}