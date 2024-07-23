import { useState, useContext } from "react";
import Footer from "../../components/Footer";
import Navbar from "./compoenents/NavbarLanding";
import TextInput from "../../components/TextInput";
import PasswordInput from "../../components/PasswordInput";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { AppContext } from "../../AppContext";
import CustomAxios from "../../components/Axios";
import appSettings from "../../Appsettings";
import axios from 'axios';

function Login() {
  const setToken = useContext(AppContext).token.set;

  const [loginData, setLoginData] = useState({
    name: '',
    nameErr: '',
    password: '',
    passwordErr: ''
  });

  function login(e: any) {
    e.preventDefault();
    if (!loginData.name || !loginData.password) {
      if (!loginData.name) setLoginData(prev => ({ ...prev, nameErr: 'tidak boleh kosong' }));
      if (!loginData.password) setLoginData(prev => ({ ...prev, passwordErr: 'tidak boleh kosong' }));
    } else {
      axios.post(`${appSettings.api}/auth/login`,
        {
          name: loginData.name,
          password: loginData.password
        }
      ).then((res: any) => {
        if (res.data.accessToken) {
          localStorage.setItem('token', res.data.accessToken);
          setToken(res.data.accessToken);
        } else {
          toast.warn(res.data.msg, { theme: "colored" })
        }
      }).catch((err: any) => {
        if (err.response.status === 401) {
          localStorage.setItem('token', '');
          setToken('');
        } else {
          toast.error(err, { theme: "colored" })
        }
      })
    }
  }

  function handleChange(e: any) {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value, [`${e.target.name}Err`]: '' }));
  }

  return (
    <div className="flex flex-col items-center justify-start relative text-lg">
      <Navbar className="bg-themeTeal mb-24" />
      <div className="bg-white mb-24">
        <div className="border-b-2 py-12 px-24 flex flex-col items-center">
          <p className=' font-bold text-lg md:text-2xl mb-2'>SI ELIT</p>
          <p className='italic font-light text-center mb-1 md:mb-0'>Sistem Smart Electronic Identification</p>
          <p className='font-light text-sm md:text-lg text-center'>Pondok Pesantren Bina Khoirul Insan Semarang</p>
        </div>
        <form onSubmit={login} className="py-12 w-10/12 flex flex-col items-center mx-auto">
          <TextInput name="name" title="Username" errorMsg={loginData.nameErr} value={loginData.name} onChange={handleChange} className="mb-4 w-full" />
          <PasswordInput name="password" title="Password" errorMsg={loginData.passwordErr} value={loginData.password} onChange={handleChange} className="w-full" />
          <button className="w-full bg-themeTeal py-3 rounded-md">Login</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Login;