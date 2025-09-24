import createApp from "./app.js"
import { createServer } from 'http'
import { config } from "./config/config.js"

const startServer = () => {
    const app = createApp()
    const httpServer = createServer(app)

    httpServer.listen(config.port, "0.0.0.0", () => {
        console.log(`Server is running on port ${config.port}`)
    })


}

startServer()