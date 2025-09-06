import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { faBars, faCirclePlay, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import Sidebar from '../Sidebar/Sidebar'
import { Link } from "react-router";
import UserContext from "../../Context/User/UserContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const toggleSidebar = () => setIsOpen(!isOpen);
  const {user, userDetails} = useContext(UserContext)
  
  useEffect(() => {
    userDetails()
  }, [])
  
  return (
    <div className={`Navbar flex start:p-2 start:mt-2 justify-between items-center`}>
      <div className="Section-1 start:flex start:space-x-4 mini:space-x-6 items-center">
        <div className={`hamburger start:mt-[5px] mobile:flex`}>
          <FontAwesomeIcon className="text-white start:text-[20px] mini:text-[25px] cursor-pointer " icon={faBars} onClick={toggleSidebar} />
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        </div>
        <Link to="/">
          <div className={`logo flex items-center start:-mt-[2px] start:space-x-[2px] ${isSearchOpen ? "hidden" : ""} mobilelg:flex`}>
            <FontAwesomeIcon className="start:text-[25px] mini:text-[30px] text-[#FF9200]" icon={faCirclePlay} />
            <h1 className={`text-white start:-mt-[2px] start:text-[25px] mini:text-[30px]`}>TubeVerse</h1>
          </div>
        </Link>
      </div>
      <div className="flex space-x-2 tab:space-x-[50px] mini:justify-between -mt-[2px] items-center">
        <div className="Section-2">
          <div className={`SearchIcon bg-[#FF9200] rounded-full w-7 h-7 flex items-center justify-center tab:hidden ${isSearchOpen ? "hidden" : ""}`}>
            <FontAwesomeIcon className="text-[15px] text-[#030303] cursor-pointer" onClick={() => setIsSearchOpen(!isSearchOpen)} icon={faMagnifyingGlass} />
          </div>
          {isSearchOpen && (
            <>
              <div className="-ml-[300px]">
                <div className="relative start:ml-[60px] start:w-[80%] mobile:w-[90%] mobile:ml-[25px] mobilelg:ml-[]">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-[35px] bg-[#383838] pl-2 border border-gray-300 rounded-md focus:outline-none text-white pr-10"
                  />
                  <FontAwesomeIcon
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 text-gray-300 cursor-pointer"
                    icon={faMagnifyingGlass}
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                  />
                </div>
              </div>
            </>
          )}
          <div className="SearchBar hidden tab:flex justify-between border-[1px] border-gray-400 border-r-0 w-[320px] mini:w-[400px] mt-[5px] rounded-[5px] h-[30px] mini:h-[35px] mini:mr-[25px]">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 w-[320px] mini:w-[400px] text-white bg-transparent"
            />
            <div className="bg-[#3D3D3D] w-8 text-center border-[1px] border-gray-400 rounded-[5px] flex items-center justify-center">
              <FontAwesomeIcon className="text-[13px] text-gray-300 cursor-pointer" icon={faMagnifyingGlass} />
            </div>
          </div>
        </div>
        <div className="Section-3 flex space-x-[6px] tab:space-x-[20px] items-center">
          <div className="relative">
           
            <div 
              className="create bg-[#FF9200] rounded-full w-7 h-7 flex items-center justify-center tab:hidden cursor-pointer"
              onClick={() => setIsCreateOpen(!isCreateOpen)}
            >
              <FontAwesomeIcon className="text-[16px] text-[#030303]" icon={faPlus} />
            </div>

            <div 
              className="hidden tab:flex bg-[#FF9200] rounded-md px-3 py-2 cursor-pointer items-center space-x-1"
              onClick={() => setIsCreateOpen(!isCreateOpen)}
            >
              <span className="font-semibold text-[16px] text-[#030303]">Create</span>
              <FontAwesomeIcon className="text-[16px] text-[#030303]" icon={faPlus} />
            </div>
            
            {isCreateOpen && (
              <div className="createMenu absolute right-0 top-full mt-2 z-50">
                <ul className="bg-[#383838] border-[1px] p-2 border-gray-800 rounded-md text-white">
                  <Link to="/upload-video">
                    <li className="text-[13px] py-2 px-2 hover:bg-[#484848] rounded-md cursor-pointer whitespace-nowrap">
                      Upload Video
                    </li>
                  </Link>
                  <Link to="/upload-tweet">
                    <li className="text-[13px] py-2 px-2 hover:bg-[#484848] rounded-md cursor-pointer whitespace-nowrap">
                      Upload Tweet
                    </li>
                  </Link>
                </ul>
              </div>
            )}
          </div>
          <div className="profile-pic">
            <Link to="/profile">
              <img 
                className="w-8 h-8 mini:w-10 mini:h-10 rounded-full object-cover border-2 border-[#3D3D3D]" 
                src={user?.avatar || "https://newkgfindia.com/assets/users2.avif"} 
                alt="Profile" 
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}