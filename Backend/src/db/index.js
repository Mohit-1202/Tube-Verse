import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async()=>{
try {
    const connectioninstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    console.log(`MongoDB connected !! DB HOST: ${connectioninstance.connection.host}`)
} catch (error) {
    console.log("MongoDb connection failed: ",error)
}
}
export default connectDB