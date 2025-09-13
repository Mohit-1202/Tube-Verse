import { useState, useContext } from "react";
import LikeContext from "./LikeContext";
import LoaderContext from "../Loader/LoaderContext";

import {
  toggleVideoLikeService,
  toggleCommentLikeService,
  toggleTweetLikeService,
  getLikedVideosService
} from "../../Services/LikeService";

// eslint-disable-next-line react/prop-types
const LikeState = ({ children }) => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [videoLikes, setVideoLikes] = useState({});
  const [commentLikes, setCommentLikes] = useState({});
  const [tweetLikes, setTweetLikes] = useState({});

  const { startLoading, stopLoading } = useContext(LoaderContext);

  const toggleVideoLike = async (videoId) => {
    if (!videoId) return false;

    try {
      startLoading();
      const response = await toggleVideoLikeService(videoId);

      if (!response) {
        console.log("Failed to toggle video like in LikeState");
        return false;
      }

      setVideoLikes((prev) => ({
        ...prev,
        [videoId]: !prev[videoId],
      }));

      return response;
    } catch (error) {
      console.error("Error toggling video like:", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  const toggleCommentLike = async (commentId) => {
    if (!commentId) return false;

    try {
      startLoading();
      const response = await toggleCommentLikeService(commentId);

      if (!response) {
        console.log("Failed to toggle comment like in LikeState");
        return false;
      }

      // Update state
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));

      return response;
    } catch (error) {
      console.error("Error toggling comment like:", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  const toggleTweetLike = async (tweetId) => {
    if (!tweetId) return false;

    try {
      startLoading();
      const response = await toggleTweetLikeService(tweetId);

      if (!response) {
        console.log("Failed to toggle tweet like in LikeState");
        return false;
      }

      setTweetLikes((prev) => ({
        ...prev,
        [tweetId]: !prev[tweetId],
      }));

      return response;
    } catch (error) {
      console.error("Error toggling tweet like:", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  const getLikedVideos = async () => {
    try {
      startLoading();
      const response = await getLikedVideosService();

      if (!response || response.length === 0) {
        console.log("No liked videos found in LikeState");
        return false;
      }

      setLikedVideos(response);
      return true;
    } catch (error) {
      console.error("Error fetching liked videos:", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  return (
    <LikeContext.Provider
      value={{
        likedVideos,
        videoLikes,
        commentLikes,
        tweetLikes,
        toggleVideoLike,
        toggleCommentLike,
        toggleTweetLike,
        getLikedVideos
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};

export default LikeState;
