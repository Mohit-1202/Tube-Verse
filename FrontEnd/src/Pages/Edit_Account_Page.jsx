/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleXmark, faUser, faImage, faPen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import UserContext from "../Context/User/UserContext";

const Alert = ({ message, onClose, type = "error" }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  
  return (
    message ? (
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
    ) : null
  );
};

const Edit_Account_Page = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingField, setEditingField] = useState(null);
  
  const fullNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  const navigate = useNavigate();
  const { user, updateAccount, updateAvatar, updateCoverImage } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (editingField === 'fullName' && fullNameRef.current) {
      fullNameRef.current.focus();
    } else if (editingField === 'username' && usernameRef.current) {
      usernameRef.current.focus();
    } else if (editingField === 'email' && emailRef.current) {
      emailRef.current.focus();
    }
  }, [editingField]);

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

  const handleUpdate = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      let updateSuccess = true;
      let errorMessage = "";
      
      // Update account details if any field has changed
      if (fullName !== user.fullName || email !== user.email || username !== user.username) {
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
        setSuccess("Account updated successfully!");
        setEditingField(null);
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
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

  const handleFieldUpdate = (field, value) => {
    if (field === 'fullName') setFullName(value);
    if (field === 'username') setUsername(value);
    if (field === 'email') setEmail(value);
    setEditingField(null);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] px-4 py-8">
      {error && <Alert message={error} onClose={() => setError("")} type="error" />}
      {success && <Alert message={success} onClose={() => setSuccess("")} type="success" />}
      
      <div className="flex flex-col items-center justify-center">
        {/* Profile Preview Section */}
        <div className="bg-[#2b2b2b] rounded-xl p-6 w-full max-w-4xl mb-6 shadow-lg">
          <h2 className="text-white text-xl font-semibold mb-4">Your Profile</h2>
          
          {/* Cover Image Preview with Edit Button */}
          <div className="mb-6 relative">
            <h3 className="text-gray-400 text-sm mb-2">Cover Image</h3>
            <div className="w-full h-40 rounded-md overflow-hidden bg-[#383838] flex items-center justify-center">
              {user?.coverImage ? (
                <img 
                  src={user.coverImage} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              ) : coverImagePreview ? (
                <img 
                  src={coverImagePreview} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                  <FontAwesomeIcon icon={faImage} className="text-3xl mb-2" />
                  <p>No cover image</p>
                </div>
              )}
            </div>
            <label className="absolute bottom-2 right-2 bg-[#FF9200] text-[#030303] text-xs p-2 rounded-[50%] cursor-pointer hover:brightness-110">
              <FontAwesomeIcon icon={faPen} />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleCoverImageChange} 
                className="hidden" 
              />
            </label>
            {coverImage && (
              <div className="mt-2 text-sm text-white">
                <p>New cover image selected: {coverImage.name}</p>
              </div>
            )}
          </div>
          
          {/* Avatar and Details Preview */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <h3 className="text-gray-400 text-sm mb-2">Profile Picture</h3>
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#383838] flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500">
                    <FontAwesomeIcon icon={faUser} className="text-3xl" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#FF9200] text-black p-2 rounded-[50%] cursor-pointer hover:brightness-110 text-xs">
                <FontAwesomeIcon icon={faPen} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </label>
              {avatar && (
                <div className="mt-2 text-sm text-white">
                  <p>New avatar selected: {avatar.name}</p>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              {/* Full Name Field */}
              <div className="relative">
                <h3 className="text-gray-400 text-sm mb-2">Full Name</h3>
                {editingField === 'fullName' ? (
                  <div className="flex items-center gap-2">
                    <input
                      ref={fullNameRef}
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => handleFieldUpdate('fullName', fullName)}
                      onKeyPress={(e) => e.key === 'Enter' && handleFieldUpdate('fullName', fullName)}
                      className="w-full bg-transparent border border-[#FF9200] rounded-md p-2 text-white focus:outline-none"
                    />
                    <button 
                      onClick={() => handleFieldUpdate('fullName', fullName)}
                      className="bg-[#FF9200] text-[#030303] p-2 rounded-md hover:brightness-110"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <p className="text-white text-lg font-medium">
                      {fullName || "No name set"}
                    </p>
                    <button 
                      onClick={() => setEditingField('fullName')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF9200] text-sm p-1"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Username Field */}
              <div className="relative">
                <h3 className="text-gray-400 text-sm mb-2">Username</h3>
                {editingField === 'username' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">@</span>
                    <input
                      ref={usernameRef}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={() => handleFieldUpdate('username', username)}
                      onKeyPress={(e) => e.key === 'Enter' && handleFieldUpdate('username', username)}
                      className="w-full bg-transparent border border-[#FF9200] rounded-md p-2 text-white focus:outline-none"
                    />
                    <button 
                      onClick={() => handleFieldUpdate('username', username)}
                      className="bg-[#FF9200] text-[#030303] p-2 rounded-md hover:brightness-110"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <p className="text-gray-400">@{username || "username"}</p>
                    <button 
                      onClick={() => setEditingField('username')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF9200] p-1 text-sm"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Email Field */}
              <div className="relative">
                <h3 className="text-gray-400 text-sm mb-2">Email</h3>
                {editingField === 'email' ? (
                  <div className="flex items-center gap-2">
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleFieldUpdate('email', email)}
                      onKeyPress={(e) => e.key === 'Enter' && handleFieldUpdate('email', email)}
                      className="w-full bg-transparent border border-[#FF9200] rounded-md p-2 text-white focus:outline-none"
                    />
                    <button 
                      onClick={() => handleFieldUpdate('email', email)}
                      className="bg-[#FF9200] text-black p-2 rounded-md hover:brightness-110"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <p className="text-gray-400">{email || "No email set"}</p>
                    <button 
                      onClick={() => setEditingField('email')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF9200]  text-sm p-1"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-[#2b2b2b] rounded-xl p-6 w-full max-w-4xl text-center shadow-lg">
          <button 
            onClick={handleUpdate} 
            disabled={isLoading}
            className="bg-[#FF9200] text-black px-6 py-3 rounded-md font-semibold hover:brightness-110 flex items-center justify-center gap-2 w-full disabled:opacity-70 cursor-pointer transition-all"
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save All Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit_Account_Page;