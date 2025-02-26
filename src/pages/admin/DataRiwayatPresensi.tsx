/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";
import TextInput from "../../components/TextInput";
import { toast } from "react-toastify";
import { BiSolidTrash } from "react-icons/bi";
import Swal from "sweetalert2";
import DateInput from "../../components/DateInput";

function DataRiwayatPresensi() {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [search, setSearch] = useState({ string: "", startDate: "", endDate: "" });
  const token = useContext(AppContext).token.data;
  const setToken = useContext(AppContext).token.set;
  const namaHari = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];

  useEffect(() => {
    getAttendances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: any) {
    setSearch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function checkSearch(attendance: any) {
    let searchString = attendance.name + attendance.nis + attendance.class_name + attendance.grade + attendance.status;

    if (attendance.gender) {
      searchString += "Laki-laki";
    } else {
      searchString += "Perempuan";
    }

    try {
      const re = new RegExp(search.string.replace(/\\*/, ""), "i");
      return re.exec(searchString);
    } catch {
      const re = new RegExp("zzzzzzz", "i");
      return re.exec(searchString);
    }
  }

  function getAttendances() {
    axios
      .get(`${appSettings.api}/attendances?sort=1&startDate=${search.startDate}&endDate=${search.endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAttendances(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.setItem("token", "");
          setToken("");
          toast.info("Token expired, please login again", { theme: "colored", toastId: "expired" });
        } else {
          toast.error(err, { theme: "colored" });
        }
      });
  }

  function deleteAttendance(user_id: number, class_id: number) {
    Swal.fire({
      title: "Apakan anda yakin ingin menghapus data?",
      showCancelButton: true,
      confirmButtonText: "Ya",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${appSettings.api}/attendances?userId=${user_id}&classId=${class_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            getAttendances();
          });
      } else if (result.isDenied) {
        return;
      }
    });
  }

  return (
    <div className="mmin-h-[100svh] flex flex-col items-center justify-start pt-4 pb-16 grow w-full overflow-x-scroll">
      <p className="font-bold text-xl md:text-3xl mb-16">Riwayat Presensi</p>
      <div className="w-full flex xl:flex-row flex-col justify-between mb-4">
        <TextInput name="string" title="🔎 masukkan kata kunci" errorMsg="" onChange={handleSearch} className="w-full max-w-md mb-6" inputClassName="bg-white" value={search.string} />
        <DateInput name="startDate" title="dari" errorMsg="" onChange={handleSearch} className="" inputClassName="bg-white" value={search.startDate} />
        <DateInput name="endDate" title="sampai" errorMsg="" onChange={handleSearch} className="" inputClassName="bg-white" value={search.endDate} />
        <button className="bg-themeTeal text-white text-sm font-semibold px-4 py-2 mt-3 h-fit rounded" onClick={getAttendances}>
          Terapkan filter
        </button>
      </div>
      <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
        <table className="w-full h-12 text-center">
          <thead className="bg-themeTeal text-white sticky top-0 text-sm">
            <tr>
              <th className="px-3 py-2 items-center font-semibold">No</th>
              <th className="px-3 py-2 items-center font-semibold">NIS</th>
              <th className="px-3 py-2 items-center font-semibold">Nama</th>
              <th className="px-3 py-2 items-center font-semibold">Kelas</th>
              <th className="px-3 py-2 items-center font-semibold">Pengajian</th>
              <th className="px-3 py-2 items-center font-semibold">Hari</th>
              <th className="px-3 py-2 items-center font-semibold">Kehadiran</th>
              <th className="px-3 py-2 items-center font-semibold">status</th>
              <th className="px-3 py-2 items-center font-semibold">Pengabsen</th>
              <th className="px-3 py-2 items-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {attendances.map((attendance: any, index) => {
              const startDate = new Date(attendance.start_date);
              const attendAt = new Date(attendance.attend_at).toLocaleString("id").replace(/\//g, "-").replace(",", "");
              return (
                checkSearch(attendance) && (
                  <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                    <td className="px-3 py-2 items-center text-base">{index + 1}</td>
                    <td className="px-3 py-2 items-center text-base">{attendance.nis}</td>
                    <td className="px-3 py-2 items-center text-base">{attendance.name.length > 24 ? attendance.name.substring(0, 24) + "..." : attendance.name}</td>
                    <td className="px-3 py-2 items-center text-base">{attendance.class_type}</td>
                    <td className="px-3 py-2 items-center text-base">{startDate.getHours() > 13 ? (startDate.getHours() > 18 ? "Malam" : "Sore") : "Pagi"}</td>
                    <td className="px-3 py-2 items-center text-base">{namaHari[startDate.getDay()]}</td>
                    <td>{attendance.attend_at ? attendAt : "Not set"}</td>
                    <td className="px-3 py-2 items-center text-base">{attendance.status}</td>
                    <td>{attendance.lastEditBy}</td>
                    <td className="px-3 py-2 flex flex-wrap gap-2 items-center justify-center">
                      <button
                        className="bg-themeRed text-white px-2 py-1 rounded"
                        onClick={() => {
                          deleteAttendance(attendance.user_id, attendance.class_id);
                        }}
                      >
                        <BiSolidTrash />
                      </button>
                    </td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataRiwayatPresensi;
