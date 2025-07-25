import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faImage } from "@fortawesome/free-solid-svg-icons";

export default function Upload_Video_Page() {
  return (
    <div className="min-h-screen text-white p-6">
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
                className="bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:outline-none"
              />

              <label className="flex items-center justify-between bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer">
                <span>Upload Thumbnail</span>
                <FontAwesomeIcon icon={faImage} />
                <input type="file" className="hidden" />
              </label>

              <label className="flex items-center justify-between bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer">
                <span>Upload Video</span>
                <FontAwesomeIcon icon={faImage} />
                <input type="file" className="hidden" />
              </label>
            </div>

            {/* Right Column */}
            <div className="flex flex-col h-full justify-between">
              <textarea
                placeholder="Description"
                rows="6"
                className="bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:outline-none mb-4"
              ></textarea>

              <button className="bg-[#FF9200] text-black px-6 py-2 rounded-md font-semibold hover:brightness-110 self-end cursor-pointer">
                Upload <FontAwesomeIcon icon={faUpload} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
