/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../Context/User/UserContext";

const Alert = ({ message, onClose, type = "error" }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
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
  );
};

const Loginpage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const isEmail = usernameOrEmail.includes("@");
      const username = isEmail ? "" : usernameOrEmail;
      const email = isEmail ? usernameOrEmail : "";

      const success = await loginUser(username, email, password);

      if (success === true) {
        navigate("/");
      } else {
        setError("Incorrect username or password. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e1e] p-4">
      {error && <Alert message={error} onClose={() => setError("")} />}
      
      {/* Container */}
      <div className="flex items-center justify-center mb-6">
        <FontAwesomeIcon className="text-[30px] mini:text-[54px] text-[#FF9200]" icon={faCirclePlay} />
        <h1 className="text-white text-[30px] mini:text-[54px] ml-2">Welcome To TubeVerse</h1>
      </div>

      <div className="bg-[#2b2b2b] rounded-xl p-8 w-full max-w-md text-center shadow-lg">
        {/* Title */}
        <h2 className="text-white text-2xl font-semibold mb-6">
          Login to continue
        </h2>

        {/* Input Fields */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username or Email *"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200] focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200] focus:outline-none"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="bg-[#FF9200] text-black px-6 py-2 rounded-md font-semibold hover:brightness-110 self-end cursor-pointer mt-6"
        >
          Login Now
        </button>

        {/* Register Text */}
        <Link to="/register">
          <p className="mt-4 text-sm text-white hover:text-gray-200 hover:font-semibold">
            Want to create an account <span className="text-yellow-400">❓</span> Click here to Register
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Loginpage;