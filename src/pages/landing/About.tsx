import Footer from "../../components/Footer";
import Navbar from "./compoenents/NavbarLanding";

function About() {
    return (
        <div className="flex flex-col items-center justify-start relative text-lg">
            <Navbar className="bg-themeTeal mb-24" />
            <div className="px-4 text-center">

            
            <p className="font-bold text-xl md:text-3xl mb-16">About <span className="text-themeTeal">Us</span></p>
            <p className="text-xl font-bold text-center mb-6 px-8">SI ELIT (SISTEM SMART ELECTRONIC IDENTIFICATION) PPM BKI</p>
            <p className="text-lg text-center max-w-5xl px-8 mb-16">
                Sistem identifikasi elektronik pintar (smart electronic identification) adalah sistem berbasis teknologi yang menggunakan kartu identifikasi elektronik (RFID) untuk mengidentifikasi dan memverifikasi identitas siswa, guru, dan staff pesantren lainnya. Sistem-sistem ini sering digunakan untuk meningkatkan keamanan, mengelola kehadiran, dan mempercepat proses administrasi
            </p>
            <p className="mb-2">Proyek ini dikerjakan oleh mahasiswa Teknik Komputer, Universitas Diponegoro:</p>
            <ol className="text-center mb-6">
                <li>1. Cahyo Ade Prasetyo</li>
                <li>2. Muhammad Sulthon Auliya (Santri PPM)</li>
                <li>3. Sachiko Fitria Ramadanti (Santri PPM)</li>
            </ol>
            <p className="mb-2">Bersama dengan dosen pembimbing kami:</p>
            <ol className="text-center mb-16">
                <li>1. Eko Didik Widianto, S.T., M.T.</li>
                <li>2. Dania Eridani, S.T., M.Eng.</li>
            </ol>
            <p className="text-lg text-center max-w-5xl px-8 mb-24">
                Proyek ini dikerjakan selama 1 siklus Capstone yang terselesaikan berkisar kurang lebih 1 tahun penuh. Setelah terselesaikannya proyek ini, diharapkan dapat mempermudah presensi dengan mengefisiensikan waktu presensi pada Pondok Pesantren Bina Khoirul Insan Semarang.
            </p>
            </div>
            <Footer />
        </div>
    );
}

export default About;