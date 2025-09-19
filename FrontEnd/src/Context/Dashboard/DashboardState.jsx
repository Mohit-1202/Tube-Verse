/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import DashboardContext from "./DashboardContext";
import LoaderContext from "../Loader/LoaderContext";
import { GetChannelStats, GetChannelVideos } from "../../Services/DashboardService";

const DashboardState = ({ children }) => {
  const [channelStats, setChannelStats] = useState(null); 
  const [channelVideos, setChannelVideos] = useState(null);    
  const [totalVideos, setTotalVideos] = useState(0);           

  const { startLoading, stopLoading } = useContext(LoaderContext);

  /**
   * Fetch channel stats
   * @param {string} channel - channel username
   */
  const getChannelStats = async (channel) => {
    try {
      startLoading();
      const response = await GetChannelStats(channel);

      if (!response || response.success !== true) {
        console.log("Failed to fetch channel stats in DashboardState");
        return false;
      } else {
        setChannelStats(response.data);
        return true;
      }
    } catch (error) {
      console.log("Caught an error in fetching channel stats in DashboardState", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  const getChannelVideos = async (channelId, page = 1, limit = 10) => {
    try {
      startLoading();
      const response = await GetChannelVideos(channelId, page, limit);

      if (!response || response.success !== true) {
        console.log("Failed to fetch channel videos in DashboardState");
        return false;
      } else {
        setChannelVideos(response.data.Videos);
        setTotalVideos(response.data.total_videos);
        return true;
      }
    } catch (error) {
      console.log("Caught an error in fetching channel videos in DashboardState", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        channelStats,
        channelVideos,
        totalVideos,
        getChannelStats,
        getChannelVideos,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardState;
