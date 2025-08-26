/* eslint-disable no-unused-vars */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useState, useContext } from "react";
import UserContext from "../Context/User/UserContext";

const Edit_Account_Page = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user, updateAccount, updateAvatar, updateCoverImage } = useContext(UserContext);

  const handleUpdate = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      let updateSuccess = true;
      let errorMessage = "";
      
      // Update account details
      if (fullName || email || username) {
        const details = await updateAccount(fullName, email, username);
        if (!details) {
          updateSuccess = false;
          errorMessage = "Failed to update account details";
        }
      }

      // Update avatar if provided
      if (avatar && updateSuccess) {
        const avatarResult = await updateAvatar(avatar);
        if (!avatarResult) {
          updateSuccess = false;
          errorMessage = "Failed to update avatar";
        }
      }

      // Update cover image if provided
      if (coverImage && updateSuccess) {
        const coverResult = await updateCoverImage(coverImage);
        if (!coverResult) {
          updateSuccess = false;
          errorMessage = "Failed to update cover image";
        }
      }

      if (updateSuccess) {
        navigate("/profile");
      } else {
        setError(errorMessage || "Failed to update account");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div>This page is still in progress</div>
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e1e] px-4">
      {/* Form Card */}
      <div className="bg-[#2b2b2b] rounded-xl p-8 w-full max-w-2xl text-center shadow-lg">
        <h2 className="text-white text-2xl font-semibold mb-6">
          👉🏼Edit your account here!
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <input
            type="text"
            placeholder={user?.fullName || "Full Name"}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200] focus:outline-none"
          />
          <input
            type="text"
            placeholder={user?.username || "Username"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200] focus:outline-none"
          />
          <input
            type="email"
            placeholder={user?.email || "Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Change Password (coming soon)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200] focus:outline-none"
            disabled
          />

          {/* Upload Avatar */}
          <label className="w-full flex items-center gap-2 bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer hover:bg-white/10">
            <FontAwesomeIcon icon={faCloudArrowUp} />
            <span>{avatar ? "Avatar Selected" : "Upload Avatar"}</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setAvatar(e.target.files[0])} 
              className="hidden" 
            />
          </label>

          {/* Upload Cover */}
          <label className="w-full flex items-center gap-2 bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer hover:bg-white/10">
            <FontAwesomeIcon icon={faCloudArrowUp} />
            <span>{coverImage ? "Cover Image Selected" : "Upload Cover image"}</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setCoverImage(e.target.files[0])} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Update Button */}
        <button 
          onClick={handleUpdate} 
          disabled={isLoading}
          className="bg-[#FF9200] text-black px-6 py-2 rounded-md font-semibold hover:brightness-110 mt-6 flex items-center justify-center gap-2 w-full disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Updating...
            </>
          ) : (
            "Update Account"
          )}
        </button>
      </div>
    </div>
</>

  );
};


export default Edit_Account_Page;