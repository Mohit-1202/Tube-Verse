import VideoCard from "../Components/VideoCard/VideoCard";
import { mockVideos } from '../Mocks/mockVideos';

export default function Homepage() {
  return (
    <div className="grid grid-cols-1 mobile-lg:grid-cols-2 laptop:grid-cols-3 px-1">
      {mockVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
