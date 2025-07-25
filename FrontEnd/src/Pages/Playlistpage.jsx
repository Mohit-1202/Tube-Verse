import { mockPlaylists } from "../Mocks/mockPlaylists";
import PlaylistCard from "../Components/PlaylistCard/PlaylistCard";
import { Link } from "react-router";

export default function Playlistpage() {
  return (
      <>
      <h2 className="text-[30px] font-semibold mb-6 text-white px-2">All Playlists</h2>
    <Link to="/full-playlist">
    <div className="grid grid-cols-1 mobile-lg:grid-cols-2 laptop:grid-cols-3 px-1">
      {mockPlaylists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
    </Link>
      </>
  );
}
