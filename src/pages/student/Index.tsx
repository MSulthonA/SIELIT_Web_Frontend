import { useState, useContext, createContext, useEffect } from "react";
import Footer from "../../components/Footer";
import Navbar from "./components/NavbarStudent";
<<<<<<< HEAD
import { Outlet } from "react-router-dom";
=======
import { Outlet } from 'react-router-dom';
>>>>>>> 3917b36109d0699c2cf8c2ec0c15926832a5c93a
import { AppContext } from "../../AppContext";
import jwt from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import appSettings from "../../Appsettings";
import Sidebar from "./components/Sidebar";

export const userContext = createContext({});

function Student() {
  const token = useContext(AppContext).token.data;
  const setToken = useContext(AppContext).token.set;
<<<<<<< HEAD
  let user = "";
  try {
    user = jwt(token);
  } catch (err) {}
  const [userData, setUserData] = useState(user);
  const [classes, setClasses] = useState<any[]>([]);
  const namaHari = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];

  useEffect(() => {
    getmanagedClasses();
  }, []);

  function getmanagedClasses() {
    axios
      .get(`${appSettings.api}/classes?managerId=${userData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const classes = res.data.map((classData: any) => {
          const startDate = new Date(classData.start_date);
          const endDate = new Date(classData.end_date);
          return {
            value: classData.id,
            label: `${classData.name} - ${namaHari[startDate.getDay()]} ${startDate.getHours() > 13 ? (startDate.getHours() > 18 ? "malam" : "sore") : "pagi"}, ${
              startDate.toLocaleString("id").replace(/\//g, "-").replace(",", "").split(" ")[0]
            } (${startDate.toLocaleTimeString("id")} s/d ${endDate.toLocaleTimeString("id")})`,
          };
        });
        setClasses(classes);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.setItem("token", "");
          setToken("");
          toast.info("Token expired, please login again", { theme: "colored", toastId: "expired" });
        } else {
          toast.error(err, { theme: "colored" });
        }
      });
  }

  return (
    <userContext.Provider value={userData}>
      <div className="flex flex-col items-center justify-start relative text-lg">
        {/* <Navbar className="bg-themeTeal mb-24" manageClass={classes.length >= 1}/> */}
        <Outlet />
        <Footer />
=======
  let user = '';
  try {
    user = jwt(token);
  } catch (err) { }
  const [userData, setUserData] = useState(user);
  const [classes, setClasses] = useState<any[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const namaHari = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

  useEffect(() => {
    getmanagedClasses();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  function getmanagedClasses() {
    axios.get(`${appSettings.api}/classes?managerId=${userData.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      const classes = res.data.map((classData: any) => {
        const startDate = new Date(classData.start_date);
        const endDate = new Date(classData.end_date);
        return {
          value: classData.id,
          label: `${classData.name} - ${namaHari[startDate.getDay()]} ${startDate.getHours() > 13 ? startDate.getHours() > 18 ? 'malam' : 'sore' : 'pagi'}, ${startDate.toLocaleString('id').replace(/\//g, '-').replace(',', '').split(' ')[0]} (${startDate.toLocaleTimeString('id')} s/d ${endDate.toLocaleTimeString('id')})`
        };
      });
      setClasses(classes);
    }).catch(err => {
      if (err.response.status === 401) {
        localStorage.setItem('token', '');
        setToken('');
        toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
      } else {
        toast.error(err, { theme: "colored" });
      }
    });
  }

  return (
    <userContext.Provider value={userData}>
      <div className="flex flex-col items-center justify-start relative text-lg">
        {!isMobile && <Navbar className="bg-milkyWhite mb-24" manageClass={classes.length >= 1} />}
        <div className="flex w-full">
          <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} isMobile={isMobile} manageClass={classes.length >= 1} />
          <main className={`flex-1 p-4 ${isMobile ? (isMinimized ? 'ml-16' : 'ml-60') : ''}`}>
            <Outlet />
          </main>
        </div>
        {/* <Footer /> */}
>>>>>>> 3917b36109d0699c2cf8c2ec0c15926832a5c93a
      </div>
    </userContext.Provider>
  );
}

export default Student;
