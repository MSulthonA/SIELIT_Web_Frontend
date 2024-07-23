import { useContext, useEffect, useState } from "react";
import DateInput from "../../components/DateInput";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import axios from "axios";
import { toast } from "react-toastify";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";

function RekapPresensi() {
    const [search, setSearch] = useState<any>({ classType: '', startDate: '', endDate: '' });
    const [classTypes, setClassTypes] = useState<any[]>([]);
    const [recap, setRecap] = useState<any>({});
    const [totalAttendance, setTotalAttendance] = useState<any>({
        all: 0,
        pagi: 0,
        malam: 0
    });
    console.log(totalAttendance);
    const setToken = useContext(AppContext).token.set;
    const token = useContext(AppContext).token.data;

    useEffect(() => {
        getClassTypes();
    }, []);

    useEffect(() => {
        setTotalAttendance(prev => {
            const pagi = Object.keys(recap).length && recap[Object.keys(recap)[0]].reduce((acc: any, el: any) => { return acc + el.jumlah_sesi_pagi }, 0);
            const malam = Object.keys(recap).length && recap[Object.keys(recap)[0]].reduce((acc: any, el: any) => { return acc + el.jumlah_sesi_malam }, 0);

            return { pagi, malam, all: pagi + malam };
        })
    }, [recap]);

    function handleSearch(e: any) {
        setSearch(prev => ({ ...prev, [e.target.name]: e.target.value, [e.target.name + 'Err']: '' }));
    }

    function getAttendanceRecap() {
        Object.keys(search).forEach(key => {
            if (search[key] === '') {
                setSearch(prev => ({ ...prev, [key + 'Err']: 'harus diisi' }));
                return;
            }
        })

        axios.get(`${appSettings.api}/attendances/recap`, {
            params: search, headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            const recap = res.data.reduce((acc: any, el: any) => {
                return { ...acc, [el.name]: [] }
            }, {});

            res.data.forEach((el: any) => {
                recap[el.name].push(el);
            }
            )
            setRecap(recap);
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

    function getClassTypes() {
        axios.get(`${appSettings.api}/classes/types`).then(res => {
            setClassTypes(res.data.map((el: any) => ({ value: el.id, label: el.name })));
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
        <div className="min-h-[100svh] flex flex-col items-center justify-start py-16 grow px-12">
            <p className="font-bold text-xl md:text-3xl mb-16">Rekap <span className="text-themeTeal">Presensi</span></p>
            <div className="w-full flex justify-between mb-4">
                <SelectInput name="classType" title="Tipe Kelas" errorMsg={search.classTypeErr} onChange={handleSearch} className="w-full max-w-md" value={search.classType} values={classTypes} />
                <DateInput name="startDate" title="dari" errorMsg={search.startDateErr} onChange={handleSearch} className="" inputClassName="bg-white" value={search.startDate} />
                <DateInput name="endDate" title="sampai" errorMsg={search.endDateErr} onChange={handleSearch} className="" inputClassName="bg-white" value={search.endDate} />
                <button className="bg-themeTeal text-white text-sm font-semibold px-4 py-2 mt-3 h-fit rounded" onClick={getAttendanceRecap}>Generate rekap</button>
            </div>
            {
                Object.keys(recap).length > 0 && <>
                    <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
                        <table className="w-full h-12 text-center text-xs border-collapse">
                            <thead className="bg-themeTeal text-white sticky top-0">
                                <tr>
                                    <th className="py-2 px-4 border border-white" rowSpan={4}>No.</th>
                                    <th className="py-2 px-4 border border-white" rowSpan={4}>Nama Lengkap</th>
                                    <th className="py-2 px-4 border border-white" rowSpan={4}>Gender</th>
                                    {
                                        Object.keys(recap).length && recap[Object.keys(recap)[0]].map((el: any) => {
                                            const start = new Date(el.week_start).getDate();
                                            const end = new Date(el.week_end).getDate();
                                            const month = new Date(el.week_start).toLocaleString('default', { month: 'long' });
                                            return <th className="py-2 px-4 border border-white" colSpan={6}>{`${start}-${end} ${month}`}</th>
                                        })
                                    }
                                </tr>
                                <tr>
                                    {
                                        Object.keys(recap).length && recap[Object.keys(recap)[0]].map((el: any, idx) => {
                                            return <th className="py-2 px-4 border border-white" colSpan={6}>{`Presensi Minggu - ${idx + 1}`}</th>
                                        })
                                    }
                                </tr>
                                <tr>
                                    {
                                        Object.keys(recap).length && recap[Object.keys(recap)[0]].map((el: any, idx) => {
                                            return (<>
                                                <th className="py-2 px-4 border border-white" colSpan={3}>PAGI</th>
                                                <th className="py-2 px-4 border border-white" colSpan={3}>MALAM</th>
                                            </>)
                                        })
                                    }
                                </tr>
                                <tr>
                                    {
                                        Object.keys(recap).length && recap[Object.keys(recap)[0]].map((el: any, idx) => {
                                            return (<>
                                                <th className="py-2 px-4 border border-white">H</th>
                                                <th className="py-2 px-4 border border-white">I</th>
                                                <th className="py-2 px-4 border border-white bg-red-400">A</th>
                                                <th className="py-2 px-4 border border-white">H</th>
                                                <th className="py-2 px-4 border border-white ">I</th>
                                                <th className="py-2 px-4 border border-white bg-red-400">A</th>
                                            </>)
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.keys(recap).length && Object.keys(recap).map((el, idx) => {
                                        return (
                                            <tr className="even:bg-slate-200 odd:bg-white">
                                                <th className="py-2 border border-white">{idx + 1}.</th>
                                                <th className="py-2 border border-white">{recap[el][0].name}</th>
                                                <th className="py-2 border border-white">{recap[el][0].gender ? 'L' : 'P'}</th>
                                                {
                                                    recap[el].map((el: any) => {
                                                        return (<>
                                                            <th className="py-2 border border-white">{el.jumlah_hadir_pagi}</th>
                                                            <th className="py-2 border border-white">{el.jumlah_izin_pagi}</th>
                                                            <th className="py-2 border border-white bg-red-400 text-white">{el.jumlah_alfa_pagi}</th>
                                                            <th className="py-2 border border-white">{el.jumlah_hadir_malam}</th>
                                                            <th className="py-2 border border-white">{el.jumlah_izin_malam}</th>
                                                            <th className="py-2 border border-white bg-red-400 text-white">{el.jumlah_alfa_malam}</th>
                                                        </>)
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    <p className="font-bold text-xl md:text-3xl mb-16">Keterangan Presensi <span className="text-themeTeal">{`${search.startDate} s/d ${search.endDate}`}</span></p>
                    <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
                        <table className="w-full h-12 text-center text-sm border-collapse">
                            <thead className="bg-themeTeal text-white sticky top-0">
                                <tr>
                                    <th className="py-2 border border-white" rowSpan={2}>No.</th>
                                    <th className="py-2 border border-white" rowSpan={2}>Nama Lengkap</th>
                                    <th className="py-2 border border-white" rowSpan={2}>Gender</th>

                                    <th className="py-2 border border-white" colSpan={2}>Hadir</th>
                                    <th className="py-2 border border-white" colSpan={2}>Izin/Sakit</th>
                                    <th className="py-2 border border-white" colSpan={2}>Alfa</th>

                                </tr>
                                <tr>
                                    <th className="py-2 border border-white" >P</th>
                                    <th className="py-2 border border-white" >M</th>
                                    <th className="py-2 border border-white" >P</th>
                                    <th className="py-2 border border-white" >M</th>
                                    <th className="py-2 border border-white" >P</th>
                                    <th className="py-2 border border-white" >M</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.keys(recap).length && Object.keys(recap).map((el, idx) => {
                                        const jumlah_alfa_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_alfa_malam, 0);
                                        const jumlah_alfa_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_alfa_pagi, 0);
                                        const jumlah_hadir_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_hadir_malam, 0);
                                        const jumlah_hadir_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_hadir_pagi, 0);
                                        const jumlah_izin_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_izin_malam, 0);
                                        const jumlah_izin_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_izin_pagi, 0);

                                        return (
                                            <tr className="even:bg-slate-200 odd:bg-white">
                                                <th className="py-2 border border-white">{idx + 1}.</th>
                                                <th className="py-2 border border-white">{recap[el][0].name}</th>
                                                <th className="py-2 border border-white">{recap[el][0].gender ? 'L' : 'P'}</th>
                                                <th className="py-2 border border-white">{jumlah_hadir_pagi}</th>
                                                <th className="py-2 border border-white">{jumlah_hadir_malam}</th>
                                                <th className="py-2 border border-white">{jumlah_izin_pagi}</th>
                                                <th className="py-2 border border-white">{jumlah_izin_malam}</th>
                                                <th className="py-2 border border-white">{jumlah_alfa_pagi}</th>
                                                <th className="py-2 border border-white">{jumlah_alfa_malam}</th>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    <p className="font-bold text-xl md:text-3xl mb-16">Persentase Kehadiran <span className="text-themeTeal"> {`${search.startDate} s/d ${search.endDate}`}</span></p>
                    <div className="flex gap-4 mb-6">
                        <p>Total ngaji: {totalAttendance.all}</p>
                        <p>Sesi pagi: {totalAttendance.pagi}</p>
                        <p>Sesi malam: {totalAttendance.malam}</p>
                        <p>H: Hadir</p>
                        <p>I: Izin/Sakit</p>
                        <p>A: Alfa</p>
                    </div>
                    <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
                        <table className="w-full h-12 text-center text-xs border-collapse">
                            <thead className="bg-themeTeal text-white sticky top-0">
                                <tr>
                                    <th className="py-2 border border-white" rowSpan={2}>No.</th>
                                    <th className="py-2 border border-white" rowSpan={2}>Nama Lengkap</th>
                                    <th className="py-2 border border-white" rowSpan={2}>Gender</th>

                                    <th className="py-2 border border-white" colSpan={3}>Sesi Pagi</th>
                                    <th className="py-2 border border-white" colSpan={3}>Sesi Malam</th>
                                    <th className="py-2 border border-white" rowSpan={2}>Persentasi Kehadiran</th>

                                </tr>
                                <tr>
                                    <th className="py-2 border border-white" >H</th>
                                    <th className="py-2 border border-white" >I</th>
                                    <th className="py-2 border border-white" >A</th>
                                    <th className="py-2 border border-white" >H</th>
                                    <th className="py-2 border border-white" >I</th>
                                    <th className="py-2 border border-white" >A</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.keys(recap).length && Object.keys(recap).map((el, idx) => {
                                        const jumlah_alfa_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_alfa_malam, 0);
                                        const jumlah_alfa_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_alfa_pagi, 0);
                                        const jumlah_hadir_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_hadir_malam, 0);
                                        const jumlah_hadir_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_hadir_pagi, 0);
                                        const jumlah_izin_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_izin_malam, 0);
                                        const jumlah_izin_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_izin_pagi, 0);

                                        return (
                                            <tr className="even:bg-slate-200 odd:bg-white">
                                                <th className="py-2 border border-white">{idx + 1}.</th>
                                                <th className="py-2 border border-white">{recap[el][0].name}</th>
                                                <th className="py-2 border border-white">{recap[el][0].gender ? 'L' : 'P'}</th>
                                                <th className="py-2 border border-white">{Math.round(jumlah_hadir_pagi / totalAttendance.pagi * 100) || 0}%</th>
                                                <th className="py-2 border border-white">{Math.round(jumlah_izin_pagi / totalAttendance.pagi * 100) || 0}%</th>
                                                <th className="py-2 border border-white">{Math.round(jumlah_alfa_pagi / totalAttendance.pagi * 100) || 0}%</th>
                                                <th className="py-2 border border-white">{Math.round(jumlah_hadir_malam / totalAttendance.malam * 100) || 0}%</th>
                                                <th className="py-2 border border-white">{Math.round(jumlah_izin_malam / totalAttendance.malam * 100) || 0}%</th>
                                                <th className="py-2 border border-white">{Math.round(jumlah_alfa_malam / totalAttendance.malam * 100) || 0}%</th>
                                                <th className="py-2 border border-white">{Math.round(((jumlah_hadir_pagi + jumlah_hadir_malam) + ((jumlah_izin_pagi + jumlah_izin_malam)/2))/totalAttendance.all * 100 ) || 0}%</th>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </>
            }

        </div>
    );
}

export default RekapPresensi;