/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faImage, faVideo, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import VideoContext from "../Context/Videos/VideoContext";
import { useContext } from "react";

// Alert Component
const Alert = ({ message, onClose, type = "error" }) => {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center justify-between ${
      type === "error" ? "bg-red-800" : "bg-green-500"
    } text-white min-w-[300px] max-w-md`}>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4">
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
    </div>
  );
};

export default function Upload_Video_Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { uploadVideo } = useContext(VideoContext);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!title || !description || !thumbnail || !videoFile) {
      setError("Please fill all fields and upload both files.");
      return;
    }

    try {
      setVideoLoading(true);
      const success = await uploadVideo(title, description, thumbnail, videoFile);

      if (success) {
        navigate("/your-videos");
      } else {
        setError("Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setError("Something went wrong while uploading.");
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-6 relative bg-[#1e1e1e]">
      {error && <Alert message={error} onClose={() => setError("")} />}
      
      <h1 className="text-3xl font-semibold mb-6">Upload Video</h1>
      <div className="flex justify-center">
        <div className="bg-[#383838] p-6 rounded-xl w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-4">Video Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF9200]"
              />

              <label className="flex flex-col items-center bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer hover:bg-white/5">
                <div className="flex items-center justify-between w-full">
                  <span>Upload Thumbnail *</span>
                  <FontAwesomeIcon icon={faImage} />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                {thumbnail && (
                  <div className="mt-3 text-sm text-white w-full">
                    <p className="truncate">Selected: {thumbnail.name}</p>
                    {thumbnailPreview && (
                      <div className="mt-2">
                        <p className="text-sm mb-1">Preview:</p>
                        <img 
                          src={thumbnailPreview} 
                          alt="Thumbnail preview" 
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                )}
              </label>

              <label className="flex flex-col items-center bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer hover:bg-white/5">
                <div className="flex items-center justify-between w-full">
                  <span>Upload Video *</span>
                  <FontAwesomeIcon icon={faVideo} />
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
                {videoFile && (
                  <div className="mt-3 text-sm text-white w-full">
                    <p className="truncate">Selected: {videoFile.name}</p>
                    {videoPreview && (
                      <div className="mt-2">
                        <p className="text-sm mb-1">Preview:</p>
                        <video 
                          src={videoPreview} 
                          className="w-full h-32 object-cover rounded-md"
                          controls
                        />
                      </div>
                    )}
                  </div>
                )}
              </label>
            </div>

            {/* Right Column */}
            <div className="flex flex-col h-full justify-between">
              <textarea
                placeholder="Description *"
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF9200] mb-4"
              ></textarea>

              <button
                onClick={handleUpload}
                disabled={videoLoading}
                className="bg-[#FF9200] text-black px-6 py-2 rounded-md font-semibold hover:brightness-110 self-end cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {videoLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload <FontAwesomeIcon icon={faUpload} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Uploading Modal */}
      {videoLoading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] p-6 rounded-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9200] mb-4"></div>
            <p className="text-white text-lg">Uploading your video, please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
}