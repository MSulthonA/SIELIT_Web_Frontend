import React, { useState, useEffect } from 'react';
import { HiUser, HiBars3BottomLeft, HiBars3 } from "react-icons/hi2";
import { FaCalendarCheck, FaCalendarDays, FaFileCircleCheck } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { MdClass } from "react-icons/md";
import { BsFillDeviceSsdFill } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import logggo from '../../../assets/logggo.png';
// import { AppContext } from '../../../AppContext';
// import { useContext } from 'react';

const Sidebar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [transitionClass, setTransitionClass] = useState('');
  const location = useLocation();

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    setTransitionClass('transition-all duration-300 ease-in-out');
    const timer = setTimeout(() => {
      setTransitionClass('');
    }, 300);
    return () => clearTimeout(timer);
  }, [isMinimized]);

  return (
    <div className={`flex h-screen bg-themeTeal2 text-gray-800 ${transitionClass} ${isMinimized ? 'w-14' : 'w-75'} pl-3 mt-3`}>
      <div className="flex w-full flex-col justify-between mt-3">
        <div className='flex flex-col justify-center items-center'>
          {isMinimized ? <img src={logggo} alt="logggo PPM" className='w-20 mb-3' />
           : 
           <div className='flex flex-col justify-center items-center'>
             <img src={logggo} alt="logggo PPM" className='w-20' />
             <p className='text-themeTeal font-bold text-2xl md:text2xl'>SI ELIT</p>
             <p className='text-sm md:text-base'>Pondok Pesantren <br /> Bina Khoirul Insan</p>
           </div>}
            {/* <img src={logggo} alt="logggo PPM" className='w-11 mb-3' />
            <p className='text-themeTeal font-bold text-2xl md:text2xl'>SI ELIT</p>
            <p className='text-sm md:text-base'>Pondok Pesantren Bina Khoirul Insan</p> */}
        </div>
        <button onClick={toggleSidebar} className="p-3 rounded-xl text-left text-gray-800 hover:bg-themeTeal">
          {isMinimized ? <HiBars3BottomLeft /> : <HiBars3 />}
        </button>
        <nav className="flex-1">
          <ul>
            <Link to='/admin/dataSantri'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/dataSantri' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/dataSantri' ? 'text-white' : ''}`}>
                  {isMinimized ? "" : <IoPeople className="mr-2"/>}
                  {isMinimized ? <IoPeople /> : <span>Data Santri</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataAkun'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal hover:text-white ${location.pathname === '/admin/dataAkun' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/dataAkun' ? 'text-white' : ''}`}>
                  {isMinimized ? "" : <HiUser className="mr-2"/>}
                  {isMinimized ? <HiUser /> : <span>Data Akun</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataRiwayatPresensi'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/dataRiwayatPresensi' ? 'bg-themeTeal shadow ' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/dataRiwayatPresensi' ? 'text-white' : ''}`}>
                  {isMinimized ? "" : <FaCalendarDays className="mr-2"/>}
                  {isMinimized ? <FaCalendarDays /> : <span>Data Riwayat Presensi</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400 " />
            <Link to='/admin/jadwalKelas'>
                <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/jadwalKelas' ? 'bg-themeTeal shadow' : ''} justify-center`}>
                  <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/jadwalKelas' ? 'text-white' : ''}`}>
                    {isMinimized ? "" : <MdClass className="mr-2"/>}
                    {isMinimized ? <MdClass /> : <span>Jadwal Kelas</span>}
                  </a>
              </li>
            </Link>
            <Link to='/admin/bypassPresensi'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/bypassPresensi' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/bypassPresensi' ? 'text-white' : ''}`}>
                  {isMinimized ? "" : <FaCalendarCheck className="mr-2"/>}
                  {isMinimized ? <FaCalendarCheck /> : <span>Bypass Presensi</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/rekapPresensi'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/rekapPresensi' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/rekapPresensi' ? 'text-white' : ''}`}>
                  {isMinimized ? "" : <FaCheckDouble className="mr-2"/>}
                  {isMinimized ? <FaCheckDouble /> : <span>Rekap Presensi</span>}
                </a>
              </li>
            </Link>
            <Link to='/admin/dataPerizinan'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/dataPerizinan' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/dataPerizinan' ? 'text-white' : ''}`}>
                  {isMinimized ? "" : <FaFileCircleCheck className="mr-2"/>}
                  {isMinimized ? <FaFileCircleCheck /> : <span>Data Perizinan</span>}
                </a>
              </li>
            </Link>
            <hr className="border-gray-400" />
            <Link to='/admin/perangkat'>
              <li className={`p-3 mt-2 mb-2 rounded-xl hover:bg-themeTeal ${location.pathname === '/admin/perangkat' ? 'bg-themeTeal shadow' : ''}`}>
                <a href="#" className={`flex items-center text-base text-gray-800 ${location.pathname === '/admin/perangkat' ? 'text-white' : ''}`}>
                  {isMinimized ? "" : <BsFillDeviceSsdFill className="mr-2"/>}
                  {isMinimized ? <BsFillDeviceSsdFill /> : <span>Perangkat</span>}
                </a>
              </li>
            </Link>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;