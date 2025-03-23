import { useEffect, useState, useContext } from 'react';
import { PiStudentLight } from 'react-icons/pi';
import { userContext } from './Index';
import axios from "axios";
import { AppContext } from "../../AppContext";
import { toast } from "react-toastify";
import appSettings from "../../Appsettings";
import Card from './components/Card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Beranda() {
  const userData = useContext(userContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const setToken = useContext(AppContext).token.set;
  const token = useContext(AppContext).token.data;
  const [search, setSearch] = useState({ string: "", startDate: "", endDate: "" });
  const [attendancePercentage, setAttendancePercentage] = useState(0); // Initialize with 0

  const namaHari = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];

  useEffect(() => {
    getUpcomingClasses();
    calculateAttendancePercentage();
  }, []);

  function getUpcomingClasses() {
    axios
      .get(`${appSettings.api}/classes/upcoming?startDate=${search.startDate}&endDate=${search.endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.msg) {
          toast.warn(res.data.msg);
        } else {
          setUpcomingClasses(res.data);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.setItem("token", "");
          setToken("");
        } else {
          toast.error(err.message, { theme: "colored" });
        }
      });
  }

  function calculateAttendancePercentage() {
    axios
      .get(`${appSettings.api}/attendances?userId=${userData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.msg) {
          toast.warn(res.data.msg);
        } else {
          const attendanceHistory = res.data;
          const totalClasses = attendanceHistory.length;
          const attendedClasses = attendanceHistory.filter((attendance: any) => attendance.attend_at).length;
          const percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
          setAttendancePercentage(Math.round(percentage));
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.setItem("token", "");
          setToken("");
        } else {
          toast.error(err.message, { theme: "colored" });
        }
      });
  }

  function handleSearch(e: any) {
    console.log(e.target.value);
    setSearch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function truncateName(name: string): string {
    const words = name.split(' ');
    return words.slice(0, 3).join(' ');
  }

  return (
    <div className="flex flex-col justify-center md:flex-row w-full -mt-10 md:-mt-24 md:left-0 left-10 overflow-x-hidden">
      <div className='bg-white shadow w-full md:w-1/3 rounded-md m-3 p-2'>
        <div className='flex flex-col items-center justify-center border-b border-black pt-16'>
          <div className='bg-[#192B1F]/20 w-fit p-2 md:p-3 rounded-full mb-3 md:mb-5'>
            <PiStudentLight className="text-6xl md:text-7xl mx-auto" />
          </div>
          <div className="flex flex-col align-middle items-center justify-center">
            <p className='text-sm md:text-2xl truncate font-semibold'>{truncateName(userData.name)}</p>
            <p className='text-sm md:text-2xl font-semibold mb-6'>{userData.nis}</p>
          </div>
          <div className='flex flex-col justify-start'>
            <div className='mb-2 flex flex-col md:flex-row items-center gap-0 md:gap-4 justify-center md:justify-start'>
              <div className='flex text-sm md:text-lg justify-center md:justify-between w-40'>
                <p className="font-semibold md:font-normal">Jenis Kelamin</p>
                <p className='hidden md:block'>:</p>
              </div>
              <p className='text-sm md:text-lg'>{userData.gender ? 'Laki-laki' : 'Perempuan'}</p>
            </div>
            <div className='mb-2 flex flex-col md:flex-row items-center gap-0 md:gap-4 justify-center md:justify-start'>
              <div className='flex text-sm md:text-lg justify-center md:justify-between w-40'>
                <p className="font-semibold md:font-normal">Status</p>
                <p className='hidden md:block'>:</p>
              </div>
              <p className='text-sm md:text-lg'>{userData.is_active ? 'Santri Aktif' : 'Tidak Aktif'}</p>
            </div>
            <div className='mb-2 flex flex-col md:flex-row items-center gap-0 md:gap-4 justify-center md:justify-start'>
              <div className='flex text-sm md:text-lg justify-center md:justify-between w-40'>
                <p className="font-semibold md:font-normal">Kelas</p>
                <p className='hidden md:block'>:</p>
              </div>
              <p className='text-sm md:text-lg'>{userData.class_name}</p>
            </div>
          </div>
        </div>
        <div className='flex text-sm md:text-lg flex-col items-center align-middle justify-center py-3'>
          <p>Santri</p>
          <p>Angkatan {userData.grade}</p>
          <p className='hidden md:block'>PPM BINA KHOIRUL INSAN SEMARANG</p>
        </div>
      </div>
      <div className='flex flex-col md:flex-row pt-3'>
        <div className="flex flex-col w-full md:w-1/3 p-5 mx-3 md:mx-0 flex-1 bg-white shadow-md rounded-md">
          <p className="font-bold text-xl md:text-3xl pr-7">Pengajian</p>
          <span className="font-bold text-lg md:text-2xl text-themeTeal mb-4">Yang akan datang</span>
          <div className="flex flex-col overflow-y-auto max-h-96">
            {upcomingClasses.length === 0 ? (
              <Card name="Tidak ada kelas" />
            ) : (
              upcomingClasses.map((upcomingClass: any, index) => {
                const startDate = new Date(upcomingClass.start_date);
                const endDate = new Date(upcomingClass.end_date);

                return (
                  <Card
                    key={index}
                    name={upcomingClass.name}
                    startDate={startDate}
                    endDate={endDate}
                    namaHari={namaHari}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center md:items-start w-full md:w-1/3 h-min pt-3 md:pl-3">
        <div className='flex flex-col items-center justify-start flex-1 bg-white rounded-md shadow-md p-5'>
          <h3 className='font-bold text-lg md:text-3xl mb-4'>Persentase kehadiran</h3>
          <div className='w-28 h-28'>
            <CircularProgressbar
              value={attendancePercentage}
              text={`${attendancePercentage}%`}
              styles={buildStyles({
                textSize: '16px',
                pathColor: `rgba(62, 152, 199, ${attendancePercentage / 100})`,
                textColor: '#13A89D',
                trailColor: '#d6d6d6',
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Beranda;