import Footer from "../../components/Footer";
import Navbar from "./compoenents/NavbarLanding";
import Hero from '../../assets/hero.png';
import icon_calendar from '../../assets/icon_calendar.svg';
import icon_faq from '../../assets/icon_faq.svg';
import icon_us from '../../assets/icon_us.png';
import { Link } from 'react-router-dom';

function Beranda() {

    return (
        <div className="flex flex-col items-center justify-start relative">
            <Navbar className="bg-themeTeal/20 items-center" />
            <img src={Hero} alt="Tampak depan PPM" className="-mt-28 mb-12 w-full h-96 md:h-auto max-h-[65svh] object-cover -z-20 relative" />
            <p className="mb-12">
                <span className="text-outline text-xl md:text-3xl text-themeYellow font-bold mr-2">Presensi Otomatis</span>
                <span className="font-bold text-xl md:text-3xl">PPMBKI</span>
            </p>
            <div className="flex flex-col lg:flex-row gap-10 justify-between mb-24">
                <Link to='/about'>
                    <div className="flex items-center w-80 h-32 justify-around py-4 px-7 bg-themeTeal/20 rounded-xl shadow-md">
                        <img src={icon_us} alt="" className="w-28 h-full" />
                        <p className="font-bold text-xl">TENTANG</p>
                    </div>
                </Link>
                <Link to='/faq'>
                    <div className="flex items-center w-80 h-32 justify-around py-4 px-7 bg-themeTeal/20 rounded-xl shadow-md">
                        <img src={icon_faq} alt="" className="w-28 h-full" />
                        <p className="font-bold text-xl">FAQ</p>
                    </div>
                </Link>
                <Link to='/jadwalKelas'>
                    <div className="flex items-center w-80 h-32 justify-around py-4 px-7 bg-themeTeal/20 rounded-xl shadow-md">
                        <img src={icon_calendar} alt="" className="w-28 h-full" />
                        <p className="font-bold text-xl">JADWAL KELAS</p>
                    </div>
                </Link>
            </div>
            <p className="text-xl font-bold text-center mb-6 px-8">SI ELIT (SISTEM SMART ELECTRONIC IDENTIFICATION) PPM BKI</p>
            <p className="text-lg text-center max-w-5xl px-8 mb-24">
                Sistem identifikasi elektronik pintar (smart electronic identification) adalah sistem berbasis teknologi yang menggunakan kartu identifikasi elektronik (RFID) untuk mengidentifikasi dan memverifikasi identitas siswa, guru, dan staff pesantren lainnya. Sistem-sistem ini sering digunakan untuk meningkatkan keamanan, mengelola kehadiran, dan mempercepat proses administrasi</p>
            <Footer />
        </div>
    );
}

export default Beranda;