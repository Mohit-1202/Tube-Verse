import customFetch from "../Utils/customFetch";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const Register = async (fullName, username, email, password, coverImage, avatar) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("avatar", avatar);
  formData.append("coverImage", coverImage);

  const { success, data } = await customFetch(`${backendUrl}/users/register`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return success ? data : false;
};

export const Login = async (username, email, password) => {
  const { success, data } = await customFetch(`${backendUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
    credentials: "include",
  });

  return success ? data : false;
};

export const Logout = async () => {
  const { success, data } = await customFetch(`${backendUrl}/users/logout`, {
    method: "POST",
    credentials: "include",
  });

  return success && data?.success === true ? data : false;
};

export const RefreshToken = async () => {
  const { success, data } = await customFetch(`${backendUrl}/users/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  return success ? data : false;
};

export const ChangePassword = async (oldPassword, newPassword) => {
  const { success, data } = await customFetch(`${backendUrl}/users/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  return success && data?.success === true ? data : false;
};

export const UserDetails = async () => {
  const { success, data } = await customFetch(`${backendUrl}/users/current-user`, {
    method: "GET",
    credentials: "include",
  });

  return success && data?.success === true ? data : false;
};

export const UpdateAccount = async (fullName, email, username) => {
  const { success, data } = await customFetch(`${backendUrl}/users/update-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ fullName, email, username }),
  });

  return success && data?.success === true ? data : false;
};

export const UpdateAvatar = async (avatar) => {
  const formData = new FormData();
  formData.append("avatar", avatar);

  const { success, data } = await customFetch(`${backendUrl}/users/update-avatar`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  return success && data?.success === true ? data : false;
};

export const UpdateCoverImage = async (coverImage) => {
  const formData = new FormData();
  formData.append("coverImage", coverImage);

  const { success, data } = await customFetch(`${backendUrl}/users/update-coverImage`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  return success && data?.success === true ? data : false;
};

export const GetUserChannel = async (username) => {
  const { success, data } = await customFetch(`${backendUrl}/users/c/${username}`, {
    method: "GET",
    credentials: "include",
  });

  return success ? data : false;
};

export const WatchHistory = async () => {
  const { success, data } = await customFetch(`${backendUrl}/users/history`, {
    method: "GET",
    credentials: "include",
  });

  return success && data?.success === true ? data : false;
};
