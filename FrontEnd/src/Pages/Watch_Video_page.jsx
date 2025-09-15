import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { getVideoByIdService } from "../Services/VideoService";
import VideoSkeleton from "../Components/Skeletons/VideoSkeleton";
import LoaderContext from "../Context/Loader/LoaderContext";
import LikeContext from "../Context/Like/LikeContext";
import CommentContext from "../Context/Comment/CommentContext";
import UserContext from "../Context/User/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faThumbsUp as solidThumbsUp,
    faShare,
    faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import {
    faThumbsUp as regularThumbsUp,
    faThumbsDown,
} from "@fortawesome/free-regular-svg-icons";
import ConfirmModal from "../Components/ConfirmModal/ConfirmModal";

export default function Watch_Video_page() {
    const { id } = useParams();

    // Contexts
    const { startLoading, stopLoading } = useContext(LoaderContext);
    const { toggleVideoLike } = useContext(LikeContext);
    const { addComment, toggleCommentLike, deleteComment } =
        useContext(CommentContext);
    const { user } = useContext(UserContext);

    // States
    const [video, setVideo] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [totalComments, setTotalComments] = useState(0);
    const [activeCommentMenu, setActiveCommentMenu] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const hasFetched = useRef(false);

    const currentUserId = user?._id;

    // Fetch video data
    const fetchVideoData = async () => {
        startLoading();
        const data = await getVideoByIdService(id);
        if (data) {
            setVideo(data);
            setLikeCount(data.likeCount || 0);
            setIsLiked(data.isLiked || false);
            setTotalComments(data.totalComments || 0);
        }
        stopLoading();
    };

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchVideoData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Video like
    const handleLike = async () => {
        const response = await toggleVideoLike(id);
        if (response) {
            setLikeCount(response.totalLikes);
            setIsLiked((prev) => !prev);
        }
    };

    // Add comment
    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        const success = await addComment(id, commentText.trim());
        if (success) {
            setCommentText("");
            fetchVideoData();
        }
    };

    // Comment like
    const handleCommentLike = async (commentId) => {
        setVideo((prevVideo) => ({
            ...prevVideo,
            comments: prevVideo.comments.map((comment) =>
                comment._id === commentId
                    ? {
                        ...comment,
                        isLiked: !comment.isLiked,
                        likeCount: comment.isLiked
                            ? Math.max(0, (comment.likeCount || 0) - 1)
                            : (comment.likeCount || 0) + 1,
                    }
                    : comment
            ),
        }));

        const result = await toggleCommentLike(commentId);
        if (!result) fetchVideoData();
    };

    // Ask confirm before delete
    const confirmDelete = (commentId) => {
        setCommentToDelete(commentId);
        setShowConfirm(true);
    };

    // Delete comment after confirmation
    const handleDeleteComment = async () => {
        if (!commentToDelete) return;
        const success = await deleteComment(commentToDelete);
        if (success) {
            setVideo((prevVideo) => ({
                ...prevVideo,
                comments: prevVideo.comments.filter((c) => c._id !== commentToDelete),
            }));
            setTotalComments((prev) => (prev > 0 ? prev - 1 : 0));
            setActiveCommentMenu(null);
        } else {
            alert("Failed to delete comment");
        }
        setShowConfirm(false);
        setCommentToDelete(null);
    };

    if (!video) return <VideoSkeleton />;

    return (
        <div className="first-section">
            <div className="Video-Player p-3 start:p-2">
                <div className="video-section">
                    {/* Video Player */}
                    <video
                        className="w-full object-cover rounded-lg start:h-[200px] mobile:h-[250px] tab:h-[300px]"
                        controls
                        autoPlay
                    >
                        <source src={video.videoFile} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Video Title */}
                    <div className="mt-3">
                        <p className="text-white font-semibold text-lg">{video.title}</p>
                    </div>

                    {/* Like / Dislike / Share */}
                    <div className="flex items-center justify-between mt-3 px-2">
                        <div className="flex items-center space-x-4">
                            <button
                                className="flex items-center space-x-1 hover:brightness-125 cursor-pointer"
                                onClick={handleLike}
                            >
                                <FontAwesomeIcon
                                    icon={isLiked ? solidThumbsUp : regularThumbsUp}
                                    className="text-[18px] text-[#e2e2e2]"
                                />
                                <span className="text-[#e2e2e2] text-[14px] font-semibold">
                                    {likeCount}
                                </span>
                            </button>

                            <button className="hover:brightness-125 cursor-pointer">
                                <FontAwesomeIcon
                                    icon={faThumbsDown}
                                    className="text-[#e2e2e2] text-[18px]"
                                />
                            </button>

                            <button className="flex items-center space-x-1 hover:brightness-125 cursor-pointer">
                                <FontAwesomeIcon
                                    icon={faShare}
                                    className="text-[#e2e2e2] text-[18px]"
                                />
                                <span className="text-[#e2e2e2] text-[14px] font-semibold">
                                    Share
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Channel Info */}
                    <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center space-x-3">
                            <img
                                className="rounded-full w-11 h-11 cursor-pointer"
                                src={
                                    video.owner?.avatar ||
                                    "https://newkgfindia.com/assets/users2.avif"
                                }
                                alt="user avatar"
                            />
                            <div className="flex flex-col">
                                <p className="text-white text-[15px] font-semibold cursor-pointer">
                                    {video.owner?.username || "Unknown Channel"}
                                </p>
                                <p className="start:text-sm text-gray-400 cursor-pointer">
                                    {video.owner?.subscribers || 0} subscribers
                                </p>
                            </div>
                        </div>
                        <button className="subscribe-btn ml-3 bg-[#FF9200] text-[14px] text-[#030303] px-4 py-2 rounded-lg font-semibold cursor-pointer">
                            Subscribe
                        </button>
                    </div>

                    {/* Views, Date, Description */}
                    <div className="video-description bg-[#383838] text-[#e2e2e2] p-2 rounded-lg mt-5 text-[14px]">
                        <div className="flex space-x-2 items-center mb-1">
                            <p className="total-views text-sm text-gray-400">
                                {video.views || 0} Views
                            </p>
                            <div className="last-section upload-date text-sm text-gray-400">
                                <p>{new Date(video.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="description">{video.description}</div>
                    </div>
                </div>

                {/* Comment Section */}
                <div className="comment-section mt-10">
                    <div className="total-comments">
                        <p className="font-bold text-[16px] text-white">
                            {totalComments} Comments
                        </p>
                    </div>

                    {/* Comment Input */}
                    <div className="comment-input mt-4 relative">
                        <textarea
                            className="w-full p-2 border-1 border-[#383838] text-white rounded-lg pr-16"
                            rows="3"
                            placeholder="Add a public comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                        <button
                            onClick={handleAddComment}
                            className="bg-[#FF9200] text-[14px] text-[#030303] px-4 py-2 rounded-lg font-bold mt-2 cursor-pointer"
                        >
                            Comment
                        </button>
                    </div>

                    {/* Comment List */}
                    <div className="comment-list mt-8">
                        {video.comments && video.comments.length > 0 ? (
                            video.comments.map((comment) => {
                                const canManage =
                                    (currentUserId &&
                                        String(comment.owner?._id) === String(currentUserId)) ||
                                    (currentUserId &&
                                        String(video.owner?._id) === String(currentUserId));

                                return (
                                    <div
                                        key={comment._id}
                                        className="comment p-2 rounded-lg mb-5 bg-[#2c2c2c] relative"
                                    >
                                        <div className="flex items-center justify-between">
                                            {/* Left: Avatar + Info */}
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    className="rounded-full w-9 h-9"
                                                    src={
                                                        comment.owner?.avatar ||
                                                        "https://newkgfindia.com/assets/users9.avif"
                                                    }
                                                    alt="user avatar"
                                                />
                                                <div className="flex flex-col">
                                                    <p className="text-white text-[14px] font-semibold">
                                                        {comment.owner?.username || "Unknown User"}
                                                    </p>
                                                    <p className="text-gray-400 text-[12px]">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Options Menu */}
                                            {canManage && (
                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            setActiveCommentMenu(
                                                                activeCommentMenu === comment._id
                                                                    ? null
                                                                    : comment._id
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-white px-2 py-1"
                                                    >
                                                        <FontAwesomeIcon icon={faEllipsisV} />
                                                    </button>

                                                    {activeCommentMenu === comment._id && (
                                                        <div className="absolute right-0 mt-2 w-28 bg-[#383838] rounded-lg shadow-lg z-10">
                                                            <button
                                                                onClick={() => confirmDelete(comment._id)}
                                                                className="block w-full text-left bg-[#383838] border-[1px] p-2 border-gray-800 rounded-md text-white cursor-pointer"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {/* Comment Text */}
                                        <div className="comment-text text-[#e2e2e2] mt-2 text-[14px]">
                                            {comment.content}
                                        </div>
                                        {/* Comment Like */}
                                        <div className="flex items-center mt-2 space-x-2">
                                            <button
                                                onClick={() => handleCommentLike(comment._id)}
                                                className="flex items-center space-x-1 hover:brightness-125"
                                            >
                                                <FontAwesomeIcon
                                                    icon={comment.isLiked ? solidThumbsUp : regularThumbsUp}
                                                    className="text-[18px] text-[#e2e2e2]"
                                                />
                                                <span className="text-gray-400 text-sm">
                                                    {comment.likeCount}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-400 text-sm">No comments yet</p>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                title="Delete Comment"
                message="Are you sure you want to delete this comment? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDeleteComment}
                onCancel={() => setShowConfirm(false)}
            />

        </div>
    );
}
