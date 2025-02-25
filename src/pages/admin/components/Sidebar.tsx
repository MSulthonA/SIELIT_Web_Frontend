import React, { useState, useContext } from 'react';
import { HiUser, HiBars3BottomLeft, HiBars3 } from "react-icons/hi2";
import { FaCalendarCheck, FaFileCircleCheck, FaCalendarDays } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa";
import { IoPeople, IoLogOut } from "react-icons/io5";
import { MdClass } from "react-icons/md";
import { BsFillDeviceSsdFill } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import logggo from '../../../assets/logggo.png';
import Swal from 'sweetalert2';
import { AppContext } from '../../../AppContext';
// import { userContext } from '../Index';

const Sidebar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  // const [transitionClass, setTransitionClass] = useState('');
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

  // useEffect(() => {
  //   setTransitionClass('transition-all duration-300 ease-in-out');
  //   const timer = setTimeout(() => {
  //     setTransitionClass('');
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, [isMinimized]);

  return (
    <div className={`flex pl-2 pr-3 h-screen bg-themeMilk text-gray-800 ${isMinimized ? 'w-16' : 'w-60'} shadow transition-all duration-300 ease-in-out`}>
      <div className="flex w-full flex-col justify-between">
      <div className='flex flex-col justify-center items-center'>
          {isMinimized ? <img src={logggo} alt="logggo PPM" className='w-20 mb-3' />
           : 
           <img src={logggo} alt="logggo PPM" className='w-20 mb-3' />}
        </div>
        
        <button onClick={toggleSidebar} className="p-3 rounded-xl text-left text-gray-800 hover:bg-themeTeal">
          {isMinimized ? <HiBars3BottomLeft /> : <HiBars3 />}
        </button>
        <nav className="flex-1">
          <ul>
            <Link to='/admin/dataSantri'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/dataSantri' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/dataSantri' ? 'text-white' : ''}`}>
                  <IoPeople className="mr-2"/>
                  {isMinimized ? null : <span>Data Santri</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataAkun'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal hover:text-white ${location.pathname === '/admin/dataAkun' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/dataAkun' ? 'text-white' : ''}`}>
                  <HiUser className=""/>
                  {isMinimized ? null : <span>Data Akun</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataRiwayatPresensi'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/dataRiwayatPresensi' ? 'bg-themeTeal shadow ' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/dataRiwayatPresensi' ? 'text-white' : ''}`}>
                  <FaCalendarDays className="mr-2"/>
                  {isMinimized ? null : <span>Riwayat Presensi</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400 " />
            <Link to='/admin/jadwalKelas'>
                <li className={` p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/jadwalKelas' ? 'bg-themeTeal shadow' : ''} justify-center`}>
                  <a href="#" className={`flex flex-row items-center text-base text-gray-800 ${location.pathname === '/admin/jadwalKelas' ? 'text-white' : ''}`}>
                    <MdClass className="mr-2"/>
                    {isMinimized ? null : <span>Jadwal Kelas</span>}
                  </a>
              </li>
            </Link>
            <Link to='/admin/bypassPresensi'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/bypassPresensi' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/bypassPresensi' ? 'text-white' : ''}`}>
                  <FaCalendarCheck className="mr-2"/>
                  {isMinimized ? null : <span>Bypass Presensi</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/rekapPresensi'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/rekapPresensi' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/rekapPresensi' ? 'text-white' : ''}`}>
                  <FaCheckDouble className="mr-2"/>
                  {isMinimized ? null : <span>Rekap Presensi</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataPerizinan'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/dataPerizinan' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/dataPerizinan' ? 'text-white' : ''}`}>
                  <FaFileCircleCheck className="mr-2"/>
                  {isMinimized ? null : <span>Data Perizinan</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400" />
            <Link to='/admin/perangkat'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/perangkat' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/perangkat' ? 'text-white' : ''}`}>
                  <BsFillDeviceSsdFill className="mr-2"/>
                  {isMinimized ? null : <span>Perangkat</span>}
                </a>
              </li>
            </Link>
            <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/perangkat' ? 'bg-themeTeal shadow' : ''}`}>
              <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/perangkat' ? 'text-white' : ''}`} onClick={logout}>
                <IoLogOut className="mr-2" /> 
                {isMinimized ? null : <span>Logout</span>}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;