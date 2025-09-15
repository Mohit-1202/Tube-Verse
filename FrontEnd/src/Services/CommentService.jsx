import customFetch from "../Utils/customFetch";
import getCookie from "../Utils/getCookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetch all comments for a specific video
 */
export const getVideoCommentsService = async (videoId, page = 1, limit = 10) => {
  if (!videoId) {
    console.error("Video ID is required to fetch comments");
    return [];
  }

  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(
    `${backendUrl}/comments/${videoId}?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return success ? data?.data?.comments || [] : [];
};

/**
 * Add a new comment to a specific video
 */
export const addCommentService = async (videoId, content) => {
  if (!videoId) {
    console.error("Video ID is required to add a comment");
    return null;
  }
  if (!content || content.trim() === "") {
    console.error("Comment content cannot be empty");
    return null;
  }

  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/comments/${videoId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content }),
  });

  return success ? data?.data || null : null;
};

/**
 * Update an existing comment
 */
export const updateCommentService = async (commentId, content) => {
  if (!commentId) {
    console.error("Comment ID is required to update a comment");
    return null;
  }
  if (!content || content.trim() === "") {
    console.error("Comment content cannot be empty");
    return null;
  }

  const accessToken = getCookie("accessToken");

  const { success, data } = await customFetch(`${backendUrl}/comments/c/${commentId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content }),
  });

  return success ? data?.data || null : null;
};

/**
 * Delete a comment
 */
export const deleteCommentService = async (commentId) => {
  if (!commentId) {
    console.error("Comment ID is required to delete a comment");
    return false;
  }

  const accessToken = getCookie("accessToken");

  const { success } = await customFetch(`${backendUrl}/comments/c/${commentId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return success;
};