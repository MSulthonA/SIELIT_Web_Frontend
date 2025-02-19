import Logo from '../../../assets/logo.png';

import { useContext} from 'react';
import { BiLogOut } from 'react-icons/bi';
import { AppContext } from '../../../AppContext';
import Swal from 'sweetalert2'
import { userContext } from '../Index';

type NavbarProps = {
    className?: string
}


function Navbar({ className }: NavbarProps) {
    const setToken = useContext(AppContext).token.set;
    const userName = useContext(userContext).name;


    function logout() {
        Swal.fire({
            title: 'Apakan anda yakin ingin logout?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: '#d33'
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                setToken('');
                window.location.href = '/';
            } else if (result.isDenied) {
              return
            }
          });
    }

    return (
        <nav className={`h-18  8 z-30 flex items-center w-full shadow justify-between px-8 md:px-16 sticky top-0 ${className}`}>
            <div className='flex items-center'>
                <img src={Logo} alt="Logo PPM" className='w-11 mr-3' />
                <div>
                    <p className='text-green-500 font-bold text-2xl md:text2xl'>SI ELIT</p>
                    <p className='text-sm md:text-base'>Pondok Pesantren Bina Khoirul Insan</p>
                </div>
            </div>
            <div className='flex w-4/12 min-w-[100px] text-lg justify-end items-center'>
                <div className="flex flex-row rounded hover:bg-milkyWhite items-center">
                    <div className='w-10 h-10 mr-3 rounded-full bg-green-500 flex items-center justify-center overflow-hidden'>
                        <p>{userName[0]}</p>
                        {/* <img src="path/to/profile-image.jpg" alt="Profile" className='w-full h-full object-cover' /> */}
                    </div>
                    <p className='font-semibold '>{userName}</p>
                </div>
                {/* <BiLogOut className='cursor-pointer' fontSize="28px" onClick={logout}/> */}
            </div>
        </nav>
    );
}

export default Navbar;