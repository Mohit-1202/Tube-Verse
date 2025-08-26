import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faImage } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import VideoContext from "../Context/Videos/VideoContext";
import { useContext } from "react";

export default function Upload_Video_Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const navigate = useNavigate();

  const { uploadVideo } = useContext(VideoContext);

  const handleUpload = async () => {
    if (!title || !description || !thumbnail || !videoFile) {
      alert("Please fill all fields and upload both files.");
      return;
    }

    try {
      setVideoLoading(true);
      const success = await uploadVideo(title, description, thumbnail, videoFile);

      if (success) {
        navigate("/your-videos");
      } else {
        alert("Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Something went wrong while uploading.");
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-6 relative">
      <h1 className="text-3xl font-semibold mb-6">Upload Video</h1>
      <div className="flex justify-center">
        <div className="bg-[#383838] p-6 rounded-xl w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-4">Video Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:outline-none"
              />

              <label className="flex items-center justify-between bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer">
                <span>Upload Thumbnail</span>
                <FontAwesomeIcon icon={faImage} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="hidden"
                />
              </label>

              <label className="flex items-center justify-between bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer">
                <span>Upload Video</span>
                <FontAwesomeIcon icon={faImage} />
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            {/* Right Column */}
            <div className="flex flex-col h-full justify-between">
              <textarea
                placeholder="Description"
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:outline-none mb-4"
              ></textarea>

              <button
                onClick={handleUpload}
                className="bg-[#FF9200] text-black px-6 py-2 rounded-md font-semibold hover:brightness-110 self-end cursor-pointer"
              >
                Upload <FontAwesomeIcon icon={faUpload} />
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
