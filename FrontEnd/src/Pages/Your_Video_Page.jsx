import { Link } from "react-router-dom";
import VideoCard from "../Components/VideoCard/VideoCard";
import { mockVideos } from '../Mocks/mockVideos';

export default function Your_Video_Page() {
  return (
    <>
      <div className="flex start:flex-col tab:flex-row justify-between start:items-start laptop:items-center mb-6 mt-5 px-2">
        <h2 className="text-3xl font-bold text-white start:mb-2">Your Videos</h2>
        <div className="space-x-2">
         <Link to="/your-channel">
          <button className="bg-[#FF9200] text-[#030303] font-medium px-4 py-1 rounded-md cursor-pointer">
            Your Account
          </button>
          </Link>
          <Link>
          <button className="bg-[#FF9200] text-[#030303] font-medium px-4 py-1 rounded-md cursor-pointer">
            Manage Videos
          </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 mobile-lg:grid-cols-2 laptop:grid-cols-3 px-1">
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </>
  );
}
