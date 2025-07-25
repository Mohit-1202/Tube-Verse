import VideoCard from "../Components/VideoCard/VideoCard";
import { mockVideos } from '../Mocks/mockVideos';

export default function Watch_History_Page() {
  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white laptop:px-4 laptop:py-6">
      <div className="max-w-5xl mx-auto">
      <h2 className="text-[30px] font-semibold mb-3">Liked Videos</h2>
        {mockVideos.map((video, index) => (
          <VideoCard key={index} video={video} variant="horizontal" />
        ))}
      </div>
    </div>
  );
}

