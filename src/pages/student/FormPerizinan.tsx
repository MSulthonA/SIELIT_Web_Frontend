import { useContext, useEffect, useState } from "react";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import { userContext } from "./Index";
import { AppContext } from "../../AppContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import appSettings from "../../Appsettings";
import PermitCard from "./components/PermitCard";

function formPerizinan() {
    const userData = useContext(userContext);
    const setToken = useContext(AppContext).token.set;
    const token = useContext(AppContext).token.data;

    const formIzinInit = {
        user_id: userData.id,
        class_id: '',
        class_idErr: '',
        description: '',
        descriptionErr: '',
        img: '',
        img_file: ''
    }

    const [formIzin, setFormIzin] = useState(formIzinInit);

    const [classes, setClasses] = useState([]);
    const [leavePermits, setLeavePermits] = useState([]);

    function fetchData(){
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
                    const classes = res.data.map((el: any) => {
                        const label = `${userData.class_name} - ${el.class_name} (${(new Date(el.start_date)).toLocaleString('id').substring(0, 17).replace(/\//g, '-')} s/d ${(new Date(el.end_date)).toLocaleString('id').substring(11, 16).replace(/\//g, '-')})`;
                        return { value: el.class_id, label: label, attend_at: el.attend_at }
                    });
                    console.log(classes);
                    const classFiltered = classes.filter(c => !(c.attend_at));
                    console.log(classFiltered);

                    setClasses(classFiltered)
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

        axios.get(`${appSettings.api}/permits`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.msg) {
                    toast.warn(res.data.msg);
                }
                else {
                    const classes = res.data.map((el: any) => {
                        const label = `${el.class_name} - ${(new Date(el.start_date)).toLocaleString('id').substring(0, 16)}`;
                        return { value: el.class_id, label: label }
                    });
                    setLeavePermits(res.data)
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

    useEffect(() => {
       fetchData();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        if(formIzin.class_id == ''){
            setFormIzin(prev => ({...prev, class_idErr: 'tidak boleh kosong'}));
            return
        }

        if(formIzin.description == ''){
            setFormIzin(prev => ({...prev, descriptionErr: 'tidak boleh kosong'}));
            return;
        }

        if(formIzin.img_file == ''){
            toast.warn('Gambar bukti tidak boleh kosong', {theme: 'colored'});
            return;
        }

        axios.postForm(`${appSettings.api}/permits`, {
            user_id: userData.id,
            class_id: formIzin.class_id,
            description: formIzin.description,
            img_file: formIzin.img_file
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            toast.success(res.data.msg, { theme: 'colored' });
            fetchData();
            setFormIzin(formIzinInit);
            document.querySelector('input[type=file]').value = '';
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
        if (e.target.type == 'file') {
            setFormIzin(prev => { return { ...prev, img: URL.createObjectURL(e.target.files[0]) } });
        }
        setFormIzin(prev => {
            return { ...prev, [e.target.name]: e.target.type == 'file' ? e.target.files[0] : e.target.value, [e.target.name + 'Err']: '' }
        })
    }

    return (
        <div className="w-full flex flex-col items-center min-h-[100svh]">
            <p className="font-bold text-2xl md:text-3xl mb-16">Form <span className="text-themeTeal">Perizinan</span></p>
            <form className="w-full max-w-6xl bg-[#f6f6f6]/50 p-8 shadow-md flex flex-col rounded-xl mb-16" onSubmit={handleSubmit}>
                <SelectInput title='Kelas' name='class_id' value={formIzin.class_id} onChange={handleChange} errorMsg={formIzin.class_idErr} values={classes} />
                <TextInput name='description' value={formIzin.description} title='Alasan' errorMsg={formIzin.descriptionErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                <img src={formIzin.img} alt="" className="max-h-96 w-fit mx-auto" />
                <div className="flex flex-col md:flex-row self-end mt-4">
                    <input type="file" name="img_file" onChange={handleChange} className="block w-full md:w-80 md:border-r-2 pr-4 mr-6 mb-4 md:mb-0 text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-themeTeal file:text-white
                                    file:cursor-pointer" accept=".jpg,.jpeg,.png" />
                    <button type='submit' className='bg-themeTeal text-white font-semibold text-sm px-12 py-2 rounded hover:scale-105 transition-all duration-200'>Submit</button>
                </div>
            </form>
            <div className="flex flex-col items-center w-full">
                <p className="font-bold text-2xl md:text-3xl mb-16 mt-16">Riwayat <span className="text-themeTeal">Perizinan</span></p>
                <div className='hidden last:block text-base text-center mb-24'>
                    Anda belum memiliki riwayat perizinan
                </div>
                {leavePermits.map((el: any, id) => el.nis == userData.nis && <PermitCard key={id} {...el} fetchData={fetchData} />)}
            </div>
        </div>
    );
}

export default formPerizinan;