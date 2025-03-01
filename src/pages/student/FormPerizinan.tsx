import { useContext, useEffect, useState } from "react";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import { userContext } from "./Index";
import { AppContext } from "../../AppContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import appSettings from "../../Appsettings";
import PermitCard from "./components/PermitCard";

function FormPerizinan() {
  const userData = useContext(userContext);
  const setToken = useContext(AppContext).token.set;
  const token = useContext(AppContext).token.data;

  const formIzinInit = {
    user_id: userData.id,
    class_id: "",
    class_idErr: "",
    description: "",
    descriptionErr: "",
    img: "",
    img_file: "",
  };

  const [formIzin, setFormIzin] = useState(formIzinInit);
  const [classes, setClasses] = useState([]);
  const [leavePermits, setLeavePermits] = useState([]);

  function fetchData() {
    // Fetch Classes and Leave Permits in parallel
    Promise.all([
      axios.get(`${appSettings.api}/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${appSettings.api}/permits`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([classRes, permitRes]) => {
        console.log("Classes Response:", classRes.data);
        console.log("Leave Permits Response:", permitRes.data);

        if (classRes.data.msg) {
          toast.warn(classRes.data.msg);
        } else {
          const classOptions = classRes.data.map((el) => {
            const startDate = new Date(el.start_date)
              .toLocaleString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-");

            const endDate = new Date(el.end_date)
              .toLocaleString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-");

            const startTime = new Date(el.start_date).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const endTime = new Date(el.end_date).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return {
              value: el.id,
              label: `${el.name} (${startDate} ${startTime} - ${endDate} ${endTime})`,
            };
          });

          setClasses(classOptions);
        }

        if (permitRes.data.msg) {
          toast.warn(permitRes.data.msg);
        } else {
          setLeavePermits(permitRes.data);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.info("Token expired, please login again", {
            theme: "colored",
            toastId: "expired",
          });
          localStorage.setItem("token", "");
          setToken("");
        } else {
          toast.error(err.message, { theme: "colored" });
        }
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (!formIzin.class_id) {
      setFormIzin((prev) => ({ ...prev, class_idErr: "Tidak boleh kosong" }));
      return;
    }

    if (!formIzin.description) {
      setFormIzin((prev) => ({
        ...prev,
        descriptionErr: "Tidak boleh kosong",
      }));
      return;
    }

    if (!formIzin.img_file) {
      toast.warn("Gambar bukti tidak boleh kosong", { theme: "colored" });
      return;
    }

    // Gunakan FormData untuk mengirim data termasuk file
    const formData = new FormData();
    formData.append("user_id", userData.id);
    formData.append("class_id", formIzin.class_id);
    formData.append("description", formIzin.description);
    formData.append("img_file", formIzin.img_file); // File dikirim di sini

    axios
      .post(`${appSettings.api}/permits`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success(res.data.msg, { theme: "colored" });
        fetchData();
        setFormIzin(formIzinInit);
        document.querySelector("input[type=file]").value = "";
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.setItem("token", "");
          setToken("");
        } else {
          toast.error(err.response?.data?.msg || "Terjadi kesalahan", { theme: "colored" });
        }
      });
  }

  function handleChange(e) {
    if (e.target.type === "file") {
      setFormIzin((prev) => ({
        ...prev,
        img: URL.createObjectURL(e.target.files[0]),
        img_file: e.target.files[0],
      }));
    } else {
      setFormIzin((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        [e.target.name + "Err"]: "",
      }));
    }
  }

  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      <p className="font-bold text-2xl md:text-3xl mb-16">
        Form <span className="text-themeTeal">Perizinan</span>
      </p>
      <form className="w-full max-w-6xl bg-gray-100 p-8 shadow-md flex flex-col rounded-xl mb-16" onSubmit={handleSubmit}>
        <SelectInput title="Kelas" name="class_id" value={formIzin.class_id} onChange={handleChange} errorMsg={formIzin.class_idErr} values={classes} />
        <TextInput name="description" value={formIzin.description} title="Alasan" errorMsg={formIzin.descriptionErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />

        {formIzin.img && <img src={formIzin.img} alt="Preview" className="max-h-96 w-fit mx-auto" />}
        <div className="flex flex-col md:flex-row self-end mt-4">
          <input type="file" name="img_file" onChange={handleChange} accept=".jpg,.jpeg,.png" className="block w-full md:w-80 text-sm py-2 file:bg-themeTeal file:text-white file:cursor-pointer" />
          <button type="submit" className="bg-themeTeal text-white font-semibold px-12 py-2 rounded hover:scale-105 transition-all duration-200">
            Submit
          </button>
        </div>
      </form>
      <div className="flex flex-col items-center w-full">
        <p className="font-bold text-2xl md:text-3xl mb-16 mt-16">
          Riwayat <span className="text-themeTeal">Perizinan</span>
        </p>
        {leavePermits.length === 0 ? (
          <p className="text-base text-center mb-24">Anda belum memiliki riwayat perizinan</p>
        ) : (
          leavePermits.filter((el) => el.nis === userData.nis).map((el, id) => <PermitCard key={id} {...el} fetchData={fetchData} />)
        )}
      </div>
    </div>
  );
}

export default FormPerizinan;
