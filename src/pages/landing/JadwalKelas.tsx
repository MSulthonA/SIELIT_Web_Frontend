import { useEffect, useState, useContext } from "react";
import Footer from "../../components/Footer";
import Navbar from "./compoenents/NavbarLanding";
import axios from "axios";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";
import { ToastContainer, toast } from 'react-toastify'
import DateInput from "../../components/DateInput";
import TextInput from "../../components/TextInput";
import moment from "moment";

function JadwalKelas() {
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const setToken = useContext(AppContext).token.set;
    const [search, setSearch] = useState({ string: '', startDate: '', endDate: '' });

    const namaHari = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

    useEffect(() => {
        getUpcomingClasses();
    }, []);


    function getUpcomingClasses() {
        axios.get(`${appSettings.api}/classes/upcoming?startDate=${search.startDate}&endDate=${search.endDate}`)
            .then(res => {
                if (res.data.msg) {
                    toast.warn(res.data.msg);
                }
                else {
                    setUpcomingClasses(res.data)
                }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    localStorage.setItem('token', '');
                    setToken('');
                } else {
                    toast.error(err, { theme: "colored" })
                }
            })
    }

    function handleSearch(e: any) {
        console.log(e.target.value)
        setSearch(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function checkSearch(permit: any) {
        const startDate = new Date(permit.start_date);
        const endDate = new Date(permit.end_date);

        let searchString = permit.name + permit.nis + permit.class_name + permit.description + permit.location + namaHari[startDate.getDay()]
            + startDate.toLocaleString('id').replace(/\//g, '-').replace(',', '').split(' ')[0];

        try {
            const re = new RegExp(search.string.replace(/\\*/, ''), 'i');
            return re.exec(searchString);
        } catch {
            const re = new RegExp('zzzzzzz', 'i');
            return re.exec(searchString);
        }
    }

    return (
        <div className="flex flex-col items-center justify-start relative text-lg">
            <Navbar className="bg-white shadow-md mb-24" />
            <p className="font-bold text-3xl md:text-3xl mb-16">Jadwal <span className="text-themeTeal">Kelas</span></p>
            <div className="w-10/12 flex flex-col md:w-full md:flex-row md:gap-8 justify-between items-end md:items-center mb-4 md:max-w-5xl">
                <TextInput name="string" title="🔎 masukkan kata kunci" errorMsg="" onChange={handleSearch} className="w-full mb-4 md:max-w-md" inputClassName="bg-white" value={search.string} />
                <DateInput name="startDate" title="dari" errorMsg="" onChange={handleSearch} className="w-full" inputClassName="bg-white -mb-6" value={search.startDate} />
                <DateInput name="endDate" title="sampai" errorMsg="" onChange={handleSearch} className="w-full" inputClassName="bg-white -mb-6" value={search.endDate} />
                <button className="bg-themeTeal self-end md:self-center text-white text-sm font-semibold px-4 py-2 mt-3 md:-mt-4 h-fit rounded" onClick={getUpcomingClasses}>Terapkan filter</button>
            </div>
            <div className="rounded-lg overflow-x-hidden overflow-y-scroll max-h-96 no-scrollbar mb-24 w-10/12 md:w-auto">
                <table className="w-full text-left h-12 text-sm md:text-base">
                    <thead className="bg-themeTeal text-white sticky top-0">
                        <tr>
                            <th className="pl-6 py-2 hidden md:table-cell">No.</th>
                            <th className="pl-6 py-2">Nama</th>
                            <th className="pl-6 py-2 hidden md:table-cell">Kelas</th>
                            <th className="pl-6 py-2">Ruangan</th>
                            <th className="px-6 py-2">Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            upcomingClasses.map((upcomingClass: any, index) => {
                                const startDate = new Date(upcomingClass.start_date);
                                const endDate = new Date(upcomingClass.end_date);

                                return (
                                    checkSearch(upcomingClass) &&
                                    <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                                        <td className="pl-6 py-2 hidden md:table-cell">{index + 1}.</td>
                                        <td className="pl-6 py-2">{upcomingClass.name}</td>
                                        <td className="pl-6 py-2 hidden md:table-cell">{startDate.getHours() > 13 ? startDate.getHours() > 18 ? 'Malam' : 'Sore' : 'Pagi'}</td>
                                        <td className="pl-6 py-2">{upcomingClass.location}</td>
                                        <td className="px-6 py-2">{namaHari[startDate.getDay()]}, {startDate.toLocaleString('id').replace(/\//g, '-').replace(',', '').split(' ')[0]} {startDate.toLocaleTimeString('id')} s/d {endDate.toLocaleTimeString('id')}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
}

export default JadwalKelas;