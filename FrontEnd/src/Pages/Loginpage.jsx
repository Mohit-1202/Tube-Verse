import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

const Loginpage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {/* Container */}
            <div className="flex items-center justify-center mb-6 ">
                <FontAwesomeIcon className="start:text-[20px] mobile-s:text-[30px] mini:text-[54px] text-[#FF9200]" icon={faCirclePlay} />
                <h1 className={`text-white start:-mt-[2px] mobile-s:text-[30px] start:text-[20px] mini:text-[54px] ml-2`}>Welcome To TubeVerse</h1>
            </div>

            <div className="bg-[#2b2b2b] rounded-xl p-8 w-full max-w-md text-center shadow-lg">
                {/* Logo */}
                {/* Title */}
                <h2 className="text-white text-2xl font-semibold mb-6">
                    Login to continue
                </h2>

                {/* Input Fields */}
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username or Email"
                        className=" w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200]"
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        className=" w-full bg-transparent border border-white/50 rounded-md p-3 text-white placeholder-gray-300 focus:ring-[#FF9200]"
                    />
                </div>

                {/* Login Button */}
                <Link to="/">
                    <button className="bg-[#FF9200] text-black px-6 py-2 rounded-md font-semibold hover:brightness-110 self-end cursor-pointer mt-6">
                        Login Now
                    </button>
                </Link>
                {/* Register Text */}
                <Link to="/register">
                    <p className=" mt-4 text-sm text-white hover:text-gray-200 hover:font-semibold ">
                        Want to create an account <span className="text-yellow-400">❓</span> Click here to Register{" "}
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default Loginpage;
