/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import VideoContext from "./VideoContext";
import {
  getVideosService,
  getUserVideosService,
  uploadVideoService,
} from "../../Services/VideoService";
import LoaderContext from "../Loader/LoaderContext";

const VideoState = ({ children }) => {
  const [videos, setVideos] = useState([]);  
  const [yourVideo, setYourVideo] = useState([]);

  const { startLoading, stopLoading } = useContext(LoaderContext);

  // Fetch all videos
  const getVideos = async () => {
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
  };

  // Fetch videos uploaded by the logged-in user
  const getYourVideos = async () => {
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
  };

  // Upload a new video
  const uploadVideo = async (title, description, thumbnail, videoFile) => {
    startLoading();
    try {
      const response = await uploadVideoService(title, description, thumbnail, videoFile);

      if (!response?.success) {
        console.error("Failed to upload video in VideoState");
        return false;
      }

      // Prepend newly uploaded video to user videos
      setYourVideo((prev) => [response.data.video, ...prev]);
      return true;
    } catch (error) {
      console.error("Error uploading video in VideoState:", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        yourVideo,
        getVideos,
        getYourVideos,
        uploadVideo,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoState;
