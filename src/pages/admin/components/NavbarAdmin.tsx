import Logo from '../../../assets/logo.png';
import React, { useState, useContext, useRef, useEffect } from 'react';
// import { BiLogOut } from 'react-icons/bi';
import { AppContext } from '../../../AppContext';
import Swal from 'sweetalert2';
import { userContext } from '../Index';

type NavbarProps = {
    className?: string
}

function Navbar({ className }: NavbarProps) {
    const setToken = useContext(AppContext).token.set;
    const userName = useContext(userContext).name;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                return;
            }
        });
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className={`h-20 z-30 flex items-center w-full shadow   justify-between px-8 md:px-16 sticky top-0 ${className}`}>
            <div className='flex items-center'>
                <img src={Logo} alt="Logo PPM" className='w-11 mr-3' />
                <div>
                    <p className='text-themeTeal font-bold text-2xl md:text2xl'>SI ELIT</p>
                    <p className='text-sm md:text-base'>Pondok Pesantren Bina Khoirul Insan</p>
                </div>
            </div>
            <div className='flex w-4/12 min-w-[100px] text-lg justify-end items-center'>
                <div className="relative flex flex-row rounded-xl hover:bg-themeGreen px-2 py-1.5 cursor-pointer items-center" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <div className='w-10 h-10 mr-3 rounded-full bg-green-500 flex items-center justify-center overflow-hidden'>
                        <p>{userName[0]}</p>
                    </div>
                    <p className='font-semibold '>{userName}</p>
                    {dropdownOpen && (
                        <div ref={dropdownRef} className="absolute right-0 bottom--8 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                            <a href="/edit-profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Edit Profile</a>
                            <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</button>
                        </div>
                    )}
                </div>
                {/* <BiLogOut className='cursor-pointer' fontSize="28px" onClick={logout}/> */}
            </div>
        </nav>
    );
}

export default Navbar;