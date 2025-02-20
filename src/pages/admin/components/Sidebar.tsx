import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  return (
    <div className="bg-[#26B673]/10 self-stretch w-80 flex flex-col items-center pb-24">
      <div className="w-full">
        <p className="border-y-2 border-black py-2 mx-5 mt-5 px-6 font-bold">Data Presensi</p>
        <Link to="/admin/dataSantri">
          <div
            className={`py-8 my-4 cursor-pointer  ${
              !["dataAkun", "dataRiwayatPresensi", "jadwalKelas", "bypassPresensi", "rekapPresensi", "perangkat", "dataPerizinan"].includes(location.pathname.split("/")[2]) ? "bg-[#192B1F]/20 rounded-r-full" : "w-full"
            }`}
          >
            <p className="text-center">Data Santri</p>
          </div>
        </Link>
        <Link to="/admin/dataAkun">
          <div className={`py-8 my-4 cursor-pointer  ${location.pathname.split("/")[2] == "dataAkun" ? "bg-[#192B1F]/20 rounded-r-full" : "w-full"}`}>
            <p className="text-center">Data Akun</p>
          </div>
        </Link>
        <Link to="/admin/dataRiwayatPresensi">
          <div className={`py-8 my-4 cursor-pointer  ${location.pathname.split("/")[2] == "dataRiwayatPresensi" ? "bg-[#192B1F]/20 rounded-r-full" : "w-full"}`}>
            <p className="text-center">Data Riwayat Presensi</p>
          </div>
        </Link>
      </div>
      <div className="w-full">
        <p className="border-y-2 border-black py-2 mx-5 mt-5 px-6 font-bold">Kelas</p>
        <Link to="/admin/jadwalKelas">
          <div className={`py-8 my-4 cursor-pointer  ${location.pathname.split("/")[2] == "jadwalKelas" ? "bg-[#192B1F]/20 rounded-r-full" : "w-full"}`}>
            <p className="text-center">Jadwal Kelas</p>
          </div>
        </Link>
        <Link to="/admin/bypassPresensi">
          <div className={`py-8 my-4 cursor-pointer  ${location.pathname.split("/")[2] == "bypassPresensi" ? "bg-[#192B1F]/20 rounded-r-full" : "w-full"}`}>
            <p className="text-center">Bypass Presensi</p>
          </div>
        </Link>
        <Link to="/admin/rekapPresensi">
          <div className={`py-8 my-4 cursor-pointer  ${location.pathname.split("/")[2] == "rekapPresensi" ? "bg-[#192B1F]/20 rounded-r-full" : "w-full"}`}>
            <p className="text-center">Rekap Presensi </p>
          </div>
        </Link>
      </div>
      <div className="w-full">
        <p className="border-y-2 border-black py-2 mx-5 mt-5 px-6 font-bold">Monitoring</p>
        <Link to="/admin/perangkat">
          <div className={`py-8 my-4 cursor-pointer  ${location.pathname.split("/")[2] == "perangkat" ? "bg-[#192B1F]/20 rounded-r-full" : "w-full"}`}>
            <p className="text-center">Perangkat</p>
          </div>
        </Link>
      </div>
      <div className="w-full">
        <p className="border-y-2 border-black py-2 mx-5 mt-5 px-6 font-bold">Perizinan</p>
        <Link to="/admin/dataPerizinan">
          <div className={`py-8 my-4 cursor-pointer  ${location.pathname.split("/")[2] == "dataPerizinan" ? "bg-[#192B1F]/20 rounded-r-full" : "w-full"}`}>
            <p className="text-center">Data Perizinan</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
