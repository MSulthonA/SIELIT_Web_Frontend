import { useContext, useEffect, useState } from "react";
import TextInput from "../../components/TextInput";
import { userContext } from "./Index";
import { AppContext } from "../../AppContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import appSettings from "../../Appsettings";
import PasswordInput from "../../components/PasswordInput";
import jwt from "jwt-decode";

function EditProfil() {
    const userData = useContext(userContext);
    const setToken = useContext(AppContext).token.set;
    const token = useContext(AppContext).token.data;
 
    const [userDataForm, setUserDataForm] = useState({
        ...userData,
        password: '',
        nameErr: '',
        passwordErr: '',
        telephone_numberErr: '',
        residence_in_semarangErr: '',
        passwordNew: '',
        passwordNewConfirm: '',
        passwordNewErr: '',
        passwordNewConfirmErr: ''
    });

    function reLogin() {
        axios.post(`${appSettings.api}/auth/login`,
            {
                name: userDataForm.name,
                password: userDataForm.passwordNew || userDataForm.password
            }
        ).then((res: any) => {
            if (res.data.accessToken) {
                localStorage.setItem('token', res.data.accessToken);
                setToken(res.data.accessToken);
                let newUserData = userData;
                try {
                    newUserData = jwt(res.data.accessToken)
                } catch (err) { 
                }
                setUserDataForm({
                    ...newUserData,
                    password: '',
                    nameErr: '',
                    passwordErr: '',
                    telephone_numberErr: '',
                    residence_in_semarangErr: '',
                    passwordNew: '',
                    passwordNewConfirm: '',
                    passwordNewErr: '',
                    passwordNewConfirmErr: ''
                });
            } else {
                toast.warn(res.data.msg, { theme: "colored" })
            }
        }).catch((err: any) => {
            toast.error(err, { theme: "colored" })
        })
    }


    function handleSubmit(e) {
        e.preventDefault();

        if (userDataForm.password == '') {
            setUserDataForm(prev => ({ ...prev, passwordErr: 'tidak boleh kosong' }));
            return
        }

        if (userDataForm.passwordNewConfirm != userDataForm.passwordNew) {
            setUserDataForm(prev => ({ ...prev, passwordNewConfirmErr: 'tidak sama' }));
            return
        }

        if (userDataForm.telephone_number == '') {
            setUserDataForm(prev => ({ ...prev, telephone_numberErr: 'tidak boleh kosong' }));
            return;
        }

        if (userDataForm.residence_in_semarang == '') {
            setUserDataForm(prev => ({ ...prev, residence_in_semarangErr: 'tidak boleh kosong' }));
            return;
        }

        axios.put(`${appSettings.api}/users`, userDataForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.msg === 'user updated') {
                toast.success(res.data.msg, { theme: 'colored' });
                reLogin();
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
        setUserDataForm(prev => {
            return { ...prev, [e.target.name]: e.target.type == 'file' ? e.target.files[0] : e.target.value, [e.target.name + 'Err']: '' }
        })
    }

    return (
        <div className="w-full flex flex-col items-center min-h-[100svh]">
            <p className="font-bold text-2xl md:text-3xl mb-16">Edit <span className="text-themeTeal">Profil</span></p>
            <form className="w-full max-w-6xl bg-[#f6f6f6]/50 p-8 shadow-md flex flex-col rounded-xl mb-16" onSubmit={handleSubmit}>
                <TextInput name='name' value={userDataForm.name} title='name' errorMsg={userDataForm.nameErr} onChange={handleChange} inputClassName="bg-white" className="mb-8 pointer pointer-events-none grayscale contrast-[.90]" />
                <TextInput name='telephone_number' value={userDataForm.telephone_number} title='Nomor Telepon' errorMsg={userDataForm.telephone_numberErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                <TextInput name='residence_in_semarang' value={userDataForm.residence_in_semarang} title='Tempat tinggal di Semarang' errorMsg={userDataForm.residence_in_semarangErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                <PasswordInput name='password' value={userDataForm.password} title='Password lama' errorMsg={userDataForm.passwordErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                <PasswordInput name='passwordNew' value={userDataForm.passwordNew} title='Password baru (opsional)' errorMsg={userDataForm.passwordNewErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                <PasswordInput name='passwordNewConfirm' value={userDataForm.passwordNewConfirm} title='Konfirmasi password baru (opsional)' errorMsg={userDataForm.passwordNewConfirmErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                <button type='submit' className='bg-themeTeal text-white font-semibold text-sm px-12 py-2 rounded hover:scale-[1.01] transition-all duration-200'>Submit</button>
            </form>
        </div>
    );
}

export default EditProfil;