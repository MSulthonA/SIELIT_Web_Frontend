import React, { useState } from 'react';
import { HiUser, HiBars3BottomLeft, HiBars3 } from "react-icons/hi2";
import { FaCalendarCheck, FaCalendarDays, FaFileCircleCheck } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa";
import { IoPeople, IoLogOut } from "react-icons/io5";
import { MdClass } from "react-icons/md";
import { BsFillDeviceSsdFill } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AppContext } from '../../../AppContext';
import { useContext } from 'react';

const Sidebar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();
  const setToken = useContext(AppContext).token.set;

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

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
        return;
      }
    });
  }

  return (
    <div className={`flex h-screen bg-themeMilk2 text-gray-800 ${isMinimized ? 'w-14' : 'w-75'} pl-3 mt-3 transition-all duration-300 ease-in-out`}>
      <div className="flex w-full flex-col justify-center">
        <button onClick={toggleSidebar} className="p-3 rounded-xl text-left text-gray-800 hover:bg-themeMilk">
          {isMinimized ? <HiBars3BottomLeft /> : <HiBars3 />}
        </button>
        <nav className="flex-1">
          <ul>
            <Link to='/admin/dataSantri'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeMilk ${location.pathname === '/admin/dataSantri' ? 'bg-themeMilk shadow' : ''}`}>
                <a href="#" className="flex items-center text-gray-800">
                  {isMinimized ? "" : <IoPeople className="mr-2"/>}
                  {isMinimized ? <IoPeople /> : <span>Data Santri</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataAkun'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeMilk ${location.pathname === '/admin/dataAkun' ? 'bg-themeMilk shadow' : ''}`}>
                <a href="#" className="flex items-center text-gray-800">
                  {isMinimized ? "" : <HiUser className="mr-2"/>}
                  {isMinimized ? <HiUser /> : <span>Data Akun</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataRiwayatPresensi'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeMilk ${location.pathname === '/admin/dataRiwayatPresensi' ? 'bg-themeMilk shadow ' : ''}`}>
                <a href="#" className="flex items-center text-gray-800">
                  {isMinimized ? "" : <FaCalendarDays className="mr-2"/>}
                  {isMinimized ? <FaCalendarDays /> : <span>Data Riwayat Presensi</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400 " />
            <Link to='/admin/jadwalKelas'>
                <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeMilk ${location.pathname === '/admin/jadwalKelas' ? 'bg-themeMilk shadow' : ''} justify-center`}>
                  <a href="#" className="flex items-center text-gray-800">
                    {isMinimized ? "" : <MdClass className="mr-2"/>}
                    {isMinimized ? <MdClass /> : <span>Jadwal Kelas</span>}
                  </a>
              </li>
            </Link>
            <Link to='/admin/bypassPresensi'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeMilk ${location.pathname === '/admin/bypassPresensi' ? 'bg-themeMilk shadow' : ''}`}>
                <a href="#" className="flex items-center text-gray-800">
                  {isMinimized ? "" : <FaCalendarCheck className="mr-2"/>}
                  {isMinimized ? <FaCalendarCheck /> : <span>Bypass Presensi</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/rekapPresensi'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeMilk ${location.pathname === '/admin/rekapPresensi' ? 'bg-themeMilk shadow' : ''}`}>
                <a href="#" className="flex items-center text-gray-800">
                  {isMinimized ? "" : <FaCheckDouble className="mr-2"/>}
                  {isMinimized ? <FaCheckDouble /> : <span>Rekap Presensi</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataPerizinan'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeMilk ${location.pathname === '/admin/dataPerizinan' ? 'bg-themeMilk shadow' : ''}`}>
                <a href="#" className="flex items-center text-gray-800">
                  {isMinimized ? "" : <FaFileCircleCheck className="mr-2"/>}
                  {isMinimized ? <FaFileCircleCheck /> : <span>Data Perizinan</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400" />
            <Link to='/admin/perangkat'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeMilk ${location.pathname === '/admin/perangkat' ? 'bg-themeMilk shadow' : ''}`}>
                <a href="#" className="flex items-center text-gray-800">
                  {isMinimized ? "" : <BsFillDeviceSsdFill className="mr-2"/>}
                  {isMinimized ? <BsFillDeviceSsdFill /> : <span>Perangkat</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400" />
            <li className="p-3 mt-2 mb-2 rounded-xl bg-red-800 hover:bg-red-600">
              <a href="#" className="flex items-center text-white" onClick={logout}>
                {isMinimized ? "" : <IoLogOut className="mr-2"/>}
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