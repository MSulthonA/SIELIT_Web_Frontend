import axios from "axios";
import TextInput from "../../components/TextInput";
import { useState, useEffect, useContext } from "react";
import appSettings from "../../Appsettings";
import { toast } from "react-toastify";
import { AppContext } from "../../AppContext";
import Swal from "sweetalert2";
import SelectInput from "../../components/SelectInput";
import DateInput from "../../components/DateInput";
import {FiEdit} from 'react-icons/fi';
import { BiSolidTrash } from "react-icons/bi";

function DataAkun() {
    const setToken = useContext(AppContext).token.set;
    const token = useContext(AppContext).token.data;

    const [search, setSearch] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [mode, setMode] = useState<'view' | 'form'>('view');
    const [account, setaccount] = useState<any>({
        id: '',
        name: '',
        card_id: '',
        password: '',
        passwordNew: '',
        birth_date: '',
        grade: '',
        telephone_number: '',
        role:'',
        class_type: '',
        gender: '',
        nis: '',
        is_active: '',
        inactive_reason: '',
        origin: '',
        residence_in_semarang: ''
    });
    const initialaccount = {
        id: '',
        name: '',
        card_id: '',
        password: '',
        passwordNew: '',
        birth_date: '',
        grade: '',
        telephone_number: '',
        role: '',
        class_type: '',
        gender: '',
        nis: '',
        is_active: '',
        inactive_reason: '',
        origin: '',
        residence_in_semarang: ''
    }

    const [classTypes, setClassTypes] = useState<any>([]);

    const genderOptions = [{
        value: '1',
        label: 'Laki-laki'
    }, {
        value: '0',
        label: 'Perempuan'
    }];

    const roleOptions = [{
        value: '2',
        label: 'Guru'
    }, {
        value: '3',
        label: 'Admin'
    }];

    useEffect(() => {
        getAccounts();
        getClassTypes();
    }, []);

    useEffect(() => {
        getAccounts();
        window.scrollTo(0,0);
    }, [mode]);

    function handleSearch(e: any) {
        setSearch(e.target.value);
    }

    function checkSearch(account: any) {
        let searchString = account.name + account.nis + account.class_name + account.grade;

        if (account.gender) {
            searchString += 'Laki-laki';
        } else {
            searchString += 'Perempuan';
        }

        try {
            const re = new RegExp(search.replace(/\\*/, ''), 'i');
            return re.exec(searchString);
        } catch {
            const re = new RegExp('zzzzzzz', 'i');
            return re.exec(searchString);
        }
    }

    function validateaccount() {
        let res = true;
        Object.keys(account).map((key) => {
            if (account[key] === '' && !key.endsWith('Err') && !key.endsWith('New') && ['name', 'role', 'password', 'birth_date', 'telephone_number', 'gender'].includes(key)) {
                res = false;
                setaccount(prev => {
                    return { ...prev, [key + 'Err']: 'tidak boleh kosong' }
                })
            }
        })

        if(!res){
            toast.warn('Mohon isi semua field yang ada', { theme: 'colored' });
        }

        return res;
    }

    function getAccounts() {
        
        axios.get(`${appSettings.api}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const accounts = res.data.filter((el: any) => el.role !== 1);
                setAccounts(accounts);
            })
            .catch(err => {
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
        axios.get(`${appSettings.api}/classes/types`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const classTypes = res.data.map((el: any) => {
                    return {
                        value: el.id,
                        label: el.name
                    }
                });

                setClassTypes(classTypes);
            })
            .catch(err => {
                if (err.response.status === 401) {
                    localStorage.setItem('token', '');
                    setToken('');
                    toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
                } else {
                    toast.error(err, { theme: "colored" })
                }
            })
    }

    function deleteaccount(id: string) {
        Swal.fire({
            title: 'Apakan anda yakin ingin menghapus user?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${appSettings.api}/users?userId=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    toast.success('Berhasil menghapus data santri', { theme: "colored" });
                    getAccounts();
                }).catch(err => {
                    if (err.response.status === 401) {
                        localStorage.setItem('token', '');
                        setToken('');
                        toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
                    } else {
                        toast.error(err, { theme: "colored" })
                    }
                })
            } else if (result.isDenied) {
                return
            }
        });

    }

    function handleSubmit(e: any) {
        e.preventDefault();
        if(!validateaccount()){
            return
        }

        axios.post(`${appSettings.api}/users`, account, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.msg === 'User created.') {
                toast.success(res.data.msg, { theme: 'colored' });
                setaccount(initialaccount);
            }else{
                toast.warn(res.data.msg, { theme: 'colored' });
            }
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

    function toSqlDate(date: string) {
        return date.split('T')[0];
    }

    function handleEdit(e: any) {
        e.preventDefault();
        if(!validateaccount()){
            return
        }

        axios.put(`${appSettings.api}/users`, account, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.msg === 'user updated') {
                toast.success(res.data.msg, { theme: 'colored' });
                setaccount(initialaccount);
                setMode('view');
            }else{
                toast.warn(res.data.msg, { theme: 'colored' });
            }
        }).catch(err => {
            if (err.response.status === 401) {
                localStorage.setItem('token', '');
                setToken('');
            } else {
                toast.error(err.response.data.msg, { theme: "colored" })
            }
        })
    }

    function handleChange(e: any) {
        setaccount(prev => {
            return { ...prev, [e.target.name]: e.target.type == 'file' ? e.target.files[0] : e.target.value, [e.target.name + 'Err']: '' }
        })
    }

    return (
        <div className="min-h-[100svh] flex flex-col items-center justify-start py-16 grow px-20">
            <p className="font-bold text-xl md:text-3xl mb-16">{mode === 'form' ? account.id ? 'Edit' : 'Tambah' : ''} Data <span className="text-themeTeal">Akun</span></p>
            {
                mode === 'form' ?
                <form className="w-full max-w-6xl bg-[#f6f6f6]/50 p-8 shadow-md flex flex-col rounded-xl mb-16" onSubmit={(e) => {
                    if(account.id){
                        handleEdit(e);
                    }
                    else{
                        handleSubmit(e);
                    }
                } }>
                        <TextInput name='name' value={account.name} title='Nama' errorMsg={account.nameErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <SelectInput title='Role' name='role' value={account.role} onChange={handleChange} errorMsg={account.roleErr} values={roleOptions} />
                        <TextInput name={account.id ? 'passwordNew' : 'password'} value={account.id ? account.passwordNew : account.password} title={account.id ? 'Password baru (opsional)' : 'password'} errorMsg={account.id ? account.passwordNewErr : account.passwordErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <DateInput name='birth_date' value={account.birth_date} title='Tanggal lahir' errorMsg={account.birth_dateErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <TextInput name='telephone_number' value={account.telephone_number} title='Nomor telepon' errorMsg={account.telephone_numberErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <SelectInput title='Gender' name='gender' value={account.gender} onChange={handleChange} errorMsg={account.genderErr} values={genderOptions} />
                        <TextInput name='residence_in_semarang' value={account.residence_in_semarang} title='Tempat tinggal di Semarang' errorMsg={account.residence_in_semarangErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <div className="self-end justify-between flex">
                        <button type="button" className="bg-[#d9d9d9] px-12 py-2 rounded mr-8 hover:scale-[1.03] font-semibold text-sm" onClick={() => {
                            setaccount(initialaccount);
                            setMode('view');
                        }}>Batal</button>
                        <button type='submit' className='bg-themeTeal text-white font-semibold text-sm px-12 py-2 rounded hover:scale-[1.03] transition-all duration-200'>Submit</button>
                        </div>
                    </form>
                    :
                    <>
                        <div className="w-full flex items-center justify-between mb-8">
                            <TextInput name="search" title="🔎 masukkan kata kunci" errorMsg="" onChange={handleSearch} className="w-full max-w-lg" inputClassName="bg-white" value={search} />
                            <button className="bg-themeTeal text-white font-bold px-4 py-2 rounded-lg text-sm" onClick={() => setMode('form')}>Tambah Data</button>
                        </div>
                        <div className="rounded-lg overflow-x-hidden overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
                            <table className="w-full h-12 text-center text-sm">
                                <thead className="bg-themeTeal text-white sticky top-0">
                                    <tr>
                                        <th className="pl-6 py-2">Nama</th>
                                        <th className="pl-6 py-2">Role</th>
                                        <th className="pl-6 py-2">Nomor Telepon</th>
                                        <th className="pl-6 py-2">Jenis Kelamin</th>
                                        <th className="px-6 py-2">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        accounts.map((account: any, index) => {
                                            return (
                                                checkSearch(account) &&
                                                <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                                                    <td className="pl-6 py-2">{account.name}</td>
                                                    <td className="pl-6 py-2">{account.role == 2 ? 'Guru' : 'Admin' }</td>
                                                    <td className="pl-6 py-2">{account.telephone_number}</td>
                                                    <td className="pl-6 py-2">{account.gender ? 'Laki-laki' : 'Perempuan'}</td>
                                                    <td className="px-6 py-2">
                                                        <button className="bg-themeOrange text-white px-2 py-1 rounded mr-2" onClick={
                                                            () => {
                                                                setaccount({...initialaccount, ...account, birth_date: toSqlDate(account.birth_date)})
                                                                setMode('form');
                                                            }
                                                        }>
                                                           <FiEdit/>
                                                        </button>
                                                        <button className="bg-themeRed text-white px-2 py-1 rounded" onClick={() => { deleteaccount(account.id) }}>
                                                            <BiSolidTrash/>
                                                        </button>
                                                    </td>
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

export default DataAkun;