import { useState, useContext, createContext } from "react";
// import Navbar from "./components/NavbarAdmin"
import { Outlet } from 'react-router-dom'
import { AppContext } from "../../AppContext";
import jwt from 'jwt-decode';
import Sidebar from "./components/Sidebar";

export const userContext = createContext({})

function Admin() {
    const token = useContext(AppContext).token.data;
    let user = '';
    try {
        user = jwt(token)
    // eslint-disable-next-line no-empty
    } catch (err) { }

    const [userData] = useState(user);

    return (
        <userContext.Provider value={userData}>
            <div className="flex flex-col items-center justify-start relative text-lg">
                {/* <Navbar className="bg-themeMilk2" /> */}
                <div className="flex items-start w-full min-h-[100svh]">
                <Sidebar />
                <Outlet />
                {/* <main className="flex-1 flex-wrap p-0">
                </main> */}
                </div>
                {/* <Footer /> */}
            </div>
        </userContext.Provider>
    );
}

export default Admin;