const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Register = async (fullName, username, email, password, coverImage, avatar) => {
  const url = new URL(`${backendUrl}/users/register`);
  const formData = new FormData();
  formData.append('username', username);
  formData.append('fullName', fullName);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('avatar', avatar);
  formData.append('coverImage', coverImage);
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      console.log("Register failed", data);
      return false;
    }
    return data;
  } catch (error) {
    console.error("Register failed", error);
  }
};

export const Login = async (username, email, password) => {
  const url = new URL(`${backendUrl}/users/login`);

  try {

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
      credentials: "include",
    });


    const data = await response.json();

    if (!response.ok) {
      console.error("Login error:", data);
      return false;
    }

    return data;
  } catch (error) {
    console.error("Login request failed:", error);
    return false;
  }
};


export const Logout = async () => {
  const url = new URL(`${backendUrl}/users/logout`);
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      console.log("Faced an error in parsing data from response in user services");
      return false;
    }
    return data;
  } catch (error) {
    console.log("Caught an error to logout user in user service", error);
    return false;
  }
};

export const RefreshToken = async () => {
  const url = new URL(`${backendUrl}/users/refresh-token`);
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      console.log("Failed to refresh token:", data);
      return false;
    }
    return data;
  } catch (error) {
    console.log("Error refreshing token:", error);
    return false;
  }
};

export const ChangePassword = async (oldPassword, newPassword) => {
  const url = new URL(`${backendUrl}/users/change-password`);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      console.log("Faced an error in Changing password from response in user services");
      return false;
    }
    return data;
  } catch (error) {
    console.log("Caught an error in changing password in user service", error);
  }
};

export const UserDetails = async () => {
  const url = new URL(`${backendUrl}/users/current-user`);
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      console.log("Caught an error in parsing data from response in user services");
      return false;
    }
    console.log(data)
    return data;
  } catch (error) {
    console.log("Faced an error in services while trying to get user details", error);
    return false;
  }
};

export const UpdateAccount = async (fullName, email, username) => {
  const url = new URL(`${backendUrl}/users/update-account`);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ fullName, email, username }),
    });
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      console.log("Faced an error in updating account from in user services");
      return false;
    }
    return data;
  } catch (error) {
    console.log("Caught an error in updating account", error);
    return false;
  }
};

export const UpdateAvatar = async (avatar) => {
  const url = new URL(`${backendUrl}/users/update-avatar`);
  const formData = new FormData();
  formData.append("avatar", avatar);
  try {
    const response = await fetch(url, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      console.log("Failed to update user avatar in update avatar user service");
      return false;
    }
    return data;
  } catch (error) {
    console.log("Caught an error in updating user avatar in user service", error);
    return false;
  }
};

export const UpdateCoverImage = async (coverImage) => {
  const url = new URL(`${backendUrl}/users/update-coverImage`);
  const formData = new FormData();
  formData.append("coverImage", coverImage);
  try {
    const response = await fetch(url, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      console.log("Failed to update user cover image in user service");
      return false;
    }
    return data;
  } catch (error) {
    console.log("Caught an error in updating cover image inside user services", error);
    return false;
  }
};

export const GetUserChannel = async (username) => {
  const url = new URL(`${backendUrl}/users/c/${username}`);
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      console.log("Failed to get channel details in user service");
    }
    return data;
  } catch (error) {
    console.log("Caught an error in fetching channel details in user service", error);
    return false;
  }
};

export const WatchHistory = async () => {
  const url = new URL(`${backendUrl}/users/history`);
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      console.log("Failed to get user's watch History in user service");
      return false;
    }
    return data;
  } catch (error) {
    console.log("Caught an error in fetching user watch history", error);
    return false;
  }
};
