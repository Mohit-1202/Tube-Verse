/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import VideoContext from "../Context/Videos/VideoContext";
import LoaderContext from "../Context/Loader/LoaderContext";
import VideoSkeleton from "../Components/Skeletons/VideoSkeleton";
import Alert from "../Components/Alert/Alert";
import ConfirmModal from "../Components/ConfirmModal/ConfirmModal";

export default function Manage_Video_Page() {
  const { yourVideo, getYourVideos, updateVideo, deleteVideo, togglePublishStatus } = useContext(VideoContext);
  const { startLoading, stopLoading } = useContext(LoaderContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Edit Modal States
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const hasFetched = useRef(false);

  // ====== Fetch Videos on Mount ======
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

  // ====== Open & Close Edit Modal ======
  const openEditModal = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description,
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

  // ====== Edit Form Handlers ======
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const response = await updateVideo(
        editingVideo._id,
        editForm.title,
        editForm.description,
        thumbnailFile
      );

      if (response.success) {
        setSuccess("Video updated successfully!");
        closeEditModal();
      } else {
        setError(response.message || "Failed to update video.");
      }
    } catch (err) {
      console.error("Error updating video:", err);
      setError("Failed to update video. Please try again.");
    } finally {
      stopLoading();
    }
  };

  // ====== Delete Modal Handlers ======
  const openDeleteModal = (video) => {
    setVideoToDelete(video);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setVideoToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;

    try {
      startLoading();
      const response = await deleteVideo(videoToDelete._id);

      if (response?.success) {
        setSuccess("Video deleted successfully!");
      } else {
        setError(response?.message || "Failed to delete video.");
      }
    } catch (err) {
      console.error("Error deleting video:", err);
      setError("Failed to delete video. Please try again.");
    } finally {
      stopLoading();
      closeDeleteModal();
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      startLoading();
      const response = await togglePublishStatus(videoId);

      if (!response?.success) {
        setError("Failed to update video status");
      } else {
        setSuccess("Video status updated successfully!");
      }
    } catch (err) {
      console.error("Error toggling publish status:", err);
      setError("Failed to update video status. Please try again.");
    } finally {
      stopLoading();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-5">
        <VideoSkeleton />
      </div>
    );
  }

  return (
    <div className="p-5 max-w-6xl mx-auto">
      {/* Global Alerts */}
      {error && <Alert message={error} onClose={() => setError(null)} type="error" />}
      {success && <Alert message={success} onClose={() => setSuccess(null)} type="success" />}

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
                      <p>No thumbnail</p>
                    </div>
                  )}

                  {/* Floating Edit Button */}
                  <label className="absolute bottom-2 right-2 bg-[#FF9200] text-black text-xs p-2 rounded-full cursor-pointer hover:brightness-110">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                    ✏️
                  </label>
                </div>
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

      {/* Delete Confirmation Modal (Reusable) */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Video"
        message={`Are you sure you want to delete "${videoToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Your Videos</h1>
        <p className="text-gray-400">Edit, delete, or change the visibility of your videos</p>
      </div>

      {/* Video List */}
      {yourVideo.length > 0 ? (
        <div className="space-y-6">
          {yourVideo.map((video) => (
            <div
              key={video._id}
              className="border border-white/50 text-gray-300 rounded-xl overflow-hidden flex flex-col md:flex-row transition-transform"
            >
              {/* Thumbnail */}
              <div className="relative md:w-60 lg:w-80 h-48 md:h-40 lg:h-48 flex-shrink-0 flex items-center justify-center">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                  {formatDuration(video.duration)}
                </span>
              </div>

              {/* Video Info */}
              <div className="flex-grow p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white line-clamp-1">{video.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{video.description}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <Stat label="Views" value={video.views || 0} />
                  <Stat label="Likes" value={video.likes || 0} />
                  <Stat label="Comments" value={video.comments || 0} />
                  <Stat
                    label="Uploaded"
                    value={new Date(video.createdAt).toLocaleDateString()}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 flex flex-col justify-between md:w-48">
                <div className="mb-4">
                  <span className="text-sm text-gray-400 block mb-1">Status:</span>
                  <span
                    className={`text-sm font-medium ${
                      video.isPublished ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {video.isPublished ? "Published" : "Draft"}
                  </span>
                  <button
                    onClick={() => handleTogglePublish(video._id)}
                    className={`mt-2 w-full py-1 text-sm rounded font-medium ${
                      video.isPublished
                        ? "bg-[#383838] hover:bg-[#484848] text-white"
                        : "bg-yellow-500 hover:bg-yellow-600 text-black"
                    } transition-colors`}
                  >
                    {video.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => openEditModal(video)}
                    className="flex items-center justify-center gap-2 w-full bg-[#FF9200] cursor-pointer text-black py-2 px-3 rounded text-sm transition-colors"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => openDeleteModal(video)}
                    className="flex items-center justify-center gap-2 w-full bg-[#383838] hover:bg-[#484848] cursor-pointer text-white py-2 px-3 rounded text-sm transition-colors"
                  >
                    🗑️ Delete
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

/* Helper Components */
function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-bold text-white">{value}</span>
      <span className="text-xs text-gray-400">{label}</span>
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
