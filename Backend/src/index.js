import connectDB from "./db/index.js";
import dotenv from "dotenv"
import express from 'express'
import {app} from "./app.js"


dotenv.config({
    path:'./.env'
})
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("error", error)
        throw error
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : http://localhost:${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("Mongo DB Connection failed !!!", error)
})