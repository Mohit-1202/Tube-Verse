
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const getVideos = async () => {
  const page = "1";
  const limit = "10";
  const sortBy = "createdAt";
  const sortType = "1";
  const userId = "6790f07d511e4ea75cd4a949";
  const query = "";

  const url = new URL(`${backendUrl}/videos`);
  const params = { page, limit, sortBy, sortType, userId, query };

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  try {
    const accessToken = getCookie("accessToken");
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error response data:", errorData);
      return [];
    }

    const data = await response.json();
    return data.data.videos;
  } catch (error) {
    console.log("Error fetching data", error.message);
    return [];
  }
};

export const uploadVideo = async (title, description, thumbnail, videoFile) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("thumbnail", thumbnail);
  formData.append("videoFile", videoFile);

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  try {
    const response = await fetch(`${backendUrl}/videos/`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    console.log("Response:", json);
    return json;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};
