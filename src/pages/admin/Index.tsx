import { useState, useContext, createContext } from "react";
import { Outlet } from "react-router-dom";
import { AppContext } from "../../AppContext";
import jwt from "jwt-decode";
import Sidebar from "./components/Sidebar";

export const UserContext = createContext({});

function Admin() {
  const token = useContext(AppContext).token.data;
  let user = "";
  try {
    user = jwt(token);
  } catch (err) {
    console.error("Error decoding token:", err);
  }

  const [userData] = useState(user);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <UserContext.Provider value={userData}>
      <div className="flex flex-col items-center justify-start relative bg-themeSilver text-lg">
        <div className={`flex transition-all duration-300 ${isMinimized ? "ml-16" : "ml-80"}`}>
          <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
          <main className={`flex-1 p-4 w-80 ${isMinimized ? "sm:w-160" : "sm:w-80"}  xl:w-172 2xl:w-178`}>
            <Outlet />
          </main>
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default Admin;
