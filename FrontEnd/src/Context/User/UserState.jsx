import { Login as loginService,Register as registerService } from "../../Services/UserService";
import UserContext from "./UserContext";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const UserState = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = async (username, email, password) => {
  try {
    const response = await loginService(username, email, password);
    console.log(response); 

    if (response?.data?.accessToken) {
      setUser(response.data.user);
      localStorage.setItem("token", response.data.accessToken);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};
  const registerUser = async (username,fullName,email,password,avatar,coverImage)=>{
      try {
        const response = await registerService(username,fullName,email,password,avatar,coverImage)
        console.log(response)
        if(response.success===true){
          return true
        }
        else{
          return false}
      } catch (error) {
        console.log("Register Failed", error)
        return false
      }
  }

  return (
    <UserContext.Provider value={{ loginUser, user,registerUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
