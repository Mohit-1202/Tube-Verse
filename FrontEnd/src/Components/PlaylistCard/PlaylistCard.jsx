/* eslint-disable react/prop-types */

export default function PlaylistCard({ playlist }) {
  const {
    playlistTitle,
    playlistdecription,
    totalVideos,
    CreatedOn,
    thumbnail
  } = playlist;

  return (
    <div className="playlist-container w-full max-w-full p-2 rounded-xl text-white">
      {/* Thumbnail */}
      <div className="thumbnail rounded-xl overflow-hidden cursor-pointer relative aspect-video">
        <img
          className="w-full h-full object-cover"
          src={thumbnail}
          alt="thumbnail"
        />
      </div>

      {/* Info Section */}
      <div className="video-info flex mt-4">
        {/* User Avatar */}
        <div className="user-image">
          <img
            className="rounded-full w-10 h-10 mt-1 cursor-pointer"
            src="https://newkgfindia.com/assets/users2.avif"
            alt="user avatar"
          />
        </div>

        {/* Playlist Details */}
        <div className="flex flex-col justify-center px-3 flex-grow">
          <p className="text-base font-semibold text-white line-clamp-2">
            {playlistTitle}
          </p>
          <p className="text-sm text-gray-400 cursor-pointer hover:text-white">
            {playlistdecription}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">{totalVideos}</p>
            <p className="text-sm text-gray-400">{CreatedOn}</p>
          </div>
          <a
            href="#"
            className="text-sm text-gray-300 mt-1 hover:underline w-fit"
          >
            View Full Playlist
          </a>
        </div>
      </div>
    </div>
  );
}
