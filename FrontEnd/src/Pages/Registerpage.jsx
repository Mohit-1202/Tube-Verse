import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e1e] px-4">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <FontAwesomeIcon
          className="text-[30px] mini:text-[54px] text-[#FF9200]"
          icon={faCirclePlay}
        />
        <h1 className="text-white text-[30px] mini:text-[54px] ml-2 font-serif">
          Tube<span className="text-gray-300">Verse</span>
        </h1>
      </div>

      {/* Form Card */}
      <div className="bg-[#2b2b2b] rounded-xl p-8 w-full max-w-2xl text-center shadow-lg">
        <h2 className="text-white text-2xl font-semibold mb-6">
          👉🏼Create a new account here!
        </h2>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200]"
          />
          <input
            type="text"
            placeholder="Enter a username"
            className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200]"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200]"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200]"
          />

          {/* Upload Avatar */}
          <label className="w-full flex items-center gap-2 bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer hover:bg-white/10">
            <FontAwesomeIcon icon={faCloudArrowUp} />
            <span>Upload Avatar</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>

          {/* Upload Cover */}
          <label className="w-full flex items-center gap-2 bg-transparent border border-white/50 rounded-md p-3 text-gray-300 cursor-pointer hover:bg-white/10">
            <FontAwesomeIcon icon={faCloudArrowUp} />
            <span>Upload Cover image</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </form>

        {/* Register Button */}
        <button className="bg-[#FF9200] cursor-pointer text-black px-6 py-2 rounded-md font-semibold hover:brightness-110 mt-6">
          Register now
        </button>

        {/* Login Link */}
        <Link to="/login">
        <p className=" mt-4 text-sm text-white hover:text-gray-200 hover:font-semibold ">
         Already have an account <span className="text-yellow-400">❓</span> Click here to Login{" "}
        </p>
          </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
