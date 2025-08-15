const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const Login = async (username, email, password) => {
  const url = new URL(`${backendUrl}/users/login`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Login error:", data);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Login request failed:", error);
    return null;
  }
};

export const Register = async(fullName,username,email,password,coverImage,avatar)=>{
const url = new URL(`${backendUrl}/users/register`);
const formData = new FormData();
  formData.append('username', username);
  formData.append('fullName', fullName);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('avatar', avatar);
  formData.append('coverImage', coverImage);
  try {
    const response = await fetch(url,{
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: formData,
    })
    const data = await response.json()
    if(!response.ok){
      console.log("Register failed",data)
      return null
    }
    return data
  } catch (error) {
    console.error("Register failed",error)
  }
}