import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";

/**
 * Get Channel Stats
 * Returns:
 * - Total Videos
 * - Total Views
 * - Total Subscribers
 * - Total Tweets
 * - Total Comments
 * - Total Video Likes
 * - Total Comment Likes
 * - Total Tweet Likes
 */
const getChannelStats = asyncHandler(async (req, res) => {
  let { channel } = req.body;

  // Find the channel by username
  const channelData = await User.findOne({ username: channel });
  if (!channelData) {
    throw new ApiError(400, "Channel not available");
  }

  const channelId = new mongoose.Types.ObjectId(channelData._id);
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }

  // 1. Total Views and Total Published Videos
  const totalViewsAndVideos = await Video.aggregate([
    {
      $match: {
        owner: channelId,
        isPublished: true,
      },
    },
    {
      $group: {
        _id: "$owner",
        totalViews: { $sum: "$views" },
        totalVideos: { $sum: 1 },
      },
    },
  ]);

  // 2. Total Subscribers
  const totalSubs = await Subscription.countDocuments({ channel: channelId });

  // 3. Total Tweets
  const totalTweets = await Tweet.countDocuments({ owner: channelId });

  // 4. Total Comments
  const totalComments = await Comment.countDocuments({ owner: channelId });

  // 5. Total Video Likes
  const totalVideoLikes = await Like.countDocuments({
    likedBy: channelId,
    video: { $exists: true },
  });

  // 6. Total Comment Likes
  const totalCommentLikes = await Like.countDocuments({
    likedBy: channelId,
    comment: { $exists: true },
  });

  // 7. Total Tweet Likes
  const totalTweetLikes = await Like.countDocuments({
    likedBy: channelId,
    tweet: { $exists: true },
  });

  // Final Response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalViews: totalViewsAndVideos[0]?.totalViews || 0,
        totalVideos: totalViewsAndVideos[0]?.totalVideos || 0,
        totalSubs,
        totalTweets,
        totalComments,
        totalVideoLikes,
        totalCommentLikes,
        totalTweetLikes,
      },
      "Stats of the channel fetched successfully"
    )
  );
});

/**
 * Get Channel Videos (Paginated)
 */
const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Channel not found");
  }

  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $addFields: {
        username: "$ownerDetails.username",
        fullName: "$ownerDetails.fullName",
        avatar: "$ownerDetails.avatar",
      },
    },
    { $project: { ownerDetails: 0 } },
  ];

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "total_videos",
      docs: "Videos",
    },
  };

  const videos = await Video.aggregatePaginate(pipeline, options);

  if (videos.total_videos === 0) {
    throw new ApiError(404, "No videos found for this channel");
  }

  return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
