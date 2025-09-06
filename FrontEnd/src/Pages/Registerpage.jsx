/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCloudArrowUp, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext,useEffect } from "react";
import UserContext from "../Context/User/UserContext";

// Alert Component for displaying errors
const Alert = ({ message, onClose, type = "error" }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
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

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { registerUser } = useContext(UserContext);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async () => {
    try {
      // Validation
      if (!fullName || !username || !email || !password || !avatar) {
        setError("Please fill all required fields (marked with *)");
        return;
      }

      const response = await registerUser(fullName, username, email, password, coverImage, avatar);
      
      if (response === true) {
        navigate("/login");
      } else {
        setError("Failed to register user");
      }
    } catch (error) {
      console.error("Failed to Register user", error);
      setError(error.message || "Failed to register user");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e1e] px-4">
      {error && <Alert message={error} onClose={() => setError("")} />}
      
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <FontAwesomeIcon className="text-[30px] mini:text-[54px] text-[#FF9200]" icon={faCirclePlay} />
        <h1 className="text-white text-[30px] mini:text-[54px] ml-2">Welcome To TubeVerse</h1>
      </div>

      {/* Form Card */}
      <div className="bg-[#2b2b2b] rounded-xl p-8 w-full max-w-2xl text-center shadow-lg">
        <h2 className="text-white text-2xl font-semibold mb-6">
          👉🏼Create a new account here!
        </h2>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div>
            <input
              type="text"
              placeholder="Enter your name *"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200] focus:outline-none"
            />
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Enter a username *"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200] focus:outline-none"
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200] focus:outline-none"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200] focus:outline-none"
            />
          </div>

          {/* Upload Avatar */}
          <div>
            <label className="w-full flex flex-col items-center gap-2 bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer hover:bg-white/10">
              <FontAwesomeIcon icon={faCloudArrowUp} />
              <span>Upload Avatar *</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
              />
            </label>
            {avatar && (
              <div className="mt-2 text-sm text-white">
                <p>Selected: {avatar.name}</p>
                {avatarPreview && (
                  <div className="mt-2">
                    <p className="text-sm mb-1">Preview:</p>
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="w-16 h-16 rounded-full object-cover mx-auto"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upload Cover */}
          <div>
            <label className="w-full flex flex-col items-center gap-2 bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer hover:bg-white/10">
              <FontAwesomeIcon icon={faCloudArrowUp} />
              <span>Upload Cover image</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleCoverImageChange} 
                className="hidden" 
              />
            </label>
            {coverImage && (
              <div className="mt-2 text-sm text-white">
                <p>Selected: {coverImage.name}</p>
                {coverImagePreview && (
                  <div className="mt-2">
                    <p className="text-sm mb-1">Preview:</p>
                    <img 
                      src={coverImagePreview} 
                      alt="Cover image preview" 
                      className="w-full h-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Register Button */}
        <button onClick={handleRegister} className="bg-[#FF9200] cursor-pointer text-black px-6 py-2 rounded-md font-semibold hover:brightness-110 mt-6">
          Register now
        </button>

        {/* Login Link */}
        <Link to="/login">
          <p className="mt-4 text-sm text-white hover:text-gray-200 hover:font-semibold">
            Already have an account <span className="text-yellow-400">❓</span> Click here to Login
          </p>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;