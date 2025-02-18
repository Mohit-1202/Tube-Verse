import mongoose,{isValidObjectId} from "mongoose"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {Tweet} from "../models/tweet.model.js"

const createTweet = asyncHandler(async(req,res)=>{
  const {content}= req.body 
  if(!content){
    throw new ApiError(400,"Content is required")
  }
  const postTweet = await Tweet.create({
    content:content,
    owner:req.user._id
  })
  if(!postTweet){
    throw new ApiError(
        501,
        "Interval server error occured while posting your tweet"
    )
  }
  return res.status(200).json(new ApiResponse(200,postTweet,"Tweet posted successfully"))
})
const getUserTweets= asyncHandler(async(req,res)=>{
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(401,"Invalid User Id")
    }
    const userTweet = await Tweet.find({
    owner:userId
    })
    if(userTweet.length===0){
      throw new ApiResponse(200,userTweet,"No tweets available")
    }
    return res.status(200).json(new ApiResponse(200,userTweet,"Tweets found!"))
})
const updateTweet=asyncHandler(async(req,res)=>{
  const {tweetId}= req.params
  const {content}= req.body
  if(!isValidObjectId(tweetId)){
    throw new ApiError(401,"Invalid tweet")
  }
  if(!content){
    throw new ApiError(401,"Please write something")
  }
  const findTweet = await Tweet.findOne({
    $and:[{owner:new mongoose.Types.ObjectId(req.user?._id)},{_id:tweetId}]
  })
  if(!findTweet){
    throw new ApiError(401,"You are not authorized to update this tweet")
  }
  findTweet.content=content
  const updateTweet=findTweet.save()
  if(!updateTweet){
    throw new ApiError(501,"Tweet not updated")
  }
  return res.status(200).json(new ApiResponse(200,updateTweet,"Tweet updated successfully"))
})
const deleteTweet = asyncHandler(async(req,res)=>{
 const {tweetId}=req.params
  if(!isValidObjectId(tweetId)){
    throw new ApiError(401,"Invalid tweet")
  }
  const findTweet = Tweet.findOne({
    $and:[{owner:new mongoose.Types.ObjectId(req.user?._id)}, {_id:tweetId}]
  })
  if(!findTweet){
    throw new ApiError(501,"You are not authorized to delete this tweet")
  }
  const deleteTweet= await Tweet.findByIdAndDelete(tweetId)
  return res.status(200).json(new ApiResponse(200,deleteTweet,"Tweet deleted successfully"))
})

export {
    createTweet,getUserTweets,updateTweet,deleteTweet
}