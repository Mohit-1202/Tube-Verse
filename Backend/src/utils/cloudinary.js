import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudinary = async(localFilePath)=>{
        try {
            if(!localFilePath) return null
                const response = await cloudinary.uploader.upload(localFilePath,{
                    resource_type:"auto",
                })
                fs.unlinkSync(localFilePath)
                return response

        } catch (error) {
            //Unlink is used to remove temporary files as the upload operation got failed
            fs.unlinkSync(localFilePath,(err)=>{
                if(err){
                    console.log("Error deleting local files :", err)
                }
            })
            return null
        }
    }
    const deleteFromCloudinary = async(cloudinaryFilePath, path) => {
        try {
            if (!cloudinaryFilePath) return null
    
            const avatarPublicId = cloudinaryFilePath.split("/").pop().split(".")[0];
    
            const response = await cloudinary.uploader.destroy(`${path}/${avatarPublicId}`)
    
            return response
    
        } catch (error) {
            console.error("Error deleting file from Cloudinary:", error);
            return null;
    
        }
    }

    export {uploadOnCloudinary,deleteFromCloudinary}