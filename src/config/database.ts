import mongoose from 'mongoose'
import { config } from './config.js'

let isConnected = false

export const connectDb = async () : Promise<void> => {
    if(isConnected){
        console.log("there is an existing mongodb connected")
        return 
    }

    try {
        mongoose.set('strictQuery', true)
        mongoose.connection.on('connected', () => {
            console.log("MongoDb connected")
            isConnected = true
        })
        
        mongoose.connection.on('error', () => {
            console.log('MongoDb connection error')
            isConnected = false
        })
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDb disconnected')
            isConnected = false
        })

        await mongoose.connect(config.mongoose.uri, config.mongoose.options)

    } catch (error) {
        console.log("MongoDb connection failed", error)
        process.exit(1)
    }
}

export const disconnectDb = async () : Promise<void> => {
    try {
        await mongoose.disconnect()
        console.log("MongoDb disconnected successfully")
        isConnected = false
    } catch (error) {
        console.log("Error while disconnecting db")
    }
}