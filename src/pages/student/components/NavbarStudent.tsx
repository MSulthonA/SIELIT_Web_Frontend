import logggo from "../../../assets/logggo.png";
import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoLogOut } from "react-icons/io5";
import { AppContext } from "../../../AppContext";
import Swal from "sweetalert2";
import React, { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, isExpanded, setIsExpanded) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
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

type NavbarProps = {
  className?: string;
  manageClass?: boolean;
};

function Navbar({ className, manageClass }: NavbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const setToken = useContext(AppContext).token.set;
  const location = useLocation();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, isExpanded, setIsExpanded);
  console.log(manageClass);

  function logout() {
    Swal.fire({
      title: "Apakan anda yakin ingin logout?",
      showCancelButton: true,
      confirmButtonText: "Ya",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        setToken("");
        window.location.href = "/";
      } else if (result.isDenied) {
        return;
      }
    });
  }

  return (
    <nav className={`h-16 z-30 flex items-center w-full shadow-md justify-between px-8 md:px-16 sticky top-0 ${className}`}>
      <Link to="/santri/beranda">
      <div className="flex items-center">
        <img src={logggo} alt="Logo PPM" className="w-14 mr-3" />
        <div>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-base font-semibold bg-gradient-to-r from-[#13A89D] to-[#C7D021] text-transparent bg-clip-text tracking-wide drop-shadow-md">
              Sistem Smart Electronic Identification
            </p>
        </div>
      </div>
      </Link>
      <RxHamburgerMenu
        fontSize="28px"
        className={`xl:hidden ml-8`}
        onClick={() => {
          setIsExpanded((prev) => !prev);
        }}
      />
      <div className={`hidden xl:flex w-4/12 ${manageClass ? "min-w-[930px]" : "min-w-[800px]"} pl-10 text-base font-medium justify-between items-center`}>
        <Link to="/santri/beranda" className={`cursor-pointer ${!["riwayatPresensi", "jadwalKelas", "formPerizinan", "editProfil", "manageClass"].includes(location.pathname.split("/")[2]) ? "font-bold" : ""}`}>
          Beranda
        </Link>
        <Link to="/santri/riwayatPresensi" className={`cursor-pointer ${location.pathname.split("/")[2] == "riwayatPresensi" ? "font-bold" : ""}`}>
          Riwayat Presensi
        </Link>
        <Link to="/santri/jadwalKelas" className={`cursor-pointer ${location.pathname.split("/")[2] == "jadwalKelas" ? "font-bold" : ""}`}>
          Jadwal Kelas
        </Link>
        <Link to="/santri/formPerizinan" className={`cursor-pointer ${location.pathname.split("/")[2] == "formPerizinan" ? "font-bold" : ""}`}>
          Form Perizinan
        </Link>
        <Link to="/santri/editProfil" className={`cursor-pointer ${location.pathname.split("/")[2] == "editProfil" ? "font-bold" : ""}`}>
          Edit Profil
        </Link>
        {manageClass ? (
          <Link to="/santri/manageClass" className={`cursor-pointer ${location.pathname.split("/")[2] == "manageClass" ? "font-bold" : ""}`}>
            Manage Kelas
          </Link>
        ) : (
          <></>
        )}
        <IoLogOut className="cursor-pointer" fontSize="28px" onClick={logout} />
      </div>
      <div className={`${isExpanded ? "flex" : "hidden"} text-base justify-between bg-white px-12 py-8 flex-col gap-8 absolute top-24 right-8 shadow-lg rounded-md`} ref={wrapperRef}>
        <Link
          onClick={() => setIsExpanded(false)}
          to="/santri/beranda"
          className={`cursor-pointer ${!["riwayatPresensi", "jadwalKelas", "formPerizinan", "editProfil", "manageClass"].includes(location.pathname.split("/")[2]) ? "font-bold" : ""}`}
        >
          Beranda
        </Link>
        <Link onClick={() => setIsExpanded(false)} to="/santri/riwayatPresensi" className={`cursor-pointer ${location.pathname.split("/")[2] == "riwayatPresensi" ? "font-bold" : ""}`}>
          Riwayat Presensi
        </Link>
        <Link onClick={() => setIsExpanded(false)} to="/santri/jadwalKelas" className={`cursor-pointer ${location.pathname.split("/")[2] == "jadwalKelas" ? "font-bold" : ""}`}>
          Jadwal Kelas
        </Link>
        <Link onClick={() => setIsExpanded(false)} to="/santri/formPerizinan" className={`cursor-pointer ${location.pathname.split("/")[2] == "formPerizinan" ? "font-bold" : ""}`}>
          Form Perizinan
        </Link>
        <Link onClick={() => setIsExpanded(false)} to="/santri/editProfil" className={`cursor-pointer ${location.pathname.split("/")[2] == "editProfil" ? "font-bold" : ""}`}>
          Edit Profil
        </Link>
        {manageClass ? (
          <Link to="/santri/manageClass" className={`cursor-pointer ${location.pathname.split("/")[2] == "manageClass" ? "font-bold" : ""}`}>
            Manage Kelas
          </Link>
        ) : (
          <></>
        )}
        <div className={`cursor-pointer`} onClick={logout}>
          logout
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
