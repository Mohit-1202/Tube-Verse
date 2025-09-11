import { useContext } from "react";
import UserContext from "../Context/User/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faVideo, faHeart, faEye, faComment, faCalendar } from "@fortawesome/free-solid-svg-icons";

export default function Your_Channel_Page() {
  const { user, userDetails } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    userDetails();
  }, []);

  const handleEditAccount = () => {
    navigate("/edit-account");
  };

  const handleManageVideos = () => {
    navigate("/manage-videos");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white">
      {/* Cover Image Section */}
      <div className="relative w-full h-60 bg-gradient-to-r from-[#2c2c2c] to-[#3c3c3c]">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#2c2c2c] to-[#3c3c3c]">
            <div className="text-center text-gray-400">
              <p className="text-lg">No cover image set</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-16">
          <div className="relative">
            <img
              src={user.avatar || "https://newkgfindia.com/assets/users2.avif"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#1c1c1c]"
            />
          </div>
          
          <div className="flex flex-col justify-center text-center sm:text-left">
            <h3 className="text-3xl font-bold sm:mt-13">{user.fullName || "No Name"}</h3>
            <p className="text-lg text-gray-300 mt-1">@{user.username || "username"}</p>
            <p className="text-lg text-gray-300 mb-3 mt-1">@{user.email || "username"}</p>
            
            <div className="flex gap-3 justify-center sm:justify-start">
              <button 
                className="bg-[#FF9200] font-semibold cursor-pointer hover:brightness-110 px-4 py-2 rounded text-black transition-all"
                onClick={handleEditAccount}
              >
                Edit Profile
              </button>
              <button 
                className="bg-[#383838] font-semibold cursor-pointer hover:bg-[#484848] px-4 py-2 rounded text-white transition-all"
                onClick={handleManageVideos}
              >
                Manage Videos
              </button>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        {/* Dashboard Section */}
        <h2 className="text-2xl font-bold mb-6">Channel Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { icon: faUsers, label: 'Total Subscribers', value: '286,234' },
            { icon: faVideo, label: 'Total Videos', value: '8' },
            { icon: faHeart, label: 'Total Liked Videos', value: '266' },
            { icon: faEye, label: 'Total Views', value: '452,142' },
            { icon: faComment, label: 'Total Tweets', value: '820' },
            { icon: faHeart, label: 'Liked Tweets', value: '62' },
            { icon: faComment, label: 'Total Comments', value: '12' },
            { icon: faHeart, label: 'Liked Comments', value: '62' },
            { icon: faCalendar, label: 'Joined On', value: formatDate(user.createdAt) },
          ].map((item, index) => (
            <div key={index} className="bg-[#2c2c2c] p-4 rounded-lg hover:bg-[#333] transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#FF9200] p-2 rounded-full">
                  <FontAwesomeIcon icon={item.icon} className="text-black text-sm" />
                </div>
                <p className="text-lg font-semibold">{item.value}</p>
              </div>
              <p className="text-sm text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}