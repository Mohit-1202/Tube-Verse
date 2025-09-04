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
  const displayChannel = channel || owner?.username || owner?.fullName || "Unknown Channel";
  const displayTimestamp = timestamp || new Date(createdAt).toLocaleDateString();
  const displayDuration = formatDuration(duration);

  return (
    <div
      className={`video-container text-white rounded-xl p-2 w-full ${isHorizontal ? "sm:flex sm:gap-4" : ""
        }`}
      key={videoId}
    >
      {/* Thumbnail */}
      <Link to="/watch-video">
        <div
          className={`thumbnail relative overflow-hidden rounded-xl mb-3 sm:mb-0 ${isHorizontal
              ? "sm:w-60 sm:h-32 laptop:w-96 laptop:h-56 w-full aspect-video"
              : "aspect-video w-full"
            }`}
        >
          <img
            src={thumbnail}
            alt="thumbnail"
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-2 right-2 bg-black/40 px-1 py-[5px] text-xs rounded">
            {displayDuration}
          </span>
        </div>
      </Link>

      {/* Info Section */}
      <div
        className={`video-info ${isHorizontal
            ? "sm:mt-0 mt-2 sm:flex sm:flex-col sm:justify-center"
            : "flex"
          }`}
      >
        {!isHorizontal && (
          <div className="first-section">
            <img
              className="rounded-full w-10 h-10 mt-3 cursor-pointer"
              src={
                owner?.avatar || video?.avatar || "https://newkgfindia.com/assets/users2.avif"
              }
              alt="user avatar"
            />
          </div>
        )}

        <div
          className={`mid-section sm:px-3 px-0 flex-grow mt-3 mobile-lg:ml-2 mini:ml-0`}
        >
          <Link to="/watch-video">
            <p className="text-base font-semibold text-white line-clamp-2 cursor-pointer">
              {title}
            </p>

            {isHorizontal && (
              <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </Link>
          <p className="text-sm text-gray-400 cursor-pointer hover:text-white mt-1">
            {displayChannel}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-400">
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
