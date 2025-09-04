/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import VideoContext from "./VideoContext";
import { 
  getVideosService, 
  uploadVideoService,
  getUserVideosService 
} from "../../Services/VideoService"; 
import LoaderContext from "../Loader/LoaderContext";

const VideoState = ({ children }) => {
  const [videos, setVideos] = useState([]);  
  const [yourVideo, setYourVideo] = useState([]);
  const { startLoading, stopLoading } = useContext(LoaderContext);

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

  const getYourVideos = async () => {
    startLoading();
    try {
      const data = await getUserVideosService();
      setYourVideo(data || []);
    } catch (error) {
      console.error("Error fetching user videos:", error);
      setYourVideo([]);
    } finally {
      stopLoading();
    }
  };

  const uploadVideo = async (title, description, thumbnail, videoFile) => {
    startLoading();
    try {
      const response = await uploadVideoService(title, description, thumbnail, videoFile);

      if (!response.success) {
        console.log("Failed to upload video in VideoState");
        return false;
      }

      setYourVideo((prev) => [response.data.video, ...prev]);
      return true;
    } catch (error) {
      console.log("Error uploading video in VideoState:", error);
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
        uploadVideo 
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoState;
