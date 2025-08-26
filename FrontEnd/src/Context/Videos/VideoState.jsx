/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import VideoContext from "./VideoContext";
import { getVideos as fetchVideos, uploadVideoService } from "../../Services/VideoService"; 
import LoaderContext from "../Loader/LoaderContext";

const VideoState = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const {startLoading,stopLoading} = useContext(LoaderContext)
  const [yourVideo,setYourVideo] = useState([])

  const getVideos = async () => {
    startLoading()
    try {
      const data = await fetchVideos();
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }finally{
      stopLoading()
    }
  };

  const uploadVideo = async (title, description, thumbnail, videoFile) => {
      startLoading()
    try {
      const response = await uploadVideoService(title, description, thumbnail, videoFile)
      if(response.success !== true){
        console.log("Failed to upload video in video state")
        return false
      }
      else{
        setYourVideo(response.data.videos)
        return true
      }
    } catch (error) {
      console.log("Caught an error in uploading video in video state",error)
    }
    finally{
      stopLoading()
    }
  }
  useEffect(() => {
    getVideos();
    uploadVideo()
  },[] );

  return (
    <VideoContext.Provider value={{ videos, getVideos, uploadVideo,yourVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoState;
