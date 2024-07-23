import {Link, useLocation} from 'react-router-dom'

function Sidebar() {
    const location = useLocation();
    return ( 
        <div className="bg-[#26B673]/10 self-stretch w-80 flex flex-col items-center pb-24 hidden md:block">
            <div className="w-full">
                <p className="border-y-2 border-black py-2 mx-5 mt-5 px-6 font-bold">Kelas</p>
                <Link to='/guru/bypassPresensi' >
                <div className={`py-8 my-4 cursor-pointer  ${location.pathname.split('/')[2] == 'bypassPresensi' ? 'bg-[#192B1F]/20 rounded-r-full' : 'w-full'}`}>
                    <p className="text-center">Bypass Presensi</p>
                </div>
                </ Link>
            </div>
            <div className="w-full">
                <p className="border-y-2 border-black py-2 mx-5 mt-5 px-6 font-bold">Perizinan</p>
                <Link to='/guru/dataPerizinan' >
                <div className={`py-8 my-4 cursor-pointer  ${location.pathname.split('/')[2] == 'dataPerizinan' ? 'bg-[#192B1F]/20 rounded-r-full' : 'w-full'}`}>
                    <p className="text-center">Data Perizinan</p>
                </div>
                </ Link>
            </div>
        </div>
     );
}

export default Sidebar;