/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import VideoCard from "../Components/VideoCard/VideoCard";
import VideoSkeleton from "../Components/Skeletons/VideoSkeleton";
import VideoContext from "../Context/Videos/VideoContext";
import { useContext, useEffect, useState } from "react";

export default function Your_Video_Page() {
  const { yourVideo, getYourVideos } = useContext(VideoContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserVideos = async () => {
      setLoading(true);
      await getYourVideos();
      setLoading(false);
    };
    fetchUserVideos();
  }, []);

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
          <Link to="/manage-videos">
            <button className="bg-[#FF9200] text-[#030303] font-medium px-4 py-1 rounded-md cursor-pointer">
              Manage Videos
            </button>
          </Link>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 mobile-lg:grid-cols-2 laptop:grid-cols-3 px-1 gap-4">
        {/* Loading skeletons */}
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, i) => <VideoSkeleton key={i} />)
        ) : yourVideo.length > 0 ? (
          yourVideo.map((video) => <VideoCard key={video._id} video={video} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-400 mt-10">
            <p className="text-lg">You haven&apos;t uploaded any videos yet.</p>
            <Link to="/upload-video">
              <button className="mt-4 bg-[#FF9200] text-[#030303] font-medium px-4 py-2 rounded-md">
                Upload Your First Video
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
