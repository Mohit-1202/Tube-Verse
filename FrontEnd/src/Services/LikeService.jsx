import customFetch from "../Utils/customFetch";
import getCookie from "../Utils/getCookie";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const toggleVideoLikeService = async (videoId) => {
  if (!videoId) {
    console.error("Video ID is required to toggle like");
    return false;
  }

  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/likes/toggle/v/${videoId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success ? data?.data || null : null;
};

export const toggleCommentLikeService = async (commentId) => {
  if (!commentId) {
    console.error("Comment ID is required to toggle like");
    return false;
  }

  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/likes/toggle/c/${commentId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success ? data?.data || null : null;
};

export const toggleTweetLikeService = async (tweetId) => {
  if (!tweetId) {
    console.error("Tweet ID is required to toggle like");
    return false;
  }

  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/likes/toggle/t/${tweetId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success ? data?.data || null : null;
};

export const getLikedVideosService = async () => {
  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/likes/videos`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success ? data?.data || [] : [];
};
