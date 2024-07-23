import { useState, useContext, createContext } from "react";
import Footer from "../../components/Footer"
import Navbar from "./components/NavbarGuru"
import { Outlet } from 'react-router-dom'
import { AppContext } from "../../AppContext";
import jwt from 'jwt-decode';
import Sidebar from "./components/Sidebar";
import BypassPresensidanPerizinanMobile from "./BypassPresensidanPerizinanMobile";

export const userContext = createContext({})

function Teacher() {
    const token = useContext(AppContext).token.data;
    let user = '';
    try {
        user = jwt(token)
    } catch (err) { }

    const [userData, setUserData] = useState(user);

    return (
        <userContext.Provider value={userData}>
            <div className="flex flex-col items-center justify-start relative text-lg">
                <Navbar className="bg-themeTeal" />
                <div className="items-start w-full min-h-[100svh] hidden md:flex">
                    <Sidebar />
                    <Outlet />
                </div>
                <div className="md:hidden py-24">
                    <BypassPresensidanPerizinanMobile />
                </div>
                <Footer />
            </div>
        </userContext.Provider>
    );
}

export default Teacher;