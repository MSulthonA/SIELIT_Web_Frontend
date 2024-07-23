import { useContext } from 'react';
import icon_calendar from '../../assets/icon_calendar.svg';
import icon_check from '../../assets/icon_check.svg';
import icon_formIzin from '../../assets/icon_formIzin.svg';
import { Link } from 'react-router-dom';
import { PiStudentLight } from 'react-icons/pi';
import { userContext } from './Index';

function Beranda() {
    const userData = useContext(userContext);
    return (
        <div className='flex flex-col md:flex-row w-full -mt-24'>
            <div className='bg-[#26B673]/10 w-full md:w-6/12'>
                <div className='flex flex-col  items-center border-b border-black py-16'>
                    <div className='bg-[#192B1F]/20 w-fit p-12 rounded-full mb-6'>
                        <PiStudentLight className="text-7xl mx-auto" />
                    </div>
                    <p className='text-2xl font-semibold'>{userData.name}</p>
                    <p className='text-2xl font-semibold mb-12'>{userData.nis}</p>
                    <div className='mb-2 flex gap-4 justify-start w-80'>
                        <div className='flex justify-between w-40'>
                            <p>Jenis Kelamin</p>
                            <p>:</p>
                        </div>
                        <p>{userData.gender ? 'Laki-laki' : 'Perempuan'}</p>
                    </div>
                    <div className='mb-2 flex gap-4 justify-start w-80'>
                        <div className='flex justify-between w-40'>
                            <p>Status</p>
                            <p>:</p>
                        </div>
                        <p>{userData.is_active ? 'Santri Aktif' : 'Tidak Aktif'}</p>
                    </div>
                    <div className='mb-8 flex gap-4 justify-start w-80'>
                        <div className='flex justify-between w-40'>
                            <p>Kelas</p>
                            <p>:</p>
                        </div>
                        <p>{userData.class_name}</p>
                    </div>
                </div>
                <div className='flex flex-col items-center py-8'>
                    <p>Santri</p>
                    <p>Angkatan {userData.grade}</p>
                    <p>PPM BINA KHOIRUL INSAN SEMARANG</p>
                </div>
            </div>
            <div className='flex flex-col py-16 w-full md:w-6/12 items-center'>
                <p className="font-bold text-xl md:text-3xl mb-16">Fitur <span className="text-themeTeal">Presensi</span></p>
                <Link to='/santri/jadwalKelas'>
                    <div className="flex items-center w-96 h-24 justify-around py-4 px-7 bg-themeTeal/20 rounded-xl shadow-md mb-12">
                        <img src={icon_calendar} alt="" className="w-28 h-full" />
                        <p className="font-bold text-xl">JADWAL KELAS</p>
                    </div>
                </Link>
                <Link to='/santri/riwayatPresensi'>
                    <div className="flex items-center w-96 h-24 justify-around py-4 px-7 bg-themeTeal/20 rounded-xl shadow-md mb-12">
                        <img src={icon_check} alt="" className="w-28 h-full" />
                        <p className="font-bold text-xl">RIWAYAT PRESENSI</p>
                    </div>
                </Link>
                <Link to='/santri/formPerizinan'>
                    <div className="flex items-center w-96 h-24 justify-around py-4 px-7 bg-themeTeal/20 rounded-xl shadow-md">
                        <img src={icon_formIzin} alt="" className="w-28 h-full" />
                        <p className="font-bold text-xl">FORM IZIN</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Beranda;