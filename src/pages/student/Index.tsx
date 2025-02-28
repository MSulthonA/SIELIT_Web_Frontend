import { useState, useContext, createContext, useEffect } from "react";
import Footer from "../../components/Footer"
import Navbar from "./components/NavbarStudent"
import { Outlet } from 'react-router-dom'
import { AppContext } from "../../AppContext";
import jwt from 'jwt-decode';
import axios from "axios";
import { toast } from "react-toastify";
import appSettings from "../../Appsettings";

export const userContext = createContext({})

function Student() {
    const token = useContext(AppContext).token.data;
    const setToken = useContext(AppContext).token.set;
    let user = '';
    try{
        user = jwt(token)
    }catch(err){}
    const [userData, setUserData] = useState(user);
    const [classes, setClasses] = useState<any[]>([]);
    const namaHari = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];


    useEffect(() => {
        getmanagedClasses();
    }, [])

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
                }
            });
            setClasses(classes)
        }).catch(err => {
            if (err.response.status === 401) {
                localStorage.setItem('token', '');
                setToken('');
                toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
            } else {
                toast.error(err, { theme: "colored" })
            }
        })
    }

    return (
        <userContext.Provider value={userData}>
            <div className="flex flex-col items-center justify-start relative text-lg">
                
                <Navbar className="bg-milkyWhite mb-24" manageClass={classes.length >= 1}/>
                <Outlet />
                {/* <Footer /> */}
            </div>
        </userContext.Provider>
    );
}

export default Student;