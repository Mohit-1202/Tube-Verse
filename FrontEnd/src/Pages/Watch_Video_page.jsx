import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getVideoByIdService } from "../Services/VideoService";
import LoaderContext from "../Context/Loader/LoaderContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumbsUp, faShare } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons";

export default function Watch_Video_page() {
  const { id} = useParams();
  const { startLoading, stopLoading } = useContext(LoaderContext);

  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      startLoading();
      const data = await getVideoByIdService(id);
      setVideo(data);
      stopLoading();
    };
    fetchVideo();
  }, [id]);

  if (!video) {
    return <p className="text-white p-5">Loading video...</p>;
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

          {/* Like / Dislike / Share */}
          <div className="flex items-center justify-between mt-3 px-2">
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center space-x-1 hover:brightness-125 cursor-pointer"
                onClick={() => setLiked(!liked)}
              >
                <FontAwesomeIcon
                  icon={liked ? solidThumbsUp : regularThumbsUp}
                  className="text-[#e2e2e2] text-[18px]"
                />
                <span className="text-[#e2e2e2] text-[14px] font-semibold">
                  {video.likes || 0}
                </span>
              </button>
              <button className="hover:brightness-125">
                <FontAwesomeIcon icon={faThumbsDown} className="text-[#e2e2e2] text-[18px]" />
              </button>
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
      </div>
    </div>
  );
}
