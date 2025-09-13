/* eslint-disable react/prop-types */
import { useContext, useState, useCallback } from "react";
import VideoContext from "./VideoContext";
import {
  getVideosService,
  getUserVideosService,
  uploadVideoService,
  updateVideoService,
  deleteVideoService,
  togglePublishStatusService
} from "../../Services/VideoService";
import LoaderContext from "../Loader/LoaderContext";

const VideoState = ({ children }) => {
  const [videos, setVideos] = useState([]);  
  const [yourVideo, setYourVideo] = useState([]);

  const { startLoading, stopLoading } = useContext(LoaderContext);

  const getVideos = useCallback(async () => {
    startLoading();
    try {
      const data = await getVideosService();
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const getYourVideos = useCallback(async () => {
    startLoading();
    try {
      const data = await getUserVideosService();
      setYourVideo(data || []);
    } catch (error) {
      console.error("Error fetching your videos:", error);
      setYourVideo([]);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const uploadVideo = useCallback(async (title, description, thumbnail, videoFile) => {
    startLoading();
    try {
      const response = await uploadVideoService(title, description, thumbnail, videoFile);

      if (!response?.success) {
        console.error("Failed to upload video in VideoState");
        return false;
      }

      setYourVideo((prev) => [response.data.video, ...prev]);
      return true;
    } catch (error) {
      console.error("Error uploading video in VideoState:", error);
      return false;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const updateVideo = useCallback(async (videoId, title, description, thumbnail) => {
    startLoading();
    try {
      const response = await updateVideoService(videoId, title, description, thumbnail);

      if (!response?.success) {
        console.error("Failed to update video in VideoState");
        return false;
      }

      setYourVideo(prev => prev.map(video => 
        video._id === videoId ? { ...video, title, description, thumbnail: response.data.data.thumbnail  || thumbnail } : video
      ));

      setVideos(prev => prev.map(video => 
        video._id === videoId ? { ...video, title, description, thumbnail: response.data.data.thumbnail || thumbnail } : video
      ));
      return response;
    } catch (error) {
      console.error("Error updating video in VideoState:", error);
      return false;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const deleteVideo = useCallback(async (videoId) => {
    startLoading();
    try {
      const response = await deleteVideoService(videoId);

      if (!response?.success) {
        console.error("Failed to delete video in VideoState");
        return false;
      }

      setYourVideo(prev => prev.filter(video => video._id !== videoId));

      setVideos(prev => prev.filter(video => video._id !== videoId));

      return true;
    } catch (error) {
      console.error("Error deleting video in VideoState:", error);
      return false;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const togglePublishStatus = useCallback(async (videoId) => {
    startLoading();
    try {
      const response = await togglePublishStatusService(videoId);

      if (!response?.success) {
        console.error("Failed to toggle publish status in VideoState");
        return false;
      }

      // Update the video's publish status in yourVideo state
      setYourVideo(prev => prev.map(video => 
        video._id === videoId ? { ...video, isPublished: !video.isPublished } : video
      ));

      // Also update in videos state if it exists there
      setVideos(prev => prev.map(video => 
        video._id === videoId ? { ...video, isPublished: !video.isPublished } : video
      ));

      return true;
    } catch (error) {
      console.error("Error toggling publish status in VideoState:", error);
      return false;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return (
    <VideoContext.Provider
      value={{
        videos,
        yourVideo,
        getVideos,
        getYourVideos,
        uploadVideo,
        updateVideo,
        deleteVideo,
        togglePublishStatus
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoState;