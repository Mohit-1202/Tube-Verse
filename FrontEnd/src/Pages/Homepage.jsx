import { useContext, useEffect, useState } from "react";
import VideoCard from "../Components/VideoCard/VideoCard";
import VideoContext from "../Context/Videos/VideoContext";
import SkeletonVideoCard from "../Components/Skeletons/VideoSkeleton";

export default function Homepage() {
  const { videos, getVideos } = useContext(VideoContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      await getVideos();
      setLoading(false);
    };
    fetchVideos();
  }, []);

  return (
    <div className="grid grid-cols-1 mobile-lg:grid-cols-2 laptop:grid-cols-3 gap-4 px-1">
      {loading ? (
        // Show skeleton loaders while loading
        [...Array(9)].map((_, index) => <SkeletonVideoCard key={index} />)
      ) : videos.length > 0 ? (
        videos.map((video) => <VideoCard key={video._id} video={video} />)
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No videos found
        </p>
      )}
    </div>
  );
}
