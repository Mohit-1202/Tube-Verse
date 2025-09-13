import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { getVideoByIdService } from "../Services/VideoService";
import VideoSkeleton from "../Components/Skeletons/VideoSkeleton";
import LoaderContext from "../Context/Loader/LoaderContext";
import LikeContext from "../Context/Like/LikeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumbsUp, faShare } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons";

export default function Watch_Video_page() {
    const { id } = useParams();
    const { startLoading, stopLoading } = useContext(LoaderContext);
    const { toggleVideoLike, videoLikes } = useContext(LikeContext);

    const [video, setVideo] = useState(null);
    const [likeCount, setLikeCount] = useState(0);

    const hasFetched = useRef(false);

    // Fetch video by ID
    useEffect(() => {
        const fetchVideo = async () => {
            startLoading();
            const data = await getVideoByIdService(id);
            if (data) {
                setVideo(data);
                setLikeCount(data.likeCount || 0);
            }
            stopLoading();
        };
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchVideo();
        }
    }, [id]);

    // Handle video like
    const handleLike = async () => {
        const response = await toggleVideoLike(id);

        if (response) {
            setLikeCount(response.totalLikes);
        }
    };


    if (!video) {
        return (
            <div className="">
                <VideoSkeleton />
            </div>
        );
    }

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

                    {/* Like / Dislike / Share Section */}
                    <div className="flex items-center justify-between mt-3 px-2">
                        <div className="flex items-center space-x-4">
                            {/* LIKE BUTTON */}
                            <button
                                className="flex items-center space-x-1 hover:brightness-125 cursor-pointer"
                                onClick={handleLike}
                            >
                                <FontAwesomeIcon
                                    icon={videoLikes[id] ? solidThumbsUp : regularThumbsUp}
                                    className="text-[#e2e2e2] text-[18px]"
                                />
                                <span className="text-[#e2e2e2] text-[14px] font-semibold">
                                    {likeCount}
                                </span>
                            </button>

                            {/* DISLIKE BUTTON */}
                            <button className="hover:brightness-125">
                                <FontAwesomeIcon icon={faThumbsDown} className="text-[#e2e2e2] text-[18px]" />
                            </button>

                            {/* SHARE BUTTON */}
                            <button className="flex items-center space-x-1 hover:brightness-125">
                                <FontAwesomeIcon icon={faShare} className="text-[#e2e2e2] text-[18px]" />
                                <span className="text-[#e2e2e2] text-[14px] font-semibold">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Channel Info */}
                    <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center space-x-3">
                            <img
                                className="rounded-full w-11 h-11 cursor-pointer"
                                src={video.owner?.avatar || "https://newkgfindia.com/assets/users2.avif"}
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
                        <button className="subscribe-btn bg-[#FF9200] text-[14px] text-[#030303] px-2 py-1 rounded-[10px] ml-3">
                            Subscribe
                        </button>
                    </div>

                    {/* Views, Date, Description */}
                    <div className="video-description bg-[#383838] text-[#e2e2e2] p-2 rounded-lg mt-5 text-[14px]">
                        <div className="flex space-x-2 items-center mb-1">
                            <p className="total-views text-sm text-gray-400">{video.views || 0} Views</p>
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
                        <p className="text-bold start:text-[16px] text-white">290 Comments</p>
                    </div>

                    {/* Comment Input */}
                    <div className="comment-input mt-4 relative">
                        <textarea
                            className="w-full p-2 border-1 border-[#383838] text-white rounded-lg pr-16"
                            rows="3"
                            placeholder="Add a public comment..."
                        ></textarea>
                        <button className="bg-[#FF9200] text-[14px] text-[#030303] px-4 py-2 rounded-lg font-bold mt-2">
                            Comment
                        </button>
                    </div>

                    {/* Comment List */}
                    <div className="comment-list mt-8">
                        <div className="comment p-2 rounded-lg mb-5">
                            <div className="flex items-center space-x-3">
                                <img
                                    className="rounded-full w-9 h-9"
                                    src="https://newkgfindia.com/assets/users9.avif"
                                    alt="user avatar"
                                />
                                <div className="flex flex-col">
                                    <p className="text-white text-[14px] font-semibold">Ravan Khan</p>
                                    <p className="text-gray-400 text-[12px]">2 hours ago</p>
                                </div>
                            </div>
                            <div className="comment-text text-[#e2e2e2] mt-2 text-[14px]">
                                Great video! I really enjoyed watching your technique.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Videos */}
            <div className="second-section p-3">
                <div className="related-videos mt-5">
                    <h2 className="text-white text-[18px] font-bold mb-5">Related Videos</h2>

                    <div className="flex mb-4 cursor-pointer">
                        <img
                            className="w-40 h-24 object-cover rounded-lg"
                            src="https://dhoomindia.com/assets/images/Homepage_img1.jpg"
                            alt="Video Thumbnail"
                        />
                        <div className="flex flex-col ml-3">
                            <p className="text-white text-[14px] font-semibold leading-snug">
                                India KOREAN Craze is Out Of Control
                            </p>
                            <p className="text-gray-400 text-[12px]">Slayy Point</p>
                            <p className="text-gray-400 text-[12px]">2.5M views • 21 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
