/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse,faFilm,faThumbsUp,faClockRotateLeft,faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import { IconDeviceTvOld } from '@tabler/icons-react';
import { Link,useLocation,useNavigate} from "react-router";
import UserContext from "../../Context/User/UserContext";
import { useContext} from "react";

export default function Sidebar({ isOpen,}) {
    const location = useLocation()
    const navigate = useNavigate()
    const {logoutUser}= useContext(UserContext)

    const handleLogout = async () => {
    const result = await logoutUser();
    if (result) {
      navigate("/login");
    } else {
      console.log("Logout failed");
    }
  };
    return (
        <>
       <div className={`top-13 left-0 h-full w-64 bg-[#212121] text-gray-300 transform transition-transform duration-300 ease-in-out fixed ${isOpen ? "translate-x-0" : "-translate-x-full"} z-10 overflow-y-auto scrollbar-hide`}>
        <div className="p-5">
            <ul>
                <Link className={`${location.pathname ==="/"?"text-white font-bold":""}`} to="/"><li className={"cursor-pointer start:mb-[40px] start:text-[16px] laptop:text-[20px]"}><FontAwesomeIcon className="mr-3" icon={faHouse}/>Home</li></Link>

                <Link className={`${location.pathname ==="/your-videos"?"text-white font-bold":""}`} to="/your-videos"><li className="cursor-pointer start:mb-[40px] start:text-[16px] laptop:text-[20px]"><FontAwesomeIcon className="mr-3" icon={faFilm}/>Your Videos</li></Link>

                <Link className={`${location.pathname ==="/your-channel"?"text-white font-bold":""}`} to="/your-channel"><li className="cursor-pointer start:mb-[40px] mr-3 start:text-[16px] laptop:text-[20px]"><IconDeviceTvOld stroke={2} className="text-[2px] w-[20px] inline -mt-1 -ml-[2px] mr-3"/>Your Channel</li></Link>

                <Link className={`${location.pathname ==="/your-playlist"?"text-white font-bold":""}`} to="/your-playlist"><li className="cursor-pointer bi bi-collection-play-fill start:mb-[40px] start:text-[16px] laptop:text-[20px]"><p className="inline ml-3">Your Playlist</p></li></Link>

                <Link className={`${location.pathname ==="/liked-videos"?"text-white font-bold":""}`} to="/liked-videos"><li className="cursor-pointer start:mb-[40px] start:text-[16px] laptop:text-[20px]"><FontAwesomeIcon className="mr-3" icon={faThumbsUp} />Liked Videos</li></Link>

                <Link className={`${location.pathname ==="/liked-tweets"?"text-white font-bold":""}`} to="/liked-tweets"><li className="cursor-pointer start:mb-[40px] start:text-[16px] laptop:text-[20px]"><FontAwesomeIcon className="mr-3" icon={faThumbsUp} />Liked Tweets</li></Link>

                <Link className={`${location.pathname ==="/watch-history"?"text-white font-bold":""}`} to="/watch-history"><li className="cursor-pointer start:mb-[40px] start:text-[16px] laptop:text-[20px]"><FontAwesomeIcon icon={faClockRotateLeft} className="mr-3" />Watch History</li></Link>

                <Link className={`${location.pathname ==="/subscriptions"?"text-white font-bold":""}`} to="/subscriptions"><li className="cursor-pointer start:mb-[40px] bi bi-collection-play-fill start:text-[16px] laptop:text-[20px]"><p className="inline ml-3">Subscriptions</p></li></Link>

                <li className="cursor-pointer start:mb-[40px] start:text-[16px] laptop:text-[20px]" onClick={handleLogout}> <FontAwesomeIcon className="mr-3" icon={faArrowRightFromBracket} />Logout</li>
            </ul>
        </div>
        </div>
        </>
    )
}
