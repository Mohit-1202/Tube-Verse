import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import VideoContext from "../Context/Videos/VideoContext";
import VideoSkeleton from "../Components/Skeletons/VideoSkeleton";
import LoaderContext from "../Context/Loader/LoaderContext";

export default function Manage_Video_Page() {
  const { yourVideo, getYourVideos, updateVideo, deleteVideo, togglePublishStatus } = useContext(VideoContext);
  const { startLoading, stopLoading } = useContext(LoaderContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      
      const fetchUserVideos = async () => {
        try {
          setLoading(true);
          setError(null);
          await getYourVideos();
        } catch (err) {
          console.error("Failed to fetch videos:", err);
          setError("Failed to load your videos. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserVideos();
    }
  }, [getYourVideos]);

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      return;
    }

    try {
      startLoading();
      const success = await deleteVideo(videoId);
      
      if (!success) {
        throw new Error("Failed to delete video");
      }
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("Failed to delete video. Please try again.");
    } finally {
      stopLoading();
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      startLoading();
      const success = await togglePublishStatus(videoId);
      
      if (!success) {
        throw new Error("Failed to update video status");
      }
    } catch (err) {
      console.error("Error toggling publish status:", err);
      alert("Failed to update video status. Please try again.");
    } finally {
      stopLoading();
    }
  };

  const openEditModal = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description
    });
    setThumbnailPreview(video.thumbnail);
    setThumbnailFile(null);
  };

  const closeEditModal = () => {
    setEditingVideo(null);
    setEditForm({ title: "", description: "" });
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      startLoading();
      const success = await updateVideo(
        editingVideo._id,
        editForm.title,
        editForm.description,
        thumbnailFile
      );
      
      if (success) {
        closeEditModal();
      } else {
        throw new Error("Failed to update video");
      }
    } catch (err) {
      console.error("Error updating video:", err);
      alert("Failed to update video. Please try again.");
    } finally {
      stopLoading();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-5">
        <VideoSkeleton/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-5">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-500 mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-6xl mx-auto">
      {/* Edit Modal */}
      {editingVideo && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-[#383838] rounded-xl w-full max-w-md p-6 relative">
      <h2 className="text-xl font-bold text-white mb-4">Edit Video</h2>

      <form onSubmit={handleEditSubmit}>
        {/* Title Field */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={editForm.title}
            onChange={handleEditFormChange}
            className="w-full border border-white/50 text-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9200]"
            required
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={editForm.description}
            onChange={handleEditFormChange}
            rows="4"
            className="w-full border border-white/50 text-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9200]"
          ></textarea>
        </div>

        {/* Thumbnail Section */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Thumbnail</label>
          <div className="relative w-full h-40 rounded-md overflow-hidden bg-[#2c2c2c] flex items-center justify-center">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-500 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 16l5-5 4 4 8-8"
                  />
                </svg>
                <p>No thumbnail</p>
              </div>
            )}

            {/* Floating Edit Button */}
            <label className="absolute bottom-2 right-2 bg-[#FF9200] text-black text-xs p-2 rounded-full cursor-pointer hover:brightness-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
          </div>

          {thumbnailFile && (
            <p className="mt-2 text-sm text-gray-300">
              New thumbnail selected: {thumbnailFile.name}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeEditModal}
            className="px-4 py-2 text-white rounded bg-[#383838] hover:bg-[#484848] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#FF9200] text-black rounded cursor-pointer transition-colors font-semibold"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Your Videos</h1>
        <p className="text-gray-400">Edit, delete, or change the visibility of your videos</p>
      </div>

      {yourVideo.length > 0 ? (
        <div className="space-y-6">
          {yourVideo.map((video) => (
            <div key={video._id} className="bg-[#2c2c2c] rounded-xl overflow-hidden flex flex-col md:flex-row transition-transform hover:-translate-y-1">
              <div className="relative md:w-60 lg:w-80 h-48 md:h-40 lg:h-48 flex-shrink-0">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                  {formatDuration(video.duration)}
                </span>
              </div>
              
              <div className="flex-grow p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white line-clamp-1">{video.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{video.description}</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-white">{video.views || 0}</span>
                    <span className="text-xs text-gray-400">Views</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-white">{video.likes || 0}</span>
                    <span className="text-xs text-gray-400">Likes</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-white">{video.comments || 0}</span>
                    <span className="text-xs text-gray-400">Comments</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-white text-xs">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-400">Uploaded</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#383838] p-4 flex flex-col justify-between md:w-48">
                <div className="mb-4">
                  <span className="text-sm text-gray-400 block mb-1">Status:</span>
                  <span className={`text-sm font-medium ${video.isPublished ? 'text-green-500' : 'text-yellow-500'}`}>
                    {video.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <button 
                    onClick={() => handleTogglePublish(video._id)}
                    className={`mt-2 w-full py-1 text-sm rounded font-medium ${
                      video.isPublished 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                    } transition-colors`}
                  >
                    {video.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => openEditModal(video)}
                    className="flex items-center justify-center gap-2 w-full bg-[#FF9200] cursor-pointer text-black py-2 px-3 rounded text-sm transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(video._id)}
                    className="flex items-center justify-center gap-2 w-full bg-[#383838] hover:bg-[#484848] cursor-pointer text-white py-2 px-3 rounded text-sm transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400 p-5">
          <div className="text-6xl mb-4 opacity-50">🎥</div>
          <h3 className="text-xl font-medium mb-2">You haven&apos;t uploaded any videos yet</h3>
          <p className="mb-6">Start sharing your content with the world</p>
          <Link 
            to="/upload-video" 
            className="bg-[#FF9200] hover:bg-orange-600 text-black font-medium px-6 py-3 rounded transition-colors"
          >
            Upload Your First Video
          </Link>
        </div>
      )}
    </div>
  );
}

function formatDuration(durationInSeconds) {
  if (!durationInSeconds || isNaN(durationInSeconds)) return "00:00";

  const totalSeconds = Math.floor(durationInSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}