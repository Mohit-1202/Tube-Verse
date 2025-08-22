// /* eslint-disable no-unused-vars */
// import { useContext, useState } from "react";
// import UserContext from "../Context/User/UserContext";

// const Edit_Account_Page = () => {
//   const {
//     user,
//     updateAccount,
//     updateAvatar,
//     updateCoverImage,
//     changePassword,
//   } = useContext(UserContext);

//   const [fullName, setFullName] = useState(user?.fullName || "");
//   const [username, setUsername] = useState(user?.username || "");
//   const [avatar, setAvatar] = useState(user?.avatar || "");
//   const [coverImage, setCoverImage] = useState(user?.coverImage || "");
//   const [passwordModal, setPasswordModal] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   const handleUpdateAccount = async () => {
//     const success = await updateAccount(fullName, null, username);
//     if (success) alert("Account updated successfully!");
//   };

//   const handleAvatarChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const success = await updateAvatar(file);
//       if (success) alert("Avatar updated!");
//     }
//   };

//   const handleCoverImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const success = await updateCoverImage(file);
//       if (success) alert("Cover image updated!");
//     }
//   };

//   const handlePasswordChange = async () => {
//     const success = await changePassword(oldPassword, newPassword);
//     if (success) {
//       alert("Password changed successfully!");
//       setPasswordModal(false);
//       setOldPassword("");
//       setNewPassword("");
//     } else {
//       alert("Failed to change password");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#1c1c1c] text-white px-4 py-6">
//       <h2 className="text-[30px] font-semibold mb-6">Edit Account</h2>

//       {/* Avatar & Cover */}
//       <div className="flex flex-col sm:flex-row gap-6">
//         <div>
//           <img
//             src={avatar || "https://newkgfindia.com/assets/users2.avif"}
//             alt="Avatar"
//             className="w-28 h-28 rounded-full object-cover mb-2"
//           />
//           <input type="file" onChange={handleAvatarChange} />
//         </div>
//         <div>
//           <img
//             src={coverImage || "https://newkgfindia.com/assets/users2.avif"}
//             alt="Cover"
//             className="w-64 h-32 object-cover mb-2"
//           />
//           <input type="file" onChange={handleCoverImageChange} />
//         </div>
//       </div>

//       {/* Account Details */}
//       <div className="mt-6 flex flex-col gap-4 w-full max-w-md">
//         <input
//             type="text"
//             placeholder={user.fullName}
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200]"
//           />

//         <input
//           type="text"
//           value={username}
//           placeholder="Username"
//           onChange={(e) => setUsername(e.target.value)}
//           className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200]"
//         />
//         <button
//           className="bg-[#FF9200] text-black font-semibold px-4 py-2 rounded"
//           onClick={handleUpdateAccount}
//         >
//           Update Account
//         </button>
//         <button
//           className="bg-[#FF9200] text-black font-semibold px-4 py-2 rounded"
//           onClick={() => setPasswordModal(true)}
//         >
//           Change Password
//         </button>
//       </div>

//       {/* Password Modal */}
//       {passwordModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/60">
//           <div className="bg-[#2c2c2c] p-6 rounded w-80 flex flex-col gap-4">
//             <h3 className="text-xl font-semibold">Change Password</h3>
//             <input
//               type="password"
//               value={oldPassword}
//               placeholder="Old Password"
//               onChange={(e) => setOldPassword(e.target.value)}
//               className="p-2 rounded text-black w-full"
//             />
//             <input
//               type="password"
//               value={newPassword}
//               placeholder="New Password"
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="p-2 rounded text-black w-full"
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 className="bg-red-500 px-3 py-1 rounded"
//                 onClick={() => setPasswordModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-green-500 px-3 py-1 rounded"
//                 onClick={handlePasswordChange}
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Edit_Account_Page;

const Edit_Account_Page = () => {
  return (
    <div>Edit_Account_Page</div>
  )
}

export default Edit_Account_Page
