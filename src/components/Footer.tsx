import logo from '../assets/logo.png';
import map from '../assets/map.png';
import { FaYoutube } from 'react-icons/fa';
import { BiLogoInstagramAlt } from 'react-icons/bi';
import { BsFacebook } from 'react-icons/bs';

function Footer() {
    return (
        <footer className='w-full py-8 px-12 bg-themeTeal sticky top-0'>
            <div className='flex flex-col items-center border-themeYellow border-b-2 pb-8 mb-8'>
                <img src={logo} alt="logo ppm" className='w-14' />
                <p className='text-themeYellow font-bold text-base md:text-xl text-outline mb-2'>SI ELIT</p>
                <p className='italic font-bold text-lg md:text-2xl text-center mb-1 md:mb-0'>Sistem Smart Electronic Identification</p>
                <p className='font-light text-sm md:text-lg text-center'>Pondok Pesantren Bina Khoirul Insan Semarang</p>
            </div>
            <div className='flex flex-col xl:flex-row gap-8 md:gap-20 md:w-10/12 mx-auto'>
                <div>
                    <p className='font-bold mb-4 md:text-xl'>Kantor Kami</p>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.659044817672!2d110.41786237484689!3d-7.049291569075571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708bf981dc5289%3A0x648b79f844753a3c!2sPondok%20Pesantren%20Mahasiswa%20%22PPM%22%20Bina%20Khoirul%20Insan%20(LDII)!5e0!3m2!1sen!2sid!4v1695881104198!5m2!1sen!2sid" width="300" height="300" style={{border:0}} loading="lazy"></iframe>
                </div>
                <div>
                    <p className='font-bold mb-2 md:text-xl'>Kontak</p>
                    <p className='mb-1 md:text-lg'>Alamat: Jl. Ngesrep Timur V no 8, Sumurboto, Banyumanik, Semarang, Jawa Tengah 50269</p>
                    <p className=' md:text-lg'>Website: <a href="https://ppmbki.com/" target='_blank'>https://ppmbki.com/</a></p>
                </div>
                <div >
                    <p className='font-bold mb-4 md:text-xl'>Media Sosial</p>
                    <div className='flex gap-4 text-2xl'>
                        <div className='p-2 bg-white rounded-full flex items-center justify-center'>
                            <BsFacebook />
                        </div>
                        <div className='p-2 bg-white rounded-full flex items-center justify-center'>
                            <BiLogoInstagramAlt />
                        </div>
                        <div className='p-2 bg-white rounded-full flex items-center justify-center'>
                            <FaYoutube />
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;