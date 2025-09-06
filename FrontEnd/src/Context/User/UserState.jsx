import { ChangePassword, GetUserChannel, Login, Logout, Register as registerService, UpdateAccount, UpdateAvatar, UpdateCoverImage, UserDetails, WatchHistory } from "../../Services/UserService";
import UserContext from "./UserContext";
import { useState, useContext } from "react";
import LoaderContext from "../Loader/LoaderContext";

// eslint-disable-next-line react/prop-types
const UserState = ({ children }) => {
  const [user, setUser] = useState(null);
  const [watchHistoryState, setWatchHistoryState] = useState(null)

  const { startLoading, stopLoading } = useContext(LoaderContext);

  const registerUser = async (username, fullName, email, password, avatar, coverImage) => {
    try {
      startLoading();
      const response = await registerService(username, fullName, email, password, avatar, coverImage);
      console.log(response);
      if (response.success === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Register Failed", error);
      return false;
    } finally {
      stopLoading();
    }
  };

const loginUser = async (username, email, password) => {
  try {
    startLoading();

    setUser(null);
    localStorage.removeItem("token");

    const response = await Login(username, email, password);


    if (response && response.data && response.data.accessToken) {
      setUser(response.data.user);
      localStorage.setItem("token", response.data.accessToken);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  } finally {
    stopLoading();
  }
};


 const logoutUser = async () => {
  try {
    startLoading();
    const response = await Logout();
    if (!response.success) {   // fixed logic
      console.log("Faced some issue in logging out user in user state");
      return false;
    } else {
      setUser(null);
      return true;
    }
  } catch (error) {
    console.log("Caught an error in managing logout user state", error);
    return false;
  } finally {
    stopLoading();
  }
};


  const refreshToken = async () => {
  };

  const changePassword = async (oldPassword, newPassword)=>{
    try {
      startLoading()
      const response = await ChangePassword(oldPassword,newPassword)
      if(response.success !== true){
        console.log("Failed to change password in user state")
        return false
      }
      else{
        return response
      }
    } catch (error) {
      console.log("Caught an error in changing password in user state",error)
      return false
    } finally{
      stopLoading()
    }
  }

  const userDetails = async()=>{
    try {
      startLoading()
      const response = await UserDetails()
      if(response.success !== true){
        console.log("Failed to fetch user details in user state")
        return false
      }
      else{
        setUser(response.data)
        return true
      }
    } catch (error) {
      console.log("Caught an error in fetching user details in user state", error)
    }
    finally{
      stopLoading()
    }
  }

  const updateAccount = async(fullName,email,username)=>{
    try {
      startLoading()
      const response = await UpdateAccount(fullName,email,username)
      if(response.success !== true){
        console.log("Failed to update user account in user state")
        return false
      }
      else{
        setUser(response.data)
        return true
      }

    } catch (error) {
      console.log("Caught an error in updating user account in user state",error)
      return false
    }
    finally{
      stopLoading()
    }
  }

  const updateAvatar = async (avatar) => {
    try {
      startLoading()
      const response = await UpdateAvatar(avatar)
      if(response.success !== true){
        console.log("Failed to update user avatar in user state")
        return false
      }
      else{
        setUser((prev) => ({ ...prev, avatar: response.data.avatar }))
        return true
      }
    } catch (error) {
      console.log("Caught an error in updating user avatar in user state", error)
      return false
    }finally{
      stopLoading()
    }
  }

  const updateCoverImage = async (coverImage) => {
    try {
      startLoading()
      const response = await UpdateCoverImage(coverImage)
      if(response.success !== true){
        console.log("Failed to update Cover Image in user state")
        return false
      }
      else{
        setUser((prev) => ({ ...prev, coverImage: response.data.coverImage }))
        return true
      }
    } catch (error) {
      console.log("Caught an error in updating cover image in user state",error)
    }
    finally{
      stopLoading()
    }
  }

  const getUserChannel = async (username) => {
    try {
      startLoading()
      const response = await GetUserChannel(username)
      if(response.success !== true){
        console.log("Failed to fetch user channel in user state")
        return false
      }
      else{
        setUser(response.data)
        return true
      }
    } catch (error) {
      console.log("Caught an error in getting user channel in user state",error)
    }finally{
      stopLoading()
    }
  }  

  const watchHistory = async () => {
    try {
      startLoading()
      const response = await WatchHistory()
      if(response.success !== true){
        console.log("Failed to fetch watch history in user state")
        return false
      }
      else{
        setWatchHistoryState(response.data)
        return true
      }
    } catch (error) {
      console.log("Caught an error in fetching watch history in user state",error)
      return false
    }
    finally{
      stopLoading()
    }
  }
  return (
    <UserContext.Provider value={{ loginUser, user, registerUser, logoutUser, refreshToken,changePassword,userDetails,updateAccount,updateAvatar,updateCoverImage,getUserChannel,watchHistory, watchHistoryState }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
