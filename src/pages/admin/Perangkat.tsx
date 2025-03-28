/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";
import { toast } from "react-toastify";
// import { ToasContainer } from 'react-toastify';

function Perangkat() {
  const [devices, setDevices] = useState([]);
  const setToken = useContext(AppContext).token.set;
  const token = useContext(AppContext).token.data;

  useEffect(() => {
    getDevices();
    const interval = setInterval(getDevices, 2000);
    return () => clearInterval(interval);
  }, []);

  function getDevices() {
    axios
      .get(`${appSettings.api}/mqtt`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.msg) {
          toast.warn(res.data.msg);
        } else {
          setDevices(res.data);
        }
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

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-start w-full pt-4 pb-16 overflow-x-auto">
      <p className="font-bold text-xl md:text-3xl mb-16">
        Status <span className="text-themeTeal">Perangkat</span>
      </p>
      <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-96 no-scrollbar mb-24">
        <table className="w-full text-left h-12 text-sm">
          <thead className="bg-themeTeal text-white sticky top-0">
            <tr>
              <th className="px-3 py-2 items-center">No.</th>
              <th className="px-3 py-2 items-center">Nama Perangkat</th>
              <th className="px-3 py-2 items-center pr-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(devices).map((device: any, index) => {
              return (
                <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                  <td className="px-3 py-2 items-center">{index + 1}.</td>
                  <td className="px-3 py-2 items-center">{device}</td>
                  <td className={`pl-6 font-bold py-2 pr-6 ${devices[device] ? "text-green-500" : "text-gray-400"}`}>{devices[device] ? "online" : "offline"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Perangkat;
