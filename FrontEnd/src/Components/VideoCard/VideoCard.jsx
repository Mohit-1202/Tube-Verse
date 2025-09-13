/* eslint-disable react/prop-types */
import { Link } from "react-router";

export default function VideoCard({ video, variant = "default" }) {
  const {
    title,
    description,
    thumbnail,
    duration,
    views,
    timestamp,
    channel,
    owner,
    createdAt,
    id,
    _id
  } = video;

  const isHorizontal = variant === "horizontal";

  const videoId = id || _id;
  const displayChannel =
    channel || owner?.username || owner?.fullName || "Unknown Channel";
  const displayTimestamp = timestamp || new Date(createdAt).toLocaleDateString();
  const displayDuration = formatDuration(duration);
  const ownerAvatar =
    owner?.avatar || video?.avatar || "https://newkgfindia.com/assets/users2.avif";

  return (
    <div
      className={`video-container text-white rounded-xl p-2 w-full ${
        isHorizontal ? "flex items-start gap-4 mb-4" : ""
      }`}
      key={videoId}
    >
      {/* Thumbnail */}
      <Link to={`/watch-video/${videoId}`}>
        <div
          className={`thumbnail relative overflow-hidden rounded-xl ${
            isHorizontal
              ? "w-52 h-32 sm:w-64 sm:h-36"
              : "aspect-video w-full mb-3"
          }`}
        >
          <img
            src={thumbnail}
            alt="thumbnail"
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-2 right-2 bg-black/60 px-1 py-[3px] text-xs rounded">
            {displayDuration}
          </span>
        </div>
      </Link>

      {/* Info Section */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <Link to={`/watch-video/${videoId}`}>
            <p className="text-lg font-semibold text-white line-clamp-2 hover:text-gray-300">
              {title}
            </p>

            {isHorizontal && (
              <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </Link>
        </div>

        {/* Owner + Metadata */}
        <div className="mt-2 flex items-center justify-between">
          {/* Left: Owner Avatar + Channel Name */}
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              src={ownerAvatar}
              alt={displayChannel}
            />
            <p className="text-sm text-gray-400 hover:text-white cursor-pointer">
              {displayChannel}
            </p>
          </div>

          {/* Right: Views + Date */}
          <div className="flex flex-col items-end text-sm text-gray-400">
            <p>{views || 0} Views</p>
            <p>{displayTimestamp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDuration(durationInSeconds) {
  if (!durationInSeconds || isNaN(durationInSeconds)) return "00:00";

  const totalSeconds = Math.floor(durationInSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}
