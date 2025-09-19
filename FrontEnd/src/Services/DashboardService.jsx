import customFetch from "../Utils/customFetch";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Fetch channel stats
export const GetChannelStats = async (username) => {
  const { success, data } = await customFetch(
    `${backendUrl}/dashboard/stats`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ channel:username }),
    }
  );

  return success ? data : false;
};


// Fetch channel videos with pagination
export const GetChannelVideos = async (channelId, page = 1, limit = 10) => {
  const { success, data } = await customFetch(
    `${backendUrl}/dashboard/videos?channelId=${encodeURIComponent(
      channelId
    )}&page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  return success ? data : false;
};
