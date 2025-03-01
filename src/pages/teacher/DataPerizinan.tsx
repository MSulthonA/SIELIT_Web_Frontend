import axios from "axios";
import { useState, useEffect, useContext } from "react";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";
import TextInput from "../../components/TextInput";
import { toast } from "react-toastify";
import { BiSolidTrash } from "react-icons/bi";
import Swal from "sweetalert2";
import DateInput from "../../components/DateInput";
import {BsCheckCircle} from 'react-icons/bs';

function DataPerizinan() {
    const [permits, setPermits] = useState<any[]>([]);
    const [search, setSearch] = useState({ string: '', startDate: '', endDate: '' });
    const token = useContext(AppContext).token.data;
    const setToken = useContext(AppContext).token.set;

    useEffect(() => {
        getPermits();
    }, []);

    function handleSearch(e: any) {
        setSearch(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function checkSearch(permit: any) {
        let searchString = permit.name + permit.nis + permit.class_name + permit.description;

        try {
            const re = new RegExp(search.string.replace(/\\*/, ''), 'i');
            return re.exec(searchString);
        } catch {
            const re = new RegExp('zzzzzzz', 'i');
            return re.exec(searchString);
        }
    }

    function getPermits() {
        axios.get(`${appSettings.api}/permits?startDate=${search.startDate}&endDate=${search.endDate}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            setPermits(res.data);
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

    function approvePermit(permit) {
        Swal.fire({
            title: 'Apakan anda yakin ingin menyetujui izin?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`${appSettings.api}/permits`, {...permit, isApproved: 1}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    toast.success(res.data.msg, { theme: "colored" });
                    getPermits();
                })
            } else if (result.isDenied) {
                return
            }
        });
        
    }

    function deletePermit(user_id: number, class_id: number) {
        Swal.fire({
            title: 'Apakan anda yakin ingin menghapus data?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${appSettings.api}/permits?userId=${user_id}&classId=${class_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    getPermits();
                })
            } else if (result.isDenied) {
                return
            }
        });
    }

    return (
        <div className="min-h-[100svh] flex flex-col items-center justify-start py-16 grow px-12 overflow-x-scroll">
            <p className="font-bold text-xl md:text-3xl mb-16">Data <span className="text-themeTeal">Perizinan</span></p>
            <div className="w-full flex flex-col md:flex-row justify-between mb-4">
                <TextInput name="string" title="🔎 masukkan kata kunci" errorMsg="" onChange={handleSearch} className="w-full max-w-md" inputClassName="bg-white" value={search.string} />
                <DateInput name="startDate" title="dari" errorMsg="" onChange={handleSearch} className="" inputClassName="bg-white" value={search.startDate} />
                <DateInput name="endDate" title="sampai" errorMsg="" onChange={handleSearch} className="" inputClassName="bg-white" value={search.endDate} />
                <button className="bg-themeTeal text-white text-sm font-semibold px-4 py-2 mt-3 h-fit rounded" onClick={getPermits}>Terapkan filter</button>
            </div>
            <div className="rounded-lg overflow-x-hidden overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
                <table className="w-full h-12 text-center">
                    <thead className="bg-themeTeal text-white sticky top-0 text-sm">
                        <tr>
                            <th className="pl-6 py-2">No</th>
                            <th className="py-2">NIS</th>
                            <th className="py-2">Nama</th>
                            <th className="py-2">Kelas</th>
                            <th className="py-2 hidden md:table-cell">Pengajian</th>
                            <th className="py-2 hidden md:table-cell">Tanggal</th>
                            <th className="py-2">Alasan</th>
                            <th className="py-2">Bukti</th>
                            <th className="py-2 hidden md:table-cell">Status</th>
                            <th className="pr-6 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {
                            permits.map((permit: any, index) => {
                                const startDate = new Date(permit.start_date);
                                return (
                                    checkSearch(permit) &&
                                    <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                                        <td className="pl-6 py-2">{index + 1}</td>
                                        <td className="py-2">{permit.nis}</td>
                                        <td className="py-2">{permit.name.length > 24 ? permit.name.substring(0, 24) + '...' : permit.name}</td>
                                        <td className="py-2">{permit.class_type}</td>
                                        <td className="py-2 hidden md:table-cell">{startDate.getHours() > 13 ? startDate.getHours() > 18 ? 'Malam' : 'Sore' : 'Pagi'}</td>
                                        <td className="py-2 hidden md:table-cell">{startDate.toLocaleString('id').replace(/\//g, '-').replace(',', '')}</td>
                                        <td>{permit.description}</td>
                                        <td>
                                            <a href={`${appSettings.api}${permit.img_url}`} target="_blank" rel="noreferrer noopener">
                                            <button className="bg-themeTeal text-white px-2 py-1 rounded">
                                                Lihat bukti
                                            </button>
                                            </a>
                                        </td>
                                        <td className={`${permit.is_approved ? 'text-themeTeal' : 'text-themeRed'} font-semibold`}>{permit.is_approved ? 'Disetujui' : 'Belum disetujui'}</td>
                                        <td className="pr-6 py-2 flex flex-wrap gap-2 items-center justify-center">
                                            {!permit.is_approved && <button className="bg-themeTeal text-white px-2 py-1 rounded" onClick={() => {
                                                approvePermit(permit)
                                            }}>
                                                <BsCheckCircle />
                                            </button>}
                                            <button className="bg-themeRed text-white px-2 py-1 rounded" onClick={() => {
                                                deletePermit(permit.user_id, permit.class_id)
                                            }}>
                                                <BiSolidTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default DataPerizinan;


{

}