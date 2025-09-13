import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(401, "Invalid Video");
  }

  const existingLike = await Like.findOne({
    likedBy: req.user?._id,
    video: videoId
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    const totalLikes = await Like.countDocuments({ video: videoId });

    return res.status(200).json(new ApiResponse(200, {
      isLiked: false,
      totalLikes
    }, "Like removed"));
  }

  await Like.create({
    likedBy: req.user?._id,
    video: videoId
  });

  const totalLikes = await Like.countDocuments({ video: videoId });

  return res.status(200).json(new ApiResponse(200, {
    isLiked: true,
    totalLikes
  }, "Like added"));
});


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
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    { $unwind: "$videoDetails" },

    {
      $lookup: {
        from: "users",
        localField: "videoDetails.owner",
        foreignField: "_id",
        as: "videoDetails.owner",
      },
    },
    { $unwind: "$videoDetails.owner" },

    {
      $project: {
        _id: "$videoDetails._id",
        title: "$videoDetails.title",
        description: "$videoDetails.description",
        thumbnail: "$videoDetails.thumbnail",
        views: "$videoDetails.views",
        duration: "$videoDetails.duration",
        createdAt: "$videoDetails.createdAt",
        owner: {
          _id: "$videoDetails.owner._id",
          username: "$videoDetails.owner.username",
          avatar: "$videoDetails.owner.avatar",
          subscribers: "$videoDetails.owner.subscribers",
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (!likedVideos || likedVideos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No liked videos found"));
  }

  return res.status(200).json(
    new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
  );
});



export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}