import React, { useState } from 'react';
import { HiHome, HiUser, HiAcademicCap, HiBars3BottomLeft, HiBars3 } from "react-icons/hi2";
import { FaCalendarCheck, FaCalendarDays, FaFileCircleCheck } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa";
import { IoPeople, IoLogOut } from "react-icons/io5";
import { MdClass } from "react-icons/md";
import { BsFillDeviceSsdFill } from "react-icons/bs";
import {Link,   useLocation} from 'react-router-dom'
import Swal from 'sweetalert2'
import { AppContext } from '../../../AppContext';
import { useContext} from 'react';

const Sidebar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
    };
    const setToken = useContext(AppContext).token.set;
    // const userName = useContext(userContext).name;

    function logout() {
        Swal.fire({
            title: 'Apakan anda yakin ingin logout?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                setToken('');
                window.location.href = '/';
            } else if (result.isDenied) {
                return
            }
        });
      }


  const location = useLocation();

  return (
    <div className={`flex h-screen bg-gray-100 text-white dark:bg-gray-800 ${isMinimized ? 'w-12' : 'w-60'} shadow-sm transition-all duration-300 ease-in-out`}>
      <div className="flex w-full flex-col">
        <button onClick={toggleSidebar} className="p-4 text-left text-gray-800 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-700">
          {isMinimized ? <HiBars3BottomLeft /> : <HiBars3 />}
        </button>
        <nav className="flex-1">
          <ul>
            <Link to='/admin/dataSantri'>
              <li className="p-4 hover:bg-gray-300 dark:hover:bg-gray-700">
                <a href="#" className="flex items-center text-gray-800 dark:text-white">
                  {isMinimized ? <IoPeople /> : <span>Data Santri</span>}
                </a>
            </li>
            </Link>
            <Link to='/admin/dataAkun'>
              <li className="p-4 hover:bg-gray-300 dark:hover:bg-gray-700">
                <a href="#" className="flex items-center text-gray-800 dark:text-white">
                  {isMinimized ? <HiUser /> :<span>Data Akun</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataRiwayatPresensi'>
              <li className="p-4 hover:bg-gray-300 dark:hover:bg-gray-700">
                <a href="#" className="flex items-center text-gray-800 dark:text-white">
                  {isMinimized ?  <FaCalendarDays /> : <span>Data Riwayat Presensi</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400 dark:border-gray-700" />
            <Link to='/admin/jadwalKelas'>
              <li className="p-4 hover:bg-gray-300 dark:hover:bg-gray-700">
                <a href="#" className="flex items-center text-gray-800 dark:text-white">
                  {isMinimized ? <MdClass /> :<span>Jadwal Kelas</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/bypassPresensi'>
              <li className="p-4 hover:bg-gray-300 dark:hover:bg-gray-700">
                <a href="#" className="flex items-center text-gray-800 dark:text-white">
                  {isMinimized ? <FaCalendarCheck /> : <span>Bypass Presensi</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/rekapPresensi'>
              <li className="p-4 hover:bg-gray-300 dark:hover:bg-gray-700">
                <a href="#" className="flex items-center text-gray-800 dark:text-white">
                  {isMinimized ? <FaCheckDouble /> : <span>Rekap Presensi</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataPerizinan'>
              <li className="p-4 hover:bg-gray-300 dark:hover:bg-gray-700">
                <a href="#" className="flex items-center text-gray-800 dark:text-white">
                  {isMinimized ? <FaFileCircleCheck /> : <span>Data Perizinan</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400 dark:border-gray-700" />
            <Link to='/admin/perangkat'>
              <li className="p-4 hover:bg-gray-300 dark:hover:bg-gray-700">
                <a href="#" className="flex items-center text-gray-800 dark:text-white">
                  {isMinimized ? <BsFillDeviceSsdFill /> : <span>Perangkat</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400 dark:border-gray-700" />
            <li className="p-4 bg-red-800 hover:bg-red-600 dark:hover:bg-gray-700">
              <a href="#" className="flex items-center text-white" onClick={logout}>
                {isMinimized ? <IoLogOut /> : <span>Logout</span>}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;