import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!(name, description)){
        throw new ApiError(401,"name and description is needed")
    }
    const createPlaylist = await playList({
        name:name,
        description:description,
        owner:new mongoose.Types.ObjectId(req.user._id)
    })
    if(!createPlaylist){
        throw new ApiError(401,"Playlist not created please try again later")
    }
    return res.status(200).json(new ApiResponse(200,createPlaylist,"Playlist Created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!userId){
        throw new ApiError(401,"Invalid user id")
    }
    const getPlaylist = await Playlist.find({
        owner:userId
    })
    if(!getPlaylist){
        throw new ApiError(400,"Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,getPlaylist,"Playlist found successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(401,"Invalid Playlist Id")
    }
    const findPlaylist = await Playlist.findById(playlistId)
    if(!findPlaylist){
        throw new ApiError(400,"Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,playlistId,"Playlist found successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!(playlistId, videoId)){
        throw new ApiError(401,"Invalid video or playlist Id")
    }
    const findPlaylist = await Playlist.findById(playlistId)
    if(!findPlaylist){
        throw new ApiError(401, "Invalid playlist")
    }
    if(!findPlaylist.owner.equals(req.user?._id)){
        throw new ApiError(400,"Your are not authorized to update this playlist")
    }
    if(!findPlaylist.video.includes(videoId)){
        throw new ApiError(400,"This video is already added in your playlist")
    }
    findPlaylist.video.push(videoId)
    const videoAdded = await playList.save()
    if(!videoAdded){
        throw new ApiError(501,"Video is not added in the playlist please try again")
    }
    return res.status(200,videoAdded,"Video added successfully")
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!(playlistId, videoId)){
        throw new ApiError(401,"Invalid videoId or playlistId")
    }
    const findVideo = await Playlist.findone({
        $and:[
            {_id:playlistId},
            {video:videoId}
        ]
    })
    if(!findVideo){
        throw new ApiError(401, "Playlist not found")
    }
    if(!findVideo.owner.equals(req.user._id)){
        throw new ApiError(400,"You can't update this playlist")
    }
    findVideo.video.pull(videoId)
    const videoRemoved = await playList.save()
    if(!videoRemoved){
        throw new ApiError(501,"Video is not added in the playlist please try again")
    }
    return res.status(200,videoRemoved,"Video added successfully")

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
   if(!playlistId){
    throw new ApiError(401,"Invalid Playlist added")
   }
   const findPlaylist = await Playlist.findById(playlistId)
   if(!findPlaylist){
    throw new ApiError(401,"Invalid playlist")
   }
   if(findPlaylist.owner.equals(req.user?._id)){
    throw new ApiError(400,"You are not authorized to delete this playlist")
   }
   const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
   if(!deletedPlaylist){
    throw new ApiError(501,"Failed to delete this playlist please try again later")
   }
   return res.status(200).json(200, deletedPlaylist, "Playlist deleted successfully")
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!isValidObjectId(playlistId)){
        throw new ApiError(401,"Invalid playlist")
    }
    if(!name && !description){
        throw new ApiError(401,"Name and description is required")
    }
    const findPlaylist = await Playlist.findById(playlistId)
    if(!findPlaylist){
        throw new ApiError(401,"Playlist not found")
    }
    if(!findPlaylist.owner.equals(req.user?._id)){
        throw new ApiError(400,"You are not authorized to update this playlist")
    }
    findPlaylist.name = name,
    findPlaylist.description=description
    const playlistUpdated = await findPlaylist.save()
    if(!playlistUpdated){
        throw new ApiError(500,"Failed to update playlist please try again later")
    }
    return res.status(200).json(new ApiResponse(200, playlistUpdated,"Playlist has been updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}