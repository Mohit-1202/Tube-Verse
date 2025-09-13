import customFetch from "../Utils/customFetch";
import getCookie from "../Utils/getCookie";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getVideosService = async ({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortType = -1,
  userId,
  query,
} = {}) => {
  const url = new URL(`${backendUrl}/videos`);

  const params = {
    page,
    limit,
    sortBy,
    sortType,
    userId,
    query,
  };

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      url.searchParams.append(key, value);
    }
  });

  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });

  return success ? data?.data?.videos || [] : [];
};

export const getUserVideosService = async (
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortType = -1
) => {
  const url = new URL(`${backendUrl}/videos/your-videos`);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  url.searchParams.append("sortBy", sortBy);
  url.searchParams.append("sortType", sortType);

  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success ? data?.data?.videos || [] : [];
};

export const searchVideosService = async (query, page = 1, limit = 10) => {
  const url = new URL(`${backendUrl}/videos/search/videos`);
  url.searchParams.append("query", query);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);

  const { success, data } = await customFetch(url, {
    method: "GET",
    credentials: "include",
  });

  return success ? data?.data?.videos || [] : [];
};

// 4. Get a single video by ID
export const getVideoByIdService = async (videoId) => {
  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/videos/${videoId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success ? data?.data || null : null;
};

// 5. Upload new video
export const uploadVideoService = async (title, description, thumbnail, videoFile) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("thumbnail", thumbnail);
  formData.append("videoFile", videoFile);

  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/videos`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success ? data : null;
};

// 6. Update a video
export const updateVideoService = async (videoId, title, description, thumbnail) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // Only append thumbnail if a new one is provided
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const accessToken = getCookie("accessToken");

    const response = await customFetch(`${backendUrl}/videos/${videoId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Ensure we return a consistent response
    return {
      success: response?.success || false,
      data: response?.data || null,
      message: response?.message || "Failed to update video",
    };
  } catch (error) {
    console.error("Error updating video:", error);
    return {
      success: false,
      message: "Network error while updating video",
    };
  }
};

// 7. Delete a video
export const deleteVideoService = async (videoId) => {
  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/videos/${videoId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success ? data?.data || null : null;
};

// 8. Toggle publish status
export const togglePublishStatusService = async (videoId) => {
  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/videos/toggle/publish/${videoId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success ? data?.data || null : null;
};
