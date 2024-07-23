import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import appSettings from '../../Appsettings';
import { userContext } from './Index';
import { AppContext } from '../../AppContext';
import {ToastContainer,  toast } from 'react-toastify';
import PresensiCard from './components/PresensiCard';


function RiwayatPresensi() {
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const userData = useContext(userContext);
    const setToken = useContext(AppContext).token.set;
    const token = useContext(AppContext).token.data;

    useEffect(() => {
        axios.get(`${appSettings.api}/attendances?userId=${userData.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.msg) {
                    toast.warn(res.data.msg);
                }
                else {
                    setAttendanceHistory(res.data);
                }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
                    localStorage.setItem('token', '');
                    setToken('');
                } else {
                    toast.error(err, { theme: "colored" })
                }
            })
    }, []);

    return (
        <div className='w-full flex flex-col items-center min-h-[100svh]'>
            <p className="font-bold mb-16 text-2xl md:text-3xl">Riwayat <span className="text-themeTeal">Presensi</span></p>
            <div className="flex flex-col items-center gap-6 w-full max-w-6xl px-8 pb-24">
                <div className='hidden last:block text-base text-center mb-24'>
                    Anda belum memiliki riwayat presnesi
                </div>
                {
                    attendanceHistory.map((attendance: any) => attendance.attend_at ? < PresensiCard {...attendance}/> : <></>)
                }
            </div>
        </div>
    );
}

export default RiwayatPresensi;