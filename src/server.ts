import createApp from "./app.js"
import { createServer } from 'http'
import { config } from "./config/config.js"
import { connectDb, disconnectDb } from "./config/database.js"

process.on('uncaughtException', (err) => {
    console.log("Uncaught exception", err)
    process.exit(1)
})

process.on('unhandledRejection', (err) => {
    console.log("Unhandled Rejection", err)
    process.exit(0)
})

const startServer = async () => {
    try {
        const app = createApp()
        const httpServer = createServer(app)
        
        await connectDb()
    
        httpServer.listen(config.port, "0.0.0.0", () => {
            console.log(`
                Server is running on port ${config.port}
                Envirnoment: ${config.env}`)
        })
    
    
        process.on('SIGTERM', () => {
            console.log("sigterm received, shutting down gracefully")
            httpServer.close( async () => {
                await disconnectDb()
                console.log("SErver closed")
                process.exit(0)
            })
        })
    } catch (error) {
        console.log("Failed to start the server", error)
        process.exit(1)
    }


}

startServer()