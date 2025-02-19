/* eslint-disable @typescript-eslint/no-explicit-any */
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

function DataSantri() {
    const setToken = useContext(AppContext).token.set;
    const token = useContext(AppContext).token.data;

    const [search, setSearch] = useState('');
    const [students, setStudents] = useState([]);
    const [mode, setMode] = useState<'view' | 'form'>('view');
    const [student, setStudent] = useState<any>({
        id: '',
        name: '',
        card_id: '',
        password: '',
        passwordNew: '',
        birth_date: '',
        grade: '',
        telephone_number: '',
        role: 1,
        class_type: '',
        gender: '',
        nis: '',
        is_active: '',
        inactive_reason: '',
        origin: '',
        residence_in_semarang: ''
    });

    const initialStudent = {
        id: '',
        name: '',
        card_id: '',
        password: '',
        passwordNew: '',
        birth_date: '',
        grade: '',
        telephone_number: '',
        role: 1,
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

    useEffect(() => {
        getStudents();
        getClassTypes();
    }, []);

    useEffect(() => {
        getStudents();
        window.scrollTo(0,0);
    }, [mode]);

    function handleSearch(e: any) {
        setSearch(e.target.value);
    }

    function checkSearch(student: any) {
        let searchString = student.name + student.nis + student.class_name + student.grade;

        if (student.gender) {
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

    function validateStudent() {
        let res = true;
        Object.keys(student).map((key) => {
            if (student[key] === '' && !key.endsWith('Err') && !key.endsWith('New') && key !== 'id' && key !== 'inactive_reason') {
                res = false;
                setStudent(prev => {
                    return { ...prev, [key + 'Err']: 'tidak boleh kosong' }
                })
            }
        })

        const re = new RegExp(/\b[0-9A-F]{8}\b/gi);
        if(!re.exec(student.card_id)){
            res = false;
            setStudent(prev => {
                return { ...prev, card_idErr: 'harus berupa 8 digit hexadecimal' }
            })
        }

        if(!res){
            toast.warn('Mohon isi semua field yang ada', { theme: 'colored' });
        }

        return res;
    }

    function getStudents() {
        
        axios.get(`${appSettings.api}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const students = res.data.filter((el: any) => el.role === 1);
                setStudents(students);
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

    function deleteStudent(id: string) {
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
                    getStudents();
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
        if(!validateStudent()){
            return
        }

        axios.post(`${appSettings.api}/users`, student, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.msg === 'User created.') {
                toast.success(res.data.msg, { theme: 'colored' });
                setStudent(initialStudent);
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
        if(!validateStudent()){
            return
        }

        axios.put(`${appSettings.api}/users`, student, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.msg === 'user updated') {
                toast.success(res.data.msg, { theme: 'colored' });
                setStudent(initialStudent);
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
        setStudent(prev => {
            return { ...prev, [e.target.name]: e.target.type == 'file' ? e.target.files[0] : e.target.value, [e.target.name + 'Err']: '' }
        })
    }

    return (
        <div className="min-h-[100svh] flex flex-col items-center justify-start pt-4 pb-16 grow px-20 overflow-x-scroll">
            <p className="font-bold text-xl md:text-3xl mb-6">{mode === 'form' ? student.id ? 'Edit' : 'Tambah' : ''} Data Santri</p>
            {
                mode === 'form' ?
                <form className="w-full max-w-6xl bg-[#f6f6f6]/50 p-8 shadow-md flex flex-col rounded-xl mb-16" onSubmit={(e) => {
                    if(student.id){
                        handleEdit(e);
                    }
                    else{
                        handleSubmit(e);
                    }
                } }>
                        <TextInput 
                        name='name' 
                        value={student.name} 
                        title='Nama' 
                        errorMsg={student.nameErr} 
                        onChange={handleChange} 
                        inputClassName="bg-white" 
                        className="mb-8" />

                        <TextInput name='card_id' value={student.card_id} title='Card Id' errorMsg={student.card_idErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <TextInput name={student.id ? 'passwordNew' : 'password'} value={student.id ? student.passwordNew : student.password} title={student.id ? 'Password baru (opsional)' : 'password'} errorMsg={student.id ? student.passwordNewErr : student.passwordErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <DateInput name='birth_date' value={student.birth_date} title='Tanggal lahir' errorMsg={student.birth_dateErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <TextInput name='grade' value={student.grade} title='Angkatan' errorMsg={student.gradeErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <TextInput name='telephone_number' value={student.telephone_number} title='Nomor telepon' errorMsg={student.telephone_numberErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <SelectInput title='Tipe Kelas' name='class_type' value={student.class_type} onChange={handleChange} errorMsg={student.class_typeErr} values={classTypes} />
                        <SelectInput title='Gender' name='gender' value={student.gender} onChange={handleChange} errorMsg={student.genderErr} values={genderOptions} />
                        <TextInput name='nis' value={student.nis} title='NIS (Nomor Induk Santri)' errorMsg={student.nisErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <TextInput name='origin' value={student.origin} title='Tempat asal' errorMsg={student.originErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <TextInput name='residence_in_semarang' value={student.residence_in_semarang} title='Tempat tinggal di Semarang' errorMsg={student.residence_in_semarangErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <SelectInput title='Santri Aktif?' name='is_active' value={student.is_active} onChange={handleChange} errorMsg={student.is_activeErr} values={[{ value: '1', label:'Ya'},{ value: '0', label: 'Tidak'}]} />
                        {
                            student.is_active == '0' &&
                            <TextInput name='inactive_reason' value={student.inactive_reason} title='Alasan tidak aktif' errorMsg={student.inactive_reasonErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        }
                        <div className="justify-center items-center flex flex-col md:flex-row">
                        <button type="button" className="bg-[#d9d9d9] px-12 py-2 rounded mx-2 mb-4 hover:scale-[1.03] font-semibold text-sm" onClick={() => {
                            setStudent(initialStudent);
                            setMode('view');
                        }}>Batal</button>
                        <button type='submit' className='bg-themeTeal text-white font-semibold text-sm px-12 py-2 mb-4 mx-2 rounded hover:scale-[1.03] transition-all duration-200'>Submit</button>
                        </div>
                    </form>
                    :
                    <>
                        <div className="w-full flex flex-col md:flex-row items-center align-middle justify-between mb-8">
                            <TextInput name="search" title="🔎 masukkan kata kunci" errorMsg="" onChange={handleSearch} className="w-80 max-w-lg mb-6" inputClassName="bg-white" value={search} />
                            <button className="bg-themeTeal text-white font-bold px-4 py-2 rounded-lg text-sm" onClick={() => setMode('form')}>Tambah Data</button>
                        </div>
                        <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
                            <table className="w-full h-12 text-center text-sm">
                                <thead className="bg-themeTeal text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 items-center">No.</th>
                                        <th className="px-3 py-2 items-center">NIS <br /> (Nomor Induk Santri)</th>
                                        <th className="px-3 py-2 items-center">Nama</th>
                                        <th className="px-3 py-2 items-center">Kelas</th>
                                        <th className="px-3 py-2 items-center">Angkatan</th>
                                        <th className="px-3 py-2 items-center">Jenis Kelamin</th>
                                        <th className="px-3 py-2 items-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        students.map((student: any, index) => {
                                            return (
                                                checkSearch(student) &&
                                                <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                                                    <td className="px-3 py-2 items-center">{index + 1}</td>
                                                    <td className="px-3 py-2 items-center">{student.nis}</td>
                                                    <td className="px-3 py-2 items-center">{student.name}</td>
                                                    <td className="px-3 py-2 items-center">{student.class_name}</td>
                                                    <td className="px-3 py-2 items-center">{student.grade}</td>
                                                    <td className="px-3 py-2 items-center">{student.gender ? 'Laki-laki' : 'Perempuan'}</td>
                                                    <td className="px-3 py-2 items-center">
                                                        <button className="bg-themeOrange text-white px-2 py-1 rounded mr-2" onClick={
                                                            () => {
                                                                setStudent({...initialStudent, ...student, birth_date: toSqlDate(student.birth_date)})
                                                                setMode('form');
                                                            }
                                                        }>
                                                           <FiEdit/>
                                                        </button>
                                                        <button className="bg-themeRed text-white px-2 py-1 rounded" onClick={() => { deleteStudent(student.id) }}>
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

export default DataSantri;