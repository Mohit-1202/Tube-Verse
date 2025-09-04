const backendUrl = import.meta.env.VITE_BACKEND_URL;

/* ---------- Helper: Get Cookie ---------- */
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

/* ---------- Helper: Fetch Wrapper ---------- */
const customFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    const data = await response.json().catch(() => ({})); // avoid crashing if no JSON returned

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

/* =====================================================
   1) Get All Videos
===================================================== */
export const getVideosService = async ({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortType = -1,
  userId = "",
  query = "",
} = {}) => {
  const url = new URL(`${backendUrl}/videos`);
  const params = { page, limit, sortBy, sortType, userId, query };

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

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

/* =====================================================
   2) Get Logged-in User's Videos
===================================================== */
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

/* =====================================================
   3) Search Videos
===================================================== */
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

/* =====================================================
   4) Get Video by ID
===================================================== */
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

/* =====================================================
   5) Upload a New Video
===================================================== */
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

/* =====================================================
   6) Update Video
===================================================== */
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

/* =====================================================
   7) Delete Video
===================================================== */
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

/* =====================================================
   8) Toggle Publish Status
===================================================== */
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
