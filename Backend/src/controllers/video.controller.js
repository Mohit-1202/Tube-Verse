import mongoose, { isValidObjectId, mongo } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";


const getUserVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = "createdAt", sortType = -1 } = req.query;

  if (!req.user || !req.user._id) {
    return res.status(401).json(new ApiError(401, "Unauthorized - No user found"));
  }

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      customLabels: {
        totalDocs: "totalVideos",
        docs: "videos",
      },
    };

    const pipeline = [
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                _id: 1,
                fullName: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      { $sort: { [sortBy]: parseInt(sortType) } },
    ];

    const result = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

    return res.status(200).json(new ApiResponse(200, result, "User videos fetched successfully"));
  } catch (error) {
    console.error("Get user videos error:", error.message);
    return res.status(500).json(new ApiError(500, "Internal server error fetching user videos"));
  }
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = -1, userId } = req.query;

  const matchConditions = [];

  if (userId && mongoose.isValidObjectId(userId)) {
    matchConditions.push({ owner: new mongoose.Types.ObjectId(userId) });
  }

  if (query.trim() !== "") {
    matchConditions.push({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
  }

  const finalMatch = matchConditions.length > 0 ? { $or: matchConditions } : {};

  const pipeline = [
    { $match: finalMatch },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $addFields: { owner: { $first: "$owner" } } },
    { $sort: { [sortBy]: parseInt(sortType) } },
  ];

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      customLabels: {
        totalDocs: "totalVideos",
        docs: "videos",
      },
    };

    const result = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

    return res.status(200).json(new ApiResponse(200, result, "Videos fetched successfully"));
  } catch (error) {
    console.error("Error in getAllVideos:", error.message);
    return res.status(500).json(new ApiError(500, {}, "Internal server error in video aggregation"));
  }
});

const searchVideos = asyncHandler(async (req, res) => {
  const { query = "", page = 1, limit = 10, sortBy = "createdAt", sortType = -1 } = req.query;

  if (!query.trim()) {
    return res.status(400).json(new ApiError(400, "Search query is required"));
  }

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      customLabels: {
        totalDocs: "totalVideos",
        docs: "videos",
      },
    };

    const pipeline = [
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
          isPublished: true, // Only show published videos in search
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                _id: 1,
                fullName: 1,
                username: 1,
                avatar: "$avatar.url",
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      { $sort: { [sortBy]: parseInt(sortType) } },
    ];

    const result = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

    return res.status(200).json(new ApiResponse(200, result, "Search results fetched successfully"));
  } catch (error) {
    console.error("Search videos error:", error.message);
    return res.status(500).json(new ApiError(500, "Internal server error during search"));
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    if ([title, description].some((field) => field.trim() === "")) {
      throw new ApiError(400, "Please provide all details");
    }
    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if (!videoLocalPath) {
      throw new ApiError(401, "Please upload video");
    }
    if (!thumbnailLocalPath) {
      throw new ApiError(401, "Please upload thumbnail");
    }

    const videoOnCloudinary = await uploadOnCloudinary(videoLocalPath, "video");
    const thumbnailOnCloudinary = await uploadOnCloudinary(
      thumbnailLocalPath,
      "img"
    );

    if (!videoOnCloudinary) {
      throw new ApiError(501, "Video uploading failed");
    }
    if (!thumbnailOnCloudinary) {
      throw new ApiError(501, "Thumbnail uploading failed");
    }

    const video = await Video.create({
      title: title,
      description: description,
      thumbnail: thumbnailOnCloudinary?.url,
      videoFile: videoOnCloudinary?.url,
      duration: videoOnCloudinary.duration,
      isPublished: true,
      owner: req.user?._id,
    });
    if (!video) {
      throw new ApiError(400, "Video uploading failed");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video Uploaded successfully"));
  } catch (error) {
    console.log(error.message);
    return res
      .status(501)
      .json(new ApiError(501, {}, "Problem in uploading video"));
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid Video Id"));
  }

  const userId = req.user?._id; // logged-in user

  const video = await Video.aggregate([
    // Match the video
    { $match: { _id: new mongoose.Types.ObjectId(videoId) } },

    // Lookup owner info
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },

    // Lookup likes for video
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },

    // Lookup comments
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },

    // Lookup comment owners
    {
      $lookup: {
        from: "users",
        localField: "comments.owner",
        foreignField: "_id",
        as: "commentOwners",
      },
    },

    // Lookup likes for comments
    {
      $lookup: {
        from: "likes",
        localField: "comments._id",
        foreignField: "comment",
        as: "commentLikes",
      },
    },

    // Add computed fields: likeCount, isLiked, totalComments, and enriched comments
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        totalComments: { $size: "$comments" },
        isLiked: {
          $in: [userId, "$likes.likedBy"],
        },
        comments: {
  $map: {
    input: "$comments",
    as: "comment",
    in: {
      _id: "$$comment._id",
      content: "$$comment.content",
      createdAt: "$$comment.createdAt",
      owner: {
        $let: {
          vars: {
            ownerObj: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$commentOwners",
                    as: "u",
                    cond: { $eq: ["$$u._id", "$$comment.owner"] },
                  },
                },
                0,
              ],
            },
          },
          in: {
            _id: "$$ownerObj._id",
            username: "$$ownerObj.username",
            avatar: "$$ownerObj.avatar",
          },
        },
      },
      likeCount: {
        $size: {
          $filter: {
            input: "$commentLikes",
            as: "cl",
            cond: { $eq: ["$$cl.comment", "$$comment._id"] },
          },
        },
      },
      isLiked: {
        $in: [
          userId,
          {
            $map: {
              input: {
                $filter: {
                  input: "$commentLikes",
                  as: "cl",
                  cond: { $eq: ["$$cl.comment", "$$comment._id"] },
                },
              },
              as: "cl",
              in: "$$cl.likedBy",
            },
          },
        ],
      },
    },
  },
},

      },
    },

    // Project only needed fields
    {
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        views: 1,
        likeCount: 1,
        totalComments: 1,
        isLiked: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: {
          _id: 1,
          username: 1,
          avatar: 1,
          subscribers: 1,
        },
        comments: 1,
      },
    },
  ]);

  if (!video || video.length === 0) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }

  // Return first (and only) matched video
  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Video id");
    }

    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
      throw new ApiError(400, "Please provide title and description");
    }

    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    if (!video.owner.equals(req.user?._id)) {
      throw new ApiError(401, "You are not authorized to update this video");
    }

    let thumbnailUrl = video.thumbnail;
    if (req.file?.path) {
      const thumbnailOnCloudinary = await uploadOnCloudinary(req.file.path, "img");
      if (!thumbnailOnCloudinary) {
        throw new ApiError(400, "Thumbnail not uploaded on cloudinary");
      }

      await deleteFromCloudinary(video.thumbnail, "img");
      thumbnailUrl = thumbnailOnCloudinary.url;
    }
    
    video.title = title;
    video.description = description;
    video.thumbnail = thumbnailUrl;

    await video.save();

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video updated successfully"));
  } catch (error) {
    console.error("Update video error:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, "Videos not updated"));
  }
});


const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Invalid video Id");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Invalid video");
  }
  if (!video.owner.equals(req.user?._id)) {
    throw new ApiError(401, "You are not authorized to delete this video");
  }
  const videoFile = await deleteFromCloudinary(video.videoFile, "video");
  const thumbnail = await deleteFromCloudinary(video.thumbnail, "img");
  if (!videoFile && !thumbnail) {
    throw new ApiError(
      500,
      "Thumbnail or video is not deleted from cloudinary"
    );
  }
  await Video.findByIdAndDelete(videoId);
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }
  const toggleIsPublished = await Video.findOne({
    _id: videoId,
    owner: req.user?._id,
  });
  if (!togglePublished) {
    throw new ApiError(401, "Invalid video or owner");
  }
  toggleIsPublished.isPublished = !toggleIsPublished.isPublished;
  await toggleIsPublished.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        toggleIsPublished,
        "isPublished toggled successfully"
      )
    );
});

export {
  getUserVideos,
  getAllVideos,
  searchVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
