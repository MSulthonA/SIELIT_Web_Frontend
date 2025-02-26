import { useEffect, useState, useContext } from "react";
import { Line } from "react-chartjs-2";
import { ArrowUpRight } from "lucide-react";
import axios from "axios";
import appSettings from "../Appsettings";
import { AppContext } from "../AppContext";
import { toast } from "react-toastify";

const VisualCard = () => {
  const [studentsByGrade, setStudentsByGrade] = useState({});
  const setToken = useContext(AppContext).token.set;
  const token = useContext(AppContext).token.data;

  useEffect(() => {
    getStudents();
  }, []);

  function getStudents() {
    axios
      .get(`${appSettings.api}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const students = res.data.filter((el) => el.role === 1);
        const grades = {};

        // Mendapatkan daftar 6 bulan terakhir secara dinamis
        const currentMonth = new Date().getMonth();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const last6Months = Array.from({ length: 6 }, (_, i) => monthNames[(currentMonth - i + 12) % 12]).reverse();

        students.forEach((student) => {
          const grade = student.grade;
          const monthIndex = new Date(student.created_at).getMonth();
          const monthName = monthNames[monthIndex];

          if (!grades[grade]) {
            grades[grade] = {
              total: 0,
              monthlyCounts: Object.fromEntries(last6Months.map((m) => [m, 0])),
            };
          }

          if (grades[grade].monthlyCounts.hasOwnProperty(monthName)) {
            grades[grade].monthlyCounts[monthName] += 1;
          }

          grades[grade].total += 1;
        });

        setStudentsByGrade(grades);
      })
      .catch((err) => {
        toast.error("Error fetching students", { theme: "colored" });
      });
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {Object.entries(studentsByGrade).map(([grade, { total, monthlyCounts }]) => {
        const last6Months = Object.keys(monthlyCounts); // Menggunakan daftar bulan yang sudah dibuat dinamis
        const data = {
          labels: last6Months,
          datasets: [
            {
              data: last6Months.map((month) => monthlyCounts[month]),
              borderColor: "#22C55E",
              backgroundColor: "transparent",
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        };

        return (
          <div key={grade} className="p-5 h-44 w-80 rounded-xl shadow-lg bg-white flex-shrink-0">
            <p className="text-gray-500 text-sm font-semibold">Angkatan {grade}</p>
            <h2 className="text-3xl font-bold text-themeTeal">{total} Orang</h2>
            <div className="flex items-center text-green-500 mt-1">
              <p className="text-sm">Bertambah {monthlyCounts[last6Months[last6Months.length - 1]] || 0} bulan ini</p>
              <ArrowUpRight size={16} className="ml-1" />
            </div>
            <div className="h-12 mt-2">
              <Line
                data={data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VisualCard;
