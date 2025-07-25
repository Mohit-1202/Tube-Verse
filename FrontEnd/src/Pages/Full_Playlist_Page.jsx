import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,} from "@fortawesome/free-solid-svg-icons";
import { mockVideos } from '../Mocks/mockVideos';
import VideoCard from "../Components/VideoCard/VideoCard";
// import { mockPlaylists } from "../Mocks/mockPlaylists";

export default function Full_Playlist_Page() {
  // const selectedPlaylist = mockPlaylists[0];
  const playlistThumbnail = mockVideos[0].thumbnail;

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white p-6">
      <h2 className="text-[30px] font-semibold mb-6 px-2">Playlist</h2>
      <div className="flex flex-col mobile-lg:flex-row gap-6">
        {/* Left Playlist Card */}
        <div className="bg-[#3a3a3a] rounded-xl p-4 w-full md:w-1/2 lg:w-1/3">
          <img
            src={playlistThumbnail}
            alt="Playlist Thumbnail"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Playlist 1</h2>
          <p className="text-lg text-gray-300 mb-1">
            This is my playlist description
          </p>
          <p className="text-md text-gray-400 mb-1">Created by : Mohit Mishra</p>
          <p className="text-md text-gray-400 mb-4">Created on : 12-05-2002</p>
          <button className="bg-[#FF9200] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#e07f00] transition-all">
            Edit Playlist <FontAwesomeIcon icon={faEdit} className="ml-2" />
          </button>
        </div>

        {/* Right Video List */}
        <div className="flex flex-col gap-4 w-full md:w-2/3">
          {mockVideos.map((video, index) => (
            <VideoCard key={index} video={video} variant="horizontal" />
          ))}
        </div>
      </div>
    </div>
  );
}
