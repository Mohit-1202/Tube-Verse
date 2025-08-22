import { useContext } from "react";
import UserContext from "../Context/User/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Your_Channel_Page() {
  const {user,userDetails} = useContext(UserContext)
      const navigate = useNavigate();

  useEffect(()=>{
    userDetails()
  },[])

  const handleEditAccount=()=>{
     navigate("/edit-account")
  }
  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white px-4 py-6">
      {/* Header */}
      <h2 className="text-[30px] font-semibold mb-6">Your Channel</h2>

      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 laptop:ml-10">
        <img
          src={user.avatar||"https://newkgfindia.com/assets/users2.avif"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover"
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-3xl FullName">{user.fullName}</h3>
          <p className="text-[18px] text-gray-300 mb-3 mt-1 userName">{user.username}</p>
          <div className="flex gap-2">
            <button className="bg-[#FF9200] font-semibold text-[16px] cursor-pointer hover:bg-[#FF9200] px-3 py-1 text-sm rounded text-[#030303]" onClick={handleEditAccount}>Edit Account</button>
            <button className="bg-[#FF9200] font-semibold text-[16px] cursor-pointer hover:bg-[#FF9200] px-3 py-1 text-sm rounded text-[#030303]">Manage Videos</button>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-600" />

      {/* Dashboard Section */}
      <h2 className="text-[30px] font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 laptop:ml-10">
        {[
          ['Total Subscribers', '286234'],
          ['Total Videos', '8'],
          ['Total Liked Videos', '266'],
          ['Total Views', '452142'],
          ['Total Tweets', '820'],
          ['Total Liked Tweets', '62'],
          ['Total Comments', '12'],
          ['Liked Comments', '62'],
          ['Joined On', '12-05-2002'],
        ].map(([label, value]) => (
          <div key={label} className="bg-[#2c2c2c] p-4 rounded text-center">
            <p className="text-lg text-gray-300">{label}</p>
            <p className="font-semibold text-md mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}