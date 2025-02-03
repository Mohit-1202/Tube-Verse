import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(401, "Invalid channel Id");
  }
  const channel = User.findById(channelId);
  if (!channel) {
    throw new ApiError(400, "Channel not found");
  }
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });
  if (existingSubscription) {
    const unSubscribeChannel = await Subscription.findByIdAndDelete(
      existingSubscription._id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          unSubscribeChannel,
          "Channel unsubscribed successfully"
        )
      );
  } else {
    const newSubscription = await Subscription.create({
      subscriber: req.user?._id,
      channel: channelId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, newSubscription, "Channel subscribed successfully")
      );
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(401, "Invalid channel id");
  }
  const subscriberList = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "channel",
        foreignField: "subscriber",
        as: "subscribedChannels",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $project: {
              username: 1,
              avatar: 1,
              fullName: 1,
              subscriberCount: {
                $size: "subscribers",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$subscriber",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        "subscriber.isSubscribed": {
          $cond: {
            if: {
              $in: ["$subscriber._id", "subscribedChannels.channel"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $group: {
        _id: "channel",
        subscriber: {
          $push: "$subscriber",
        },
      },
    },
  ]);
  const subscribers =
    subscriberList.length > 0 ? subscriberList[0].subscriber : [];
  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscriber sent successfully"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(401, "Invalid subscriber Id");
  }
  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: channel,
        pipeline: [
          {
            $project: {
              fullName: 1,
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$channel",
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "channel._id",
        foreignField: "channel",
        as: "channelSubscribers",
      },
    },
    {
      $addFields: {
        "channel.isSubscribed": {
          $cond: {
            if: { $in: [req.user?._id, "$channelSubscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
        "channel.subscriberCount": {
          $size: "$channelSubscribers",
        },
      },
    },
    {
        $group:{
            _id:"subscriber",
            subscribedChannels:{
                $push:$channel,
            }
        }
    }
  ]);
  const users = subscribedChannels?.length > 0 ? subscribedChannels[0].subscribedChannels:[]

  return res.status(200).json(new ApiResponse(200,users,"Subscribed channel list sent successfully"))
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
