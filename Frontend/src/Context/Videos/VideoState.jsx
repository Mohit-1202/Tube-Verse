/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import VideoContext from "./VideoContext";
import { getVideos as fetchVideos, uploadVideo } from "../../Services/VideoService"; 

const VideoState = ({ children }) => {
  const [videos, setVideos] = useState([]);

  const getVideos = async () => {
    try {
      const data = await fetchVideos();
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    getVideos();
  },[] );

  return (
    <VideoContext.Provider value={{ videos, getVideos, uploadVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoState;
