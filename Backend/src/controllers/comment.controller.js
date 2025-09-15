import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {Comment} from "../models/comment.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import mongoose, { isValidObjectId } from "mongoose"

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.avatar": 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});



const addComment = asyncHandler(async(req,res)=>{
    const {content} = req.body
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(500,"Invalid Video")
    }
    if(!content){
        throw new ApiError(401,"Please write something to add a comment")
    }
    const comment = await Comment.create({
        content:content,
        video:videoId,
        owner:new mongoose.Types.ObjectId(req.user?._id)
    })
    if(!comment){
        throw new ApiError(501,"Failed to add your comment")
    }
    return res.status(200).json(new ApiResponse(200,comment,"Comment Added successfully"))
})
const updateComment = asyncHandler(async(req,res)=>{
    const {commentId}= req.params
    const {content}= req.body
    if(!isValidObjectId(commentId)){
        throw new ApiError(401,"Invalid comment Id")
    }
    if(content.trim("").length === 0){
        throw new ApiError(401,"Please write something to edit a comment")
    }
    const comment = await Comment.findOne({
        _id:commentId,
        owner:req.user._id
    })
    if(!comment){
        throw new ApiError(401,"Invalid comment ")
    }
    comment.content = content
    await comment.save()

    return res.status(200).json(new ApiResponse(200,comment,"Comment updated successfully"))
})
const deleteComment = asyncHandler(async(req,res)=>{
const {commentId} = req.params
if(!commentId){
    throw new ApiError(401,"Invalid comment Id")
}
const findComment = await Comment.findOne({
    $and:[{owner:new mongoose.Types.ObjectId(req.user?._id)},{_id:commentId}]
})
if(!findComment){
    throw new ApiError(401,"Your are not authorized to delete this comment")
}
const deletedComment = await Comment.findByIdAndDelete(commentId)
return res.status(200).json(new ApiResponse(200,deletedComment,"Comment deleted successfully"))
})
export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}