import Footer from "../../components/Footer";
import Navbar from "./compoenents/NavbarLanding";
import {useState} from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'

function Faq() {

    return (
        <div className="flex flex-col items-center min-h-[100svh]">
            <Navbar className="bg-white shadow-md mb-24"/>
            <p className="font-bold text-2xl md:text-4xl mb-12">Frequently<span className=" text-[#13A89D]"> Asked Questions</span></p>
            <div className=" w-10/12 md:w-8/12 flex flex-col gap-8 mb-24">
                <FaqCard 
                title='SI ELIT'
                content='Sistem identifikasi elektronik pintar (smart electronic identification) adalah sistem berbasis teknologi yang menggunakan kartu identifikasi elektronik (RFID) untuk mengidentifikasi dan memverifikasi identitas siswa, guru, dan staff pesantren lainnya. Sistem-sistem ini sering digunakan untuk meningkatkan keamanan, mengelola kehadiran.
                Proyek ini dikerjakan oleh mahasiswa Teknik Komputer, Universitas Diponegoro:
                Cahyo Ade Prasetyo,
                Muhammad Sulthon Auliya (Santri PPM), dan
                Sachiko Fitria Ramandanti (Santri PPM)'
                />
                <FaqCard 
                title='GAGAL LOGIN'
                content='Apabila Anda mengalami kendala atau kegagalan saat Login Akun maka silakan hubungi Operator guna menyelesaikan permasalahan'
                />
                <FaqCard 
                title='GAGAL PRESENSI'
                content='Apabila Anda mengalami masalah atau kegagalan presensi silakan hubungi Operator Kelas guna membantu presensi melalui Bypass Presensi'
                />
                <FaqCard 
                title='PERIZINAN'
                content='Apabila peminjam terlambat mengembalikan buku, maka akan dikenai denda yang ditentukan oleh 
                atasan langsung perpustakaan atau sekurang-kurangnya pejabat eselon III.
                
                Peminjam yang belum mengembalikan pinjamannya tidak diperkenankan untuk melakukan peminjaman lagi, sampai dikembalikannya koleksi tersebut dan denda harus dibayar lunas.'
                />
            </div>
            <Footer />
        </div>
    );
}

function FaqCard({title, content}: any){
    const [isExpanded, setIsExpanded] = useState(false);

    return(
        <div className="w-full bg-[#192B1F]/10 py-5 px-8 rounded-xl" onClick={() => setIsExpanded(prev => !prev)}>
            <div className={`flex justify-between items-center ${isExpanded? 'mb-4' : ''} transition-all duration-200`}>
                <p className="font-bold text-lg">{title}</p>
                <MdOutlineKeyboardArrowDown 
                className={`text-3xl ${ isExpanded ? 'rotate-180': ''} transition-all duration-200`}
                />
            </div>
            {isExpanded && <p>{content}</p>}
        </div>
    )
}

export default Faq;