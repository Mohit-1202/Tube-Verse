const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
};

const customFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("API Error:", data?.message || response.statusText);
      return { success: false, data };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Network or Fetch Error:", error);
    return { success: false, data: null };
  }
};

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

  // ✅ Append only non-empty parameters to URL
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
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("thumbnail", thumbnail);

  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/videos/${videoId}`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success ? data?.data || null : null;
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
