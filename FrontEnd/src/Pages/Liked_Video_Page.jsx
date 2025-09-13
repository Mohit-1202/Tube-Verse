import { useEffect, useContext, useState } from "react";
import VideoCard from "../Components/VideoCard/VideoCard";
import LikeContext from "../Context/Like/LikeContext";
import VideoSkeleton from "../Components/Skeletons/VideoSkeleton";

export default function Liked_Video_Page() {
  const { likedVideos, getLikedVideos } = useContext(LikeContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      setLoading(true);
      await getLikedVideos();
      setLoading(false);
    };

    fetchLikedVideos();
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white laptop:px-4 laptop:py-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-[30px] font-semibold mb-3">Liked Videos</h2>

        {loading ? (
          <div className="space-y-4">
            <VideoSkeleton />
          </div>
        ) : likedVideos.length > 0 ? (
          likedVideos.map((video, index) => (
            <VideoCard key={index} video={video} variant="horizontal" />
          ))
        ) : (
          <p className="text-gray-400 text-lg mt-6">No liked videos yet.</p>
        )}
      </div>
    </div>
  );
}
