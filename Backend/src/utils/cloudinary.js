import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudinary = async(localFilePath)=>{
        try {
            if(!localpath){
                return null
            }
            else{
                const response =await cloudinary.uploader.upload(localFilePath,{
                    resource_type:auto,
                })
            }
            console.log("File has been uploaded on Cloudinary",response.url)

        } catch (error) {
            //Unlink is used to remove temporary files as the upload operation got failed
            fs.unlink(localFilePath)
            return null
        }
    }

    export {uploadOnCloudinary}