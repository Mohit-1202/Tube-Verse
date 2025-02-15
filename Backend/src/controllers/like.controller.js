import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(401,"invalid Video")
    }
    const videoLike = await Like.findOne({
        $and:[{likedBy:req.user?._id},{video:videoId}]
    })
    if(videoLike){
        const unLike= await Like.findByIdAndDelete(videoLike._id)
        return res.status(200,unLike,"Like removed")
    }
    const Liked = await Like.create({
        likedBy:req.user?._id,
        video:videoId
    })
    return res.status(200).json(new ApiResponse(200,Liked, "Like added"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!commentId){
        throw new ApiError(401,"invalid Comment")
    }
    const commentLike = await Like.findOne({
        $and:[{likedBy:req.user?._id},{comment:commentId}]
    })
    if(commentLike){
        const unLike= await Like.findByIdAndDelete(commentLike._id)
        return res.status(200,unLike,"Like removed")
    }
    const Liked = await Like.create({
        likedBy:req.user?._id,
        comment:commentId
    })
    return res.status(200).json(new ApiResponse(200,Liked, "Liked added"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(401,"invalid Tweet")
    }
    const tweetLike = await Like.findOne({
        $and:[{likedBy:req.user?._id},{tweet:tweetId}]
    })
    if(tweetLike){
        const unLike= await Like.findByIdAndDelete(tweetLike._id)
        return res.status(200,unLike,"Like removed")
    }
    const Liked = await Like.create({
        likedBy:req.user?._id,
        tweet:tweetId
    })
    return res.status(200).json(new ApiResponse(200,Liked, "Liked added"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
   const likedVideos = await Like.find({
    $and:[{likedBy:req.user?._id}, {video:{$exists:true}}]
   })
   if(!likedVideos){
    throw new ApiError(500,"Liked Videos not found")
   }
   return res.status(200).json(new ApiResponse(200,likedVideos,"Videos found"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}