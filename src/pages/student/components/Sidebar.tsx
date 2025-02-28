import React, { useState, useContext } from "react";
import { HiUser, HiBars3BottomLeft, HiBars3 } from "react-icons/hi2";
import { FaCalendarCheck, FaFileCircleCheck, FaCalendarDays } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa";
import { IoPeople, IoLogOut } from "react-icons/io5";
import { MdClass } from "react-icons/md";
import { BsFillDeviceSsdFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import logggo from "../../../assets/logggo.png";
import Swal from "sweetalert2";
import { AppContext } from "../../../AppContext";
// import { userContext } from '../Index';

interface SidebarProps {
  isMinimized: boolean;
  toggleSidebar: () => void;
  className?: string;
  manageClass?: boolean;
}

function useOutsideAlerter(ref, isExpanded, setIsExpanded) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref]);
}

function Sidebar({ className, manageClass }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const setToken = useContext(AppContext).token.set;
  const location = useLocation();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, isExpanded, setIsExpanded);
  console.log(manageClass);

const Sidebar: React.FC<SidebarProps> = ({ isMinimized, toggleSidebar }) => {
  // const [isMinimized, setIsMinimized] = useState(true);
  // const [transitionClass, setTransitionClass] = useState('');
  const location = useLocation();
  const setToken = useContext(AppContext).token.set;

  // const toggleSidebar = () => {
  //   setIsMinimized(!isMinimized);
  // };

  function logout() {
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
      } else if (result.isDenied) {
        return;
      }
    });
  }

  // useEffect(() => {
  //   setTransitionClass('transition-all duration-300 ease-in-out');
  //   const timer = setTimeout(() => {
  //     setTransitionClass('');
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, [isMinimized]);

  return (
    <div className={`left-0 fixed top-0 h-screen w-${isMinimized ? "16" : "80"} bg-white z-50 border-r shadow-md transition-all duration-300`}>
      <div className="flex w-full flex-col justify-between">
        <div className="flex flex-row justify-center items-center">
          <div className="flex flex-col justify-center items-start">{isMinimized ? <img src={logggo} alt="logggo PPM" className="w-24 mb-3" /> : <img src={logggo} alt="logggo PPM" className="w-28 mb-3" />}</div>
          {!isMinimized && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-base font-semibold bg-gradient-to-r from-[#13A89D] to-[#C7D021] text-transparent bg-clip-text tracking-wide drop-shadow-md">
              Sistem Smart Electronic Identification
            </p>
          )}
        </div>

        <button onClick={toggleSidebar} className="p-3  mx-2 rounded-xl flex text-left  text-gray-800 hover:bg-themeSilver">
          {isMinimized ? <HiBars3BottomLeft /> : <HiBars3 />}
        </button>
        <nav className="flex-1">
          <ul>
            <Link to="/santri/beranda">
              <li className={`p-3 mt-2 mx-2 mb-2 rounded-xl hover:bg-themeSilver ${location.pathname === "/admin/dataSantri" ? "bg-themeSilver shadow" : ""}`}>
                <a href="#" className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} text-base text-gray-800 ${location.pathname === "/admin/dataSantri" ? "text-themeTeal font-semibold" : ""}`}>
                  <IoPeople className="" />
                  {isMinimized ? null : <span className="ml-2">Beranda</span>}
                </a>
              </li>
            </Link>
            <Link to="/santri/riwayatPresensi">
              <li className={`p-3 mt-2 mx-2  mb-2 rounded-xl hover:bg-themeSilver hover:text-themeTeal ${location.pathname === "/admin/dataAkun" ? "bg-themeSilver shadow" : ""}`}>
                <a href="#" className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} text-base text-gray-800 ${location.pathname === "/admin/dataAkun" ? "text-themeTeal font-semibold" : ""}`}>
                  <HiUser className="" />
                  {isMinimized ? null : <span className="ml-2">Riwayat Presensi</span>}
                </a>
              </li>
            </Link>
            <Link to="/santri/jadwalKelas">
              <li className={`p-3 mt-2 mx-2  mb-2 rounded-xl hover:bg-themeSilver ${location.pathname === "/admin/dataRiwayatPresensi" ? "bg-themeSilver shadow" : ""}`}>
                <a href="#" className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} text-base text-gray-800 ${location.pathname === "/admin/dataRiwayatPresensi" ? "text-themeTeal font-semibold" : ""}`}>
                  <FaCalendarDays className="" />
                  {isMinimized ? null : <span className="ml-2">Jadwal Kelas</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400 " />
            <Link to="/santri/formPerizinan">
              <li className={` p-3 mt-2 mx-2  mb-2 rounded-xl hover:bg-themeSilver ${location.pathname === "/admin/jadwalKelas" ? "bg-themeSilver shadow" : ""} justify-center`}>
                <a href="#" className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} text-base text-gray-800 ${location.pathname === "/admin/jadwalKelas" ? "text-themeTeal font-semibold" : ""}`}>
                  <MdClass className="" />
                  {isMinimized ? null : <span className="ml-2">Form Perizinan</span>}
                </a>
              </li>
            </Link>
            <Link to="/santri/editProfil">
              <li className={`p-3 mt-2 mx-2  mb-2 rounded-xl hover:bg-themeSilver ${location.pathname === "/admin/bypassPresensi" ? "bg-themeSilver shadow" : ""}`}>
                <a href="#" className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} text-base text-gray-800 ${location.pathname === "/admin/bypassPresensi" ? "text-themeTeal font-semibold" : ""}`}>
                  <FaCalendarCheck className="" />
                  {isMinimized ? null : <span className="ml-2">Edit Profil</span>}
                </a>
              </li>
            </Link>
            {manageClass ? (
                <Link to="/santri/manageClass">
                    <li className={`p-3 mt-2 mx-2  mb-2 rounded-xl hover:bg-themeSilver ${location.pathname === "/admin/bypassPresensi" ? "bg-themeSilver shadow" : ""}`}>
                        <a href="#" className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} text-base text-gray-800 ${location.pathname === "/admin/bypassPresensi" ? "text-themeTeal font-semibold" : ""}`}>
                            <FaCalendarCheck className="" />
                            {isMinimized ? null : <span className="ml-2">Edit Profil</span>}
                        </a>
                    </li>
                </Link>
            ) : (
            <></>
            )}
            <hr className="border-gray-400" />
            <li className={`p-3 mt-2 mb-2 mx-2  rounded-xl hover:bg-themeSilver ${location.pathname === "/admin/logout" ? "bg-themeSilver shadow" : ""}`}>
              <a href="#" className={`flex items-center ${isMinimized ? "justify-center" : "justify-start"} text-base text-red-500 ${location.pathname === "/admin/logout" ? "text-themeTeal font-semibold" : ""}`} onClick={logout}>
                <IoLogOut className="" />
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
