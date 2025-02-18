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

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  let pipeline = [
    {
      $match: {
        $or: [
          { owner: new mongoose.Types.ObjectId(userId) },
          {
            $or: [
              { title: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
            ],
          },
        ],
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
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $sort: { [sortBy || "createdAt"]: sortType ? parseInt(sortType) : -1 },
    },
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
    const result = await Video.aggregatePaginate(
      Video.aggregate(pipeline),
      options
    );
    if (result?.videos?.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Videos fetched successfully"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Videos fetched successfully"));
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json(
        new ApiError(500, {}, "Internal server error in video aggregation")
      );
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
  try {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Video Id");
    }
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(400, "Failed to get video details");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Videos found successfully"));
  } catch (error) {
    res.status(501).json(new ApiError(501, "Video not found"));
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Video id");
    }
    const { title, description } = req.body;
    if (
      [title, description].some((field) => {
        field.trim() === "";
      })
    ) {
      throw new ApiError(400, "Please provide title and description");
    }
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(400, "Video not found");
    }
    if (!video.owner.equals(req.user?._id)) {
      throw new ApiError(401, "You are not authorized to update this video");
    }
    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail not found");
    }
    const thumbnailOnCloudinary = await uploadOnCloudinary(
      thumbnailLocalPath,
      "img"
    );
    if (!thumbnailOnCloudinary) {
      throw new ApiError(400, "Thumbnail not uploaded on cloudinary");
    }
    const thumbnailOldUrl = video?.thumbnail;
    const deletethumbnailOldUrl = await deleteFromCloudinary(
      thumbnailOldUrl,
      "img"
    );
    if (!deletethumbnailOldUrl) {
      throw new ApiError(400, "Failed to delete thumbnail from cloudinary");
    }
    video.title = title;
    video.description = description;
    video.thumbnail = thumbnailOnCloudinary.url;
    await video.save();
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Videos updated successfully"));
  } catch (error) {
    console.log(error.message);
    return res
      .status(500, error)
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
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
