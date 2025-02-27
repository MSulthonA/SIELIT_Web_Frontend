/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../AppContext";
import { FiEdit } from "react-icons/fi";
import { BiSolidTrash } from "react-icons/bi";
import appSettings from "../../Appsettings";
import TextInput from "../../components/TextInput";
import DateInput from "../../components/DateInput";
import Swal from "sweetalert2";

function DataKalender() {
  const token = useContext(AppContext)?.token?.data || "";
  const [calendars, setCalendars] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"view" | "form">("view");
  const [calendar, setCalendar] = useState<any>({
    id: "",
    date: "",
    title: "",
    time: "",
    location: "",
    type: "",
    color: "",
  });

  const initialcalendar = {
    date: "",
    title: "",
    time: "",
    location: "",
    type: "",
    color: "",
  };

  useEffect(() => {
    getCalendars();
  }, []);

  function handleSearch(e: any) {
    setSearch(e.target.value);
  }

  function checkSearch(calendar: any) {
    let searchString = calendar.date + calendar.title + calendar.location + calendar.time;

    try {
      const re = new RegExp(search.replace(/\\*/, ""), "i");
      return re.exec(searchString);
    } catch {
      const re = new RegExp("zzzzzzz", "i");
      return re.exec(searchString);
    }
  }
  const getCalendars = async () => {
    try {
      const response = await axios.get(`${appSettings.api}/calendars`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);

      // Ubah objek menjadi array
      const calendarArray = Object.entries(response.data.data).flatMap(([date, events]) =>
        (events as any[]).map((event) => ({
          date,
          ...event,
        }))
      );

      console.log("Parsed Calendar Data:", calendarArray);
      setCalendars(calendarArray);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Gagal mengambil data kalender", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  function addCalendar(e: any) {
    e.preventDefault();

    // Daftar warna
    const colors = ["#B9E4C9", "#61C0BF", "#A8DADC", "#A890FE", "#FFA07A", "#FFD700", "#A9CCE3", "#FFB6C1", "#E59866", "#DAA520", "#D7BDE2", "#AFEEEE"];

    // Pilih warna secara acak
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Ambil inisial dari title
    const title = calendar.title || "";
    const type = title
      .split(" ") // Pisahkan kata-kata
      .map((word) => word.charAt(0).toUpperCase()) // Ambil huruf pertama dan besar
      .join(""); // Gabungkan

    // Data yang akan dikirim ke API
    const calendarData = {
      ...calendar,
      color: randomColor, // Warna acak
      type: type, // Inisial dari title
    };

    axios
      .post(`${appSettings.api}/calendars`, calendarData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Response dari API:", res.data);

        if (res.data.data?.msg) {
          toast.success(res.data.data.msg, { theme: "colored" });
          setCalendar(initialcalendar);
        } else {
          toast.warn(res.data.msg || "Gagal menambah kalender", { theme: "colored" });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        if (err.response?.status === 401) {
          localStorage.setItem("token", "");
          setToken("");
          toast.info("Token expired, please login lagi", { theme: "colored", toastId: "expired" });
        } else {
          toast.error(err.response?.data?.message || "Terjadi kesalahan", { theme: "colored" });
        }
      });
  }

  function toSqlDate(date: string) {
    return date.split("T")[0];
  }

  function editCalendar(e: any, id: string) {
    e.preventDefault();

    // Cek apakah token tersedia
    if (!token) {
      toast.info("Token tidak ditemukan, silakan login kembali", { theme: "colored" });
      return;
    }

    // Pastikan title tidak undefined/null
    const title = calendar?.title || "";
    const type = title
      .split(" ") // Pisahkan kata-kata
      .map((word) => word.charAt(0).toUpperCase()) // Ambil huruf pertama dan besar
      .join(""); // Gabungkan inisial

    // Data yang akan dikirim ke API
    const calendarData = {
      ...calendar,
      type: type, // Inisial dari title diperbarui
    };

    // Perbarui state sebelum mengirim request
    setCalendar((prev) => ({ ...prev, type }));

    // Debugging: Cek data sebelum request
    console.log("Data yang dikirim ke API:", calendarData);

    axios
      .put(
        `${appSettings.api}/calendars?id=${id}`,
        calendarData, // Gunakan data baru dengan type yang diperbarui
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("Response API:", res.data);
        toast.success(res.data.data.msg || "Update event berhasil", { theme: "colored" });
        setCalendar(initialcalendar);
        getCalendars();
      })
      .catch((err) => {
        console.error("Error saat update:", err);

        if (err.response?.status === 400) {
          console.error("Pesan error dari server:", err.response.data);
          toast.error(err.response?.data?.message || "Data tidak valid", { theme: "colored" });
        }

        if (err.response?.status === 401) {
          localStorage.setItem("token", "");
          toast.info("Token expired, silakan login kembali", { theme: "colored", toastId: "expired" });
        } else {
          toast.error(err.response?.data?.message || "Terjadi kesalahan saat update", { theme: "colored" });
        }
      });
  }

  function deleteCalendar(id: string) {
    console.log("ID event yang akan dihapus:", id);
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus event?",
      showCancelButton: true,
      confirmButtonText: "Ya",
      confirmButtonColor: "#d33",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${appSettings.api}/calendars?id=${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            toast.success("Berhasil menghapus data event", { theme: "colored" });
            getCalendars();
          })
          .catch((err) => {
            if (err.response?.status === 401) {
              localStorage.setItem("token", "");
              toast.info("Token expired, silakan login kembali", { theme: "colored", toastId: "expired" });
            } else {
              toast.error(err.response?.data?.message || "Terjadi kesalahan", { theme: "colored" });
            }
          });
      }
    });
  }

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-start w-full pt-4 pb-16 overflow-x-auto">
      <p className="font-bold text-xl md:text-3xl mb-16">
        {mode === "form" ? (calendar.id ? "Edit" : "Tambah") : ""} Kalender <span className="text-themeTeal">Akademik</span>
      </p>
      {mode === "form" ? (
        <form
          className="w-full max-w-6xl bg-[#f6f6f6]/50 p-8 shadow-md flex flex-col rounded-xl mb-16"
          onSubmit={(e) => {
            if (calendar.id) {
              editCalendar(e, calendar.id);
            } else {
              addCalendar(e);
            }
          }}
        >
          <TextInput name="title" value={calendar.title} title="Judul" onChange={(e) => setCalendar({ ...calendar, title: e.target.value })} className="mb-8" inputClassName="bg-white" />
          <DateInput name="date" value={calendar.date} title="Tanggal" onChange={(e) => setCalendar({ ...calendar, date: e.target.value })} className="mb-8" inputClassName="bg-white" />
          <TextInput name="time" value={calendar.time} title="Waktu" onChange={(e) => setCalendar({ ...calendar, time: e.target.value })} className="mb-8" inputClassName="bg-white" />
          <TextInput name="location" value={calendar.location} title="Lokasi" onChange={(e) => setCalendar({ ...calendar, location: e.target.value })} className="mb-8" inputClassName="bg-white" />
          {/* <TextInput name="type" value={calendar.type} title="Tipe" onChange={(e) => setCalendar({ ...calendar, type: e.target.value })} className="mb-8" inputClassName="bg-white" />
          <TextInput name="color" value={calendar.color} title="Warna" onChange={(e) => setCalendar({ ...calendar, color: e.target.value })} className="mb-8" inputClassName="bg-white" /> */}
          <div className="justify-center items-center flex flex-col md:flex-row">
            <button type="button" className="bg-[#d9d9d9] px-12 py-2 mb-3 rounded mx-2 hover:scale-[1.03] font-semibold text-sm" onClick={() => setMode("view")}>
              Batal
            </button>
            <button type="submit" className="bg-themeTeal text-white font-semibold text-sm px-12 py-2 mb-3 mx-2 rounded hover:scale-[1.03] transition-all duration-200">
              Submit
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="w-full flex flex-col xl:flex-row items-center justify-between mb-8">
            <TextInput name="search" title="🔎 masukkan kata kunci" errorMsg="" onChange={handleSearch} className="w-full max-w-lg mb-4 shadow rounded-xl" inputClassName="bg-white" value={search} />
            <button className="bg-themeTeal text-white font-bold px-4 py-2 rounded-lg text-sm" onClick={() => setMode("form")}>
              Tambah Data
            </button>
          </div>
          <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
            <table className="w-full text-sm text-center h-12">
              <thead className="bg-themeTeal text-white sticky top-0">
                <tr>
                  <th className="pl-6 py-2">No.</th>
                  <th className="pl-6 py-2">Tanggal</th>
                  <th className="pl-6 py-2">Judul</th>
                  <th className="pl-6 py-2">Waktu</th>
                  <th className="pl-6 py-2">Lokasi</th>
                  <th className="pl-6 py-2">Tipe</th>
                  <th className="pl-6 py-2">Warna</th>
                  <th className="pl-6 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {calendars.map((calendar, index) => {
                  return (
                    checkSearch(calendar) && (
                      <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                        <td className="pl-6 py-2">{index + 1}.</td>
                        <td className="pl-6 py-2">{calendar.date || "No Date"}</td>
                        <td className="pl-6 py-2">{calendar.title || "No Title"}</td>
                        <td className="pl-6 py-2">{calendar.time || "No Time"}</td>
                        <td className="pl-6 py-2">{calendar.location || "No Location"}</td>
                        <td className="pl-6 py-2">{calendar.type || "No Type"}</td>
                        <td className="pl-6 py-2">
                          <span style={{ backgroundColor: calendar.color }} className="px-2 py-1 rounded">
                            {calendar.color || "No Color"}
                          </span>
                        </td>
                        <td className="px-3 py-2 flex justify-center gap-2">
                          <button
                            className="bg-themeOrange text-white px-2 py-1 rounded"
                            onClick={() => {
                              setCalendar({ ...initialcalendar, ...calendar, date: toSqlDate(calendar.date) });
                              setMode("form");
                            }}
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="bg-themeRed text-white px-2 py-1 rounded"
                            onClick={() => {
                              deleteCalendar(calendar.id);
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
        </>
      )}
    </div>
  );
}

export default DataKalender;
