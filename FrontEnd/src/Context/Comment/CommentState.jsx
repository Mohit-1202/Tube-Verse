import { useState, useContext } from "react";
import CommentContext from "./CommentContext";
import LoaderContext from "../Loader/LoaderContext";

import {
  getVideoCommentsService,
  addCommentService,
  updateCommentService,
  deleteCommentService,
} from "../../Services/CommentService";

import { toggleCommentLikeService } from "../../Services/LikeService"; // ✅ Correct import

// eslint-disable-next-line react/prop-types
const CommentState = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { startLoading, stopLoading } = useContext(LoaderContext);

  /**
   * Fetch comments for a specific video
   */
  const getVideoComments = async (videoId, pageNum = 1) => {
    if (!videoId) return false;

    try {
      startLoading();
      const response = await getVideoCommentsService(videoId, pageNum, limit);

      if (!response || !response.comments) {
        console.log("No comments found for this video");
        return false;
      }

      setComments(response.comments.Comments || []);
      setTotalComments(response.comments.total_comments || 0);
      setPage(pageNum);

      return true;
    } catch (error) {
      console.error("Error fetching video comments:", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  /**
   * Add a new comment to a video
   */
  const addComment = async (videoId, content) => {
    if (!videoId || !content) return false;

    try {
      startLoading();
      const response = await addCommentService(videoId, content);

      if (!response) {
        console.log("Failed to add comment");
        return false;
      }

      // Add the new comment at the top
      setComments((prev) => [response, ...prev]);
      setTotalComments((prev) => prev + 1);

      return response;
    } catch (error) {
      console.error("Error adding comment:", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  /**
   * Update an existing comment
   */
  const updateComment = async (commentId, content) => {
    if (!commentId || !content) return false;

    try {
      startLoading();
      const response = await updateCommentService(commentId, content);

      if (!response) {
        console.log("Failed to update comment");
        return false;
      }

      // Update the comment in the state
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? { ...comment, content } : comment
        )
      );

      return response;
    } catch (error) {
      console.error("Error updating comment:", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  /**
   * Delete a comment
   */
  const deleteComment = async (commentId) => {
    if (!commentId) return false;

    try {
      startLoading();
      const response = await deleteCommentService(commentId);

      if (!response) {
        console.log("Failed to delete comment");
        return false;
      }

      // Remove the deleted comment from state
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      setTotalComments((prev) => (prev > 0 ? prev - 1 : 0));

      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  /**
   * Toggle like/unlike on a comment
   */
  const toggleCommentLike = async (commentId) => {
    if (!commentId) return false;

    try {
      startLoading();

      const response = await toggleCommentLikeService(commentId);

      if (!response) {
        console.log("Failed to toggle like on comment");
        return false;
      }

      // Update comment state: toggle like
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likeCount: comment.isLiked
                  ? comment.likeCount - 1
                  : comment.likeCount + 1,
              }
            : comment
        )
      );

      return true;
    } catch (error) {
      console.error("Error toggling comment like:", error);
      return false;
    } finally {
      stopLoading();
    }
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        totalComments,
        page,
        limit,
        getVideoComments,
        addComment,
        updateComment,
        deleteComment,
        toggleCommentLike,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export default CommentState;
