import { useContext, useState, useEffect } from 'react';
import VideoContext from '../../Context/Videos/VideoContext';

const GetVideo = () => {
  const { getVideos } = useContext(VideoContext);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await getVideos();
      setVideos(data);
    };

    fetchVideos();
  }, [getVideos]);

  return (
    <div className="flex items-center justify-center space-x-[100px]">
      {videos.length > 0 ? (
        videos.map((video) => (
          <div className="VideoFrame mt-[20px]" key={video._id}>
            <div className="thumbnail">
              <img 
                onClick={() => setSelectedVideo(video.videoFile)} 
                className="h-[200px] w-[300px] cursor-pointer" 
                src={video.thumbnail} 
                alt="Video Thumbnail" 
              />
            </div>
            {selectedVideo === video.videoFile && (
              <video width="400" controls autoPlay>
                <source src={video.videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="title">
              <p>{video.title}</p>
            </div>
            <div>
              <p>{video.description}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Loading videos...</p>
      )}
    </div>
  );
};

export default GetVideo;
