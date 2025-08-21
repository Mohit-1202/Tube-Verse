import { Login as loginService, Logout, Register as registerService } from "../../Services/UserService";
import UserContext from "./UserContext";
import { useState, useContext } from "react";
import LoaderContext from "../Loader/LoaderContext";   // ⬅️ import LoaderContext

// eslint-disable-next-line react/prop-types
const UserState = ({ children }) => {
  const [user, setUser] = useState(null);

  // ⬅️ get loader functions
  const { startLoading, stopLoading } = useContext(LoaderContext);

  const registerUser = async (username, fullName, email, password, avatar, coverImage) => {
    try {
      startLoading();   // start loader
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
      const response = await loginService(username, email, password);
      console.log(response);

      if (response?.data?.accessToken) {
        setUser(response.data.user);
        localStorage.setItem("token", response.data.accessToken); // if you keep token in localStorage
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
      if (!response.success === true) {
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

  return (
    <UserContext.Provider value={{ loginUser, user, registerUser, logoutUser, refreshToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
