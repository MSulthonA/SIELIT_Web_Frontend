import logggo from '../../../assets/logggo.png';
import {Link, useLocation} from 'react-router-dom';
import {useEffect, useState, useRef} from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

type NavbarProps = {
    className?: string
}

function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>, setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: MouseEvent | TouchEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
  
              setIsExpanded(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
  
      document.addEventListener("touchstart", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [ref]);
  }

function Navbar({className}: NavbarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setIsExpanded);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className={`h-20 z-30 flex items-center w-full justify-between px-8 md:px-16 sticky top-0 ${isScrolled ? className : 'bg-transparent'} transition-all ease-in-out duration-300`}>
       <div className="flex items-center">
        <img src={logggo} alt="Logo PPM" className="w-16 mr-3" />
        <div>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-base font-semibold bg-gradient-to-r from-[#13A89D] to-[#C7D021] text-transparent bg-clip-text tracking-wide drop-shadow-md">
              Sistem Smart Electronic Identification
            </p>
        </div>
      </div>
            <RxHamburgerMenu fontSize="28px" className={`xl:hidden ml-8`} onClick={() => { setIsExpanded(prev => !prev) }}/>
            <div className='hidden xl:flex w-3/12 min-w-[460px] text-xl justify-between'>
                <Link to='/beranda' className={`cursor-pointer text-lg ${!(['faq', 'jadwalKelas', 'login'].includes(location.pathname.split('/')[1])) ? 'font-bold' : ''}`}>Beranda</Link>
                <Link to='/jadwalKelas' className={`cursor-pointer text-lg ${location.pathname.split('/')[1] == 'jadwalKelas' ? 'font-bold' : ''}`}>Jadwal Kelas</Link>
                <Link to='/faq' className={`cursor-pointer text-lg ${location.pathname.split('/')[1] == 'faq' ? 'font-bold' : ''}`}>FAQ</Link>
                <Link to='/login' className={`cursor-pointer text-lg ${location.pathname.split('/')[1] == 'login' ? 'font-bold' : ''}`}>login</Link>
            </div>
            <div ref={wrapperRef} className={`${isExpanded ? 'flex' : 'hidden'} text-base justify-between bg-white px-12 py-8 flex-col gap-8 absolute top-24 right-8 shadow-lg rounded-md`}>
                <Link to='/beranda' className={`cursor-pointer ${!(['faq', 'jadwalKelas', 'login'].includes(location.pathname.split('/')[1])) ? 'font-bold' : ''}`} onClick={() => setIsExpanded(false)}>Beranda</Link>
                <Link to='/jadwalKelas' className={`cursor-pointer ${location.pathname.split('/')[1] == 'jadwalKelas' ? 'font-bold' : ''}`} onClick={() => setIsExpanded(false)}>Jadwal Kelas</Link>
                <Link to='/faq' className={`cursor-pointer ${location.pathname.split('/')[1] == 'faq' ? 'font-bold' : ''}`} onClick={() => setIsExpanded(false)}>FAQ</Link>
                <Link to='/login' className={`cursor-pointer ${location.pathname.split('/')[1] == 'login' ? 'font-bold' : ''}`} onClick={() => setIsExpanded(false)}>login</Link>
            </div>

        </nav>
    );
}

export default Navbar;