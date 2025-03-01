import { useState, useContext, createContext, useEffect } from "react";
import Footer from "../../components/Footer";
import Navbar from "./components/NavbarGuru";
import { Outlet } from 'react-router-dom';
import { AppContext } from "../../AppContext";
import jwt from "jwt-decode";
import Sidebar from "./components/Sidebar";
import BypassPresensidanPerizinanMobile from "./BypassPresensidanPerizinanMobile";

export const userContext = createContext({});

function Teacher() {
  const token = useContext(AppContext).token.data;
  const setToken = useContext(AppContext).token.set;
  let user = '';
  try {
    user = jwt(token);
  } catch (err) { }

  const [userData, setUserData] = useState(user);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <userContext.Provider value={userData}>
      <div className="flex flex-col items-center justify-start relative text-lg">
        {!isMobile && <Navbar className="bg-milkyWhite" />}
        <div className={`flex w-full min-h-[100svh] ${isMobile ? (isMinimized ? 'ml-16' : 'ml-60') : ''}`}>
          {isMobile && <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} isMobile={isMobile} />}
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
        <div className="md:hidden py-24">
          {/* <BypassPresensidanPerizinanMobile /> */}
        </div>
        {/* <Footer /> */}
      </div>
    </userContext.Provider>
  );
}

export default Teacher;
