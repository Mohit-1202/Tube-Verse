import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faBars, faCirclePlay, faMagnifyingGlass, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import Sidebar from '../Sidebar/Sidebar'
import { Link } from "react-router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const toggleSidebar = () => setIsOpen(!isOpen);
  return (
    <div className={`Navbar flex start:p-2 start:mt-2 justify-between`}>
      <div className="Section-1 start:flex start:space-x-4 mini:space-x-6">
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
      <div className="flex space-x-2 tab:space-x-[50px] mini:justify-between -mt-[2px]">
        <div className="Section-2">
          <div className={`SearchIcon bg-[#FF9200] rounded-[50%] w-7 start:mt-[5px] text-center tab:hidden ${isSearchOpen ? "hidden" : ""}`}>
            <FontAwesomeIcon className="start:text-[15px] mt-[7px] pb-[4px] text-[#030303] cursor-pointer" onClick={() => setIsSearchOpen(!isSearchOpen)} icon={faMagnifyingGlass} />
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
              className=" p-2 w-[320px] mini:w-[400px] text-white"
            />
            <div className="bg-[#3D3D3D] w-8 text-center border-[1px] border-gray-400 rounded-[5px]">
              <FontAwesomeIcon className="start:text-[13px] mt-[7px] pb-[4px] text-gray-300 cursor-pointer" icon={faMagnifyingGlass} />
            </div>
          </div>
        </div>
        <div className="Section-3 flex space-x-[6px] tab:space-x-[20px]">
          <div className="create bg-[#FF9200] rounded-[50%] tab:w-[80px] tab:rounded-[8px] w-7 start:mt-[5px] text-center mini:pt-1" onClick={() => setIsCreateOpen(!isCreateOpen)}>
            <p className=" hidden tab:inline font-semibold mr-2 text-[16px]  mt-[6px] text-[#030303] cursor-pointer">Create</p>
            <FontAwesomeIcon className="start:text-[16px] mt-[6px] text-[#030303] cursor-pointer" icon={faPlus} />
            {isCreateOpen && (
              <div className="createMenu">
                <ul className="bg-[#383838] border-[1px] p-2 border-gray-800 rounded-md text-white mt-2 -ml-8 tab:-ml-2 absolute z-50">
                  <Link to="/upload-video">
                  <li className="text-[13px] mt-[2px] mb-2 cursor-pointer">Upload Video</li>
                  </Link>
                  <Link to="/upload-tweet">
                  <li className="text-[13px] cursor-pointer">Upload Tweet</li>
                  </Link>
                </ul>
              </div>
            )}
          </div>
          <div className="create bg-[#FF9200] rounded-[50%] mini:rounded-4xl w-7 start:mt-[5px] text-center tab:mr-2">
            <Link to="/profile"><FontAwesomeIcon className="start:text-[16px] mt-[6px] text-[#030303] cursor-pointer" icon={faUser} /></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
