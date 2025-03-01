import React, { useContext } from "react";
import { HiUser, HiBars3BottomLeft, HiBars3 } from "react-icons/hi2";
import { FaCalendarCheck } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import logggo from "../../../assets/logggo.png";
import Swal from "sweetalert2";
import { AppContext } from "../../../AppContext";

type SidebarProps = {
  isMinimized: boolean;
  manageClass?: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ isMinimized, toggleSidebar, isMobile, manageClass }) => {
  const location = useLocation();
  const setToken = useContext(AppContext).token.set;

  const logout = () => {
    Swal.fire({
      title: "Apakah anda yakin ingin logout?",
      showCancelButton: true,
      confirmButtonText: "Ya",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        setToken("");
        window.location.href = "/";
      }
    });
  };

  return (
    <div className={`fixed top-0 left-0 h-screen bg-white z-50 border-r shadow-md transition-all duration-300 ${isMinimized ? "w-16" : "w-60"} ${isMobile ? "block" : "hidden"} md:hidden`}>
      <div className="flex w-full flex-col justify-between">
        <div className="flex flex-row justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            {isMinimized ? <img src={logggo} alt="logggo PPM" className="w-24 mb-3" /> : <img src={logggo} alt="logggo PPM" className="w-28 mb-3" />}
          </div>
          {!isMinimized && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-base font-semibold bg-gradient-to-r from-[#13A89D] to-[#C7D021] text-transparent bg-clip-text tracking-wide drop-shadow-md">
              Sistem Smart Electronic Identification
            </p>
          )}
        </div>

        <button onClick={toggleSidebar} className="p-3 mx-2 rounded-xl flex text-left text-gray-800 hover:bg-themeSilver">
          {isMinimized ? <HiBars3BottomLeft className="text-2xl" /> : <HiBars3 className="text-2xl" />}
        </button>
        <nav className="flex-1">
          <ul>
            <Link to="/guru/bypassPresensi">
              <li className={`p-3 mt-2 mx-2 mb-2 rounded-xl hover:bg-themeSilver ${location.pathname === "/guru/bypassPresensi" ? "bg-themeSilver shadow" : ""}`}>
                <a href="#" className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} text-base text-gray-800 ${location.pathname === "/santri/beranda" ? "text-themeTeal font-semibold" : ""}`}>
                  <HiUser className="text-2xl" />
                  {isMinimized ? null : <span className="ml-2">Bypass Presensi</span>}
                </a>
              </li>
            </Link>
            <Link to="/guru/dataPerizinan">
              <li className={`p-3 mt-2 mx-2 mb-2 rounded-xl hover:bg-themeSilver ${location.pathname === "/guru/dataPerizinan" ? "bg-themeSilver shadow" : ""}`}>
                <a href="#" className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} text-base text-gray-800 ${location.pathname === "/guru/dataPerizinan" ? "text-themeTeal font-semibold" : ""}`}>
                  <FaCalendarCheck className="text-2xl" />
                  {isMinimized ? null : <span className="ml-2">Data Perizinan</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400" />
            <li className={`p-3 mt-2 mb-2 mx-2 rounded-xl hover:bg-themeSilver ${location.pathname === "/santri/logout" ? "bg-themeSilver shadow" : ""}`}>
              <a href="#" className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} text-base text-red-500 `} onClick={logout}>
                <IoLogOut className="text-2xl" />
                {isMinimized ? null : <span className="ml-2 text-red-500 font-semibold">Logout</span>}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
