import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContext } from "./AppContext";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

//pages
import Landing from "./pages/landing/Index";
import Student from "./pages/student/Index";
import Teacher from "./pages/teacher/Index";
import Admin from "./pages/admin/Index";

//landing
import Faq from "./pages/landing/FAQ";
import Beranda from "./pages/landing/Beranda";
import JadwalKelas from "./pages/landing/JadwalKelas";
import About from "./pages/landing/About";
import Login from "./pages/landing/Login";

//student
import StudentBeranda from "./pages/student/Beranda";
import StudentJadwalKelas from "./pages/student/JadwalKelas";
import StudentRiwayatPresensi from "./pages/student/RiwayatPresensi";
import StudentFormPerizinan from "./pages/student/FormPerizinan";
import StudentEditProfil from "./pages/student/EditProfil";
import StudentBypassPresensi from "./pages/student/BypassPresensi";

//guru
import TeacherBypassPresensi from "./pages/teacher/BypassPresensi";
import TeacherDataPerizinan from "./pages/teacher/DataPerizinan";

//admin
import DataSantri from "./pages/admin/DataSantri";
import DataAkun from "./pages/admin/DataAkun";
import DataRiwayatPresensi from "./pages/admin/DataRiwayatPresensi";
import AdminJadwalKelas from "./pages/admin/JadwalKelas";
import BypassPresensi from "./pages/admin/BypassPresensi";
import RekapPresensi from "./pages/admin/RekapPresensi";
import Perangkat from "./pages/admin/Perangkat";
import DataPerizinan from "./pages/admin/DataPerizinan";
import KalenderAkademik from "./pages/admin/KalenderAkademik";

//components
import Loading from "./components/Loading";
import RouteChanger from "./components/RouteChanger";
import { ToastContainer } from "react-toastify";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        token: { data: token, set: setToken },
        loading: { data: isLoading, set: setIsLoading },
      }}
    >
      <ToastContainer />
      {isLoading === true ? <Loading /> : <></>}
      <Router>
        <RouteChanger token={token} />
        <Routes>
          <Route path="/" element={<Landing />}>
            <Route index element={<Beranda />}></Route>
            <Route path="beranda" element={<Beranda />}></Route>
            <Route path="faq" element={<Faq />}></Route>
            <Route path="jadwalKelas" element={<JadwalKelas />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="about" element={<About />}></Route>
          </Route>
          <Route path="/santri" element={<Student />}>
            <Route index element={<StudentBeranda />}></Route>
            <Route path="beranda" element={<StudentBeranda />}></Route>
            <Route path="riwayatPresensi" element={<StudentRiwayatPresensi />}></Route>
            <Route path="jadwalKelas" element={<StudentJadwalKelas />}></Route>
            <Route path="formPerizinan" element={<StudentFormPerizinan />}></Route>
            <Route path="manageClass" element={<StudentBypassPresensi />}></Route>
            <Route path="editProfil" element={<StudentEditProfil />}></Route>
          </Route>
          <Route path="/guru" element={<Teacher />}>
            <Route index element={<TeacherBypassPresensi />}></Route>
            <Route path="bypassPresensi" element={<TeacherBypassPresensi />}></Route>
            <Route path="dataPerizinan" element={<TeacherDataPerizinan />}></Route>
          </Route>
          <Route path="/admin" element={<Admin />}>
            <Route index element={<DataSantri />}></Route>
            <Route path="dataSantri" element={<DataSantri />}></Route>
            <Route path="dataAkun" element={<DataAkun />}></Route>
            <Route path="dataRiwayatPresensi" element={<DataRiwayatPresensi />}></Route>
            <Route path="jadwalKelas" element={<AdminJadwalKelas />}></Route>
            <Route path="bypassPresensi" element={<BypassPresensi />}></Route>
            <Route path="rekapPresensi" element={<RekapPresensi />}></Route>
            <Route path="perangkat" element={<Perangkat />}></Route>
            <Route path="dataPerizinan" element={<DataPerizinan />}></Route>
            <Route path="kalenderAkademik" element={<KalenderAkademik />}></Route>
          </Route>
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
