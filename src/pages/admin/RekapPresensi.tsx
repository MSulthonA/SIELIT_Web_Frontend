/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import DateInput from "../../components/DateInput";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import axios from "axios";
import { toast } from "react-toastify";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import * as XLSX from "xlsx";

function RekapPresensi() {
  const [search, setSearch] = useState<any>({ classType: "", startDate: "", endDate: "" });
  const [classTypes, setClassTypes] = useState<any[]>([]);
  const [recap, setRecap] = useState<any>({});
  const [totalAttendance, setTotalAttendance] = useState<any>({
    all: 0,
    pagi: 0,
    malam: 0,
  });
  console.log(totalAttendance);
  const setToken = useContext(AppContext).token.set;
  const token = useContext(AppContext).token.data;

  useEffect(() => {
    getClassTypes();
  }, []);

  useEffect(() => {
    setTotalAttendance((prev) => {
      const pagi =
        Object.keys(recap).length &&
        recap[Object.keys(recap)[0]].reduce((acc: any, el: any) => {
          return acc + el.jumlah_sesi_pagi;
        }, 0);
      const malam =
        Object.keys(recap).length &&
        recap[Object.keys(recap)[0]].reduce((acc: any, el: any) => {
          return acc + el.jumlah_sesi_malam;
        }, 0);

      return { pagi, malam, all: pagi + malam };
    });
  }, [recap]);

  function handleSearch(e: any) {
    setSearch((prev) => ({ ...prev, [e.target.name]: e.target.value, [e.target.name + "Err"]: "" }));
  }

  function getAttendanceRecap() {
    Object.keys(search).forEach((key) => {
      if (search[key] === "") {
        setSearch((prev) => ({ ...prev, [key + "Err"]: "harus diisi" }));
        return;
      }
    });

    axios
      .get(`${appSettings.api}/attendances/recap`, {
        params: search,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const recap = res.data.reduce((acc: any, el: any) => {
          return { ...acc, [el.name]: [] };
        }, {});

        res.data.forEach((el: any) => {
          recap[el.name].push(el);
        });
        setRecap(recap);
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

  function getClassTypes() {
    axios
      .get(`${appSettings.api}/classes/types`)
      .then((res) => {
        setClassTypes(res.data.map((el: any) => ({ value: el.id, label: el.name })));
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

  const exportToPDF = () => {
    const doc = new jsPDF("landscape");

    const weeks = Object.keys(recap).length && recap[Object.keys(recap)[0]].slice().sort((a, b) => new Date(a.week_start) - new Date(b.week_start));
    const tableColumn = [
      [
        { content: "No.", rowSpan: 4 },
        { content: "Nama Lengkap", rowSpan: 4 },
        { content: "Gender", rowSpan: 4 },
        { content: "Jml Jadwal", rowSpan: 4 },
      ],
    ];

    if (weeks) {
      weeks.forEach((week) => {
        const start = new Date(week.week_start).getDate();
        const end = new Date(week.week_end).getDate();
        const month_start = new Date(week.week_start).toLocaleString("default", { month: "short" });
        const month_end = new Date(week.week_end).toLocaleString("default", { month: "short" });
        tableColumn[0].push({ content: `${start} ${month_start} - ${end} ${month_end}`, colSpan: 6 });
      });

      tableColumn.push([]);
      weeks.forEach((_, idx) => {
        tableColumn[1].push({ content: `Presensi Minggu - ${idx + 1}`, colSpan: 6 });
      });

      tableColumn.push([]);
      weeks.forEach(() => {
        tableColumn[2].push({ content: "PAGI", colSpan: 3 });
        tableColumn[2].push({ content: "MALAM", colSpan: 3 });
      });

      tableColumn.push([]);
      weeks.forEach(() => {
        ["H", "I", "A", "H", "I", "A"].forEach((label) => {
          tableColumn[3].push({ content: label, rowSpan: 1 });
        });
      });

      tableColumn[0].push({ content: "% Hadir", rowSpan: 4 });
      tableColumn[0].push({ content: "% Izin", rowSpan: 4 });
      tableColumn[0].push({ content: "% Alpha", rowSpan: 4 });
    }

    const tableRows = [];

    Object.keys(recap).forEach((key, idx) => {
      const recapData = recap[key].slice().sort((a, b) => new Date(a.week_start) - new Date(b.week_start));

      const totalHadirPagi = recapData.reduce((sum, data) => sum + data.jumlah_hadir_pagi, 0);
      const totalIzinPagi = recapData.reduce((sum, data) => sum + data.jumlah_izin_pagi, 0);
      const totalAlfaPagi = recapData.reduce((sum, data) => sum + data.jumlah_alfa_pagi, 0);
      const totalHadirMalam = recapData.reduce((sum, data) => sum + data.jumlah_hadir_malam, 0);
      const totalIzinMalam = recapData.reduce((sum, data) => sum + data.jumlah_izin_malam, 0);
      const totalAlfaMalam = recapData.reduce((sum, data) => sum + data.jumlah_alfa_malam, 0);

      const totalPertemuan = totalHadirPagi + totalIzinPagi + totalAlfaPagi + totalHadirMalam + totalIzinMalam + totalAlfaMalam;

      const totalJadwal = totalPertemuan;
      const percentageHadir = totalJadwal ? (((totalHadirPagi + totalHadirMalam) / totalJadwal) * 100).toFixed(0) + "%" : "0%";
      const percentageIzin = totalJadwal ? (((totalIzinPagi + totalIzinMalam) / totalJadwal) * 100).toFixed(0) + "%" : "0%";
      const percentageAlpha = totalJadwal ? (((totalAlfaPagi + totalAlfaMalam) / totalJadwal) * 100).toFixed(0) + "%" : "0%";

      const rowData = [
        idx + 1,
        recapData[0].name,
        recapData[0].gender ? "L" : "P",
        totalPertemuan,
        ...recapData.flatMap((data) => [data.jumlah_hadir_pagi, data.jumlah_izin_pagi, data.jumlah_alfa_pagi, data.jumlah_hadir_malam, data.jumlah_izin_malam, data.jumlah_alfa_malam]),
        percentageHadir,
        percentageIzin,
        percentageAlpha,
      ];
      tableRows.push(rowData);
    });

    doc.text("Rekap Presensi", 14, 15);
    doc.autoTable({
      head: tableColumn,
      body: tableRows,
      startY: 20,
      headStyles: {
        fillColor: [19, 168, 157],
        textColor: [255, 255, 255],
      },
      styles: {
        overflow: "linebreak",
        valign: "middle",
        halign: "center",
        lineWidth: 0.1,
        cellPadding: 2,
      },
      theme: "grid",
    });

    doc.save("rekap_presensi.pdf");
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [];

    // Add header rows
    const headerRow1 = ["No.", "Nama Lengkap", "Gender", "Jml Jadwal"];
    const headerRow2 = [];
    const headerRow3 = [];
    const headerRow4 = [];

    let weeks = recap && Object.keys(recap).length && recap[Object.keys(recap)[0]];
    if (weeks) {
      // Sort weeks by start date
      weeks = weeks.sort((a, b) => new Date(a.week_start) - new Date(b.week_start));

      weeks.forEach((week, idx) => {
        const start = new Date(week.week_start).getDate();
        const end = new Date(week.week_end).getDate();
        const month_start = new Date(week.week_start).toLocaleString("default", { month: "short" });
        const month_end = new Date(week.week_end).toLocaleString("default", { month: "short" });
        headerRow1.push(`${start} ${month_start} - ${end} ${month_end}`, "", "", "", "", "");
        headerRow2.push(`Presensi Minggu - ${idx + 1}`, "", "", "", "", "");
        headerRow3.push("", "", "", "", "", "PAGI", "MALAM");
        headerRow4.push("H", "I", "A", "", "H", "I", "A", "H", "I", "A", "H", "I", "A");
      });

      // Add summary columns to header
      headerRow1.push("% Hadir", "% Izin", "% Alpha");
      headerRow2.push("", "", "");
      headerRow3.push("", "", "");
      headerRow4.push("", "", "");
    }

    ws_data.push(headerRow1);
    ws_data.push(headerRow2);
    ws_data.push(headerRow3);
    ws_data.push(headerRow4);

    // Add data rows
    Object.keys(recap).forEach((key, idx) => {
      const recapData = recap[key];

      // Sort recapData by week start date
      const sortedRecapData = recapData.sort((a, b) => new Date(a.week_start) - new Date(b.week_start));

      // Calculate total pertemuan and total jadwal
      const totalHadirPagi = sortedRecapData.reduce((sum, data) => sum + data.jumlah_hadir_pagi, 0);
      const totalIzinPagi = sortedRecapData.reduce((sum, data) => sum + data.jumlah_izin_pagi, 0);
      const totalAlfaPagi = sortedRecapData.reduce((sum, data) => sum + data.jumlah_alfa_pagi, 0);
      const totalHadirMalam = sortedRecapData.reduce((sum, data) => sum + data.jumlah_hadir_malam, 0);
      const totalIzinMalam = sortedRecapData.reduce((sum, data) => sum + data.jumlah_izin_malam, 0);
      const totalAlfaMalam = sortedRecapData.reduce((sum, data) => sum + data.jumlah_alfa_malam, 0);

      const totalJadwal = totalHadirPagi + totalIzinPagi + totalAlfaPagi + totalHadirMalam + totalIzinMalam + totalAlfaMalam;

      // Calculate percentages
      const persentaseHadir = totalJadwal ? (((totalHadirPagi + totalHadirMalam) / totalJadwal) * 100).toFixed(0) + "%" : "0%";
      const persentaseIzin = totalJadwal ? (((totalIzinPagi + totalIzinMalam) / totalJadwal) * 100).toFixed(0) + "%" : "0%";
      const persentaseAlfa = totalJadwal ? (((totalAlfaPagi + totalAlfaMalam) / totalJadwal) * 100).toFixed(0) + "%" : "0%";

      const rowData = [
        idx + 1,
        sortedRecapData[0].name,
        sortedRecapData[0].gender ? "L" : "P",
        totalJadwal,
        ...sortedRecapData.flatMap((data) => [data.jumlah_hadir_pagi, data.jumlah_izin_pagi, data.jumlah_alfa_pagi, data.jumlah_hadir_malam, data.jumlah_izin_malam, data.jumlah_alfa_malam]),
        persentaseHadir,
        persentaseIzin,
        persentaseAlfa,
      ];
      ws_data.push(rowData);
    });

    // Generate worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Merge cells for the headers
    const merge = [
      { s: { r: 0, c: 0 }, e: { r: 3, c: 0 } }, // No.
      { s: { r: 0, c: 1 }, e: { r: 3, c: 1 } }, // Nama Lengkap
      { s: { r: 0, c: 2 }, e: { r: 3, c: 2 } }, // Gender
      { s: { r: 0, c: 3 }, e: { r: 3, c: 3 } }, // Jml Jadwal
    ];
    let col = 4;
    weeks.forEach((week, idx) => {
      merge.push({ s: { r: 0, c: col }, e: { r: 0, c: col + 5 } }, { s: { r: 1, c: col }, e: { r: 1, c: col + 5 } }, { s: { r: 2, c: col }, e: { r: 2, c: col + 2 } }, { s: { r: 2, c: col + 3 }, e: { r: 2, c: col + 5 } });
      col += 6;
    });

    // Merge cells for the summary columns
    merge.push({ s: { r: 0, c: col }, e: { r: 3, c: col } }, { s: { r: 0, c: col + 1 }, e: { r: 3, c: col + 1 } }, { s: { r: 0, c: col + 2 }, e: { r: 3, c: col + 2 } });

    ws["!merges"] = merge;

    XLSX.utils.book_append_sheet(wb, ws, "Rekap Presensi");

    // Save the Excel file
    XLSX.writeFile(wb, "rekap_presensi.xlsx");
  };
  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-start pt-4 pb-16 grow w-full overflow-x-scroll">
      <p className="font-bold text-xl md:text-3xl mb-16">Rekap Presensi</p>
      <div className="w-full flex flex-col md:flex-row gap-2 justify-between mb-4">
        <SelectInput name="classType" title="Tipe Kelas" errorMsg={search.classTypeErr} onChange={handleSearch} className="w-full max-w-md" value={search.classType} values={classTypes} />
        <DateInput name="startDate" title="dari" errorMsg={search.startDateErr} onChange={handleSearch} className="" inputClassName="bg-white" value={search.startDate} />
        <DateInput name="endDate" title="sampai" errorMsg={search.endDateErr} onChange={handleSearch} className="" inputClassName="bg-white" value={search.endDate} />
        <button className="bg-themeTeal text-white text-sm font-semibold px-4 py-2 mt-3 h-fit rounded" onClick={getAttendanceRecap}>
          Generate rekap
        </button>
      </div>
      {Object.keys(recap).length > 0 && (
        <>
          <div className="flex justify-start w-full gap-4 mb-4">
            <button className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded" onClick={exportToPDF}>
              Export to PDF
            </button>
            <button className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded" onClick={exportToExcel}>
              Export to Excel
            </button>
          </div>
          <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
            <table className="w-full h-12 text-center text-xs border-collapse">
              <thead className="bg-themeTeal text-white sticky top-0">
                <tr>
                  <th className="py-2 px-4 border border-white" rowSpan={4}>
                    No.
                  </th>
                  <th className="py-2 px-4 border border-white" rowSpan={4}>
                    Nama Lengkap
                  </th>
                  <th className="py-2 px-4 border border-white" rowSpan={4}>
                    Gender
                  </th>
                  {Object.keys(recap).length &&
                    recap[Object.keys(recap)[0]]
                      .slice()
                      .sort((a, b) => new Date(a.week_start) - new Date(b.week_start)) // Urutkan ascending
                      .map((el: any) => {
                        const start = new Date(el.week_start).getDate();
                        const end = new Date(el.week_end).getDate();
                        const month_start = new Date(el.week_start).toLocaleString("default", { month: "short" });
                        const month_end = new Date(el.week_end).toLocaleString("default", { month: "short" });
                        return (
                          <th className="py-2 px-4 border border-white" colSpan={6}>
                            {`${start} ${month_start} - ${end} ${month_end}`}
                          </th>
                        );
                      })}
                </tr>
                <tr>
                  {Object.keys(recap).length &&
                    recap[Object.keys(recap)[0]]
                      .slice()
                      .sort((a, b) => new Date(a.week_start) - new Date(b.week_start)) // Urutkan ascending
                      .map((el: any, idx) => (
                        <th className="py-2 px-4 border border-white" colSpan={6}>
                          {`Presensi Minggu - ${idx + 1}`}
                        </th>
                      ))}
                </tr>
                <tr>
                  {Object.keys(recap).length &&
                    recap[Object.keys(recap)[0]]
                      .slice()
                      .sort((a, b) => new Date(a.week_start) - new Date(b.week_start)) // Urutkan ascending
                      .map((el: any, idx) => (
                        <>
                          <th className="py-2 px-4 border border-white" colSpan={3}>
                            PAGI
                          </th>
                          <th className="py-2 px-4 border border-white" colSpan={3}>
                            MALAM
                          </th>
                        </>
                      ))}
                </tr>
                <tr>
                  {Object.keys(recap).length &&
                    recap[Object.keys(recap)[0]]
                      .slice()
                      .sort((a, b) => new Date(a.week_start) - new Date(b.week_start)) // Urutkan ascending
                      .map((el: any, idx) => (
                        <>
                          <th className="py-2 px-4 border border-white">H</th>
                          <th className="py-2 px-4 border border-white">I</th>
                          <th className="py-2 px-4 border border-white bg-red-400">A</th>
                          <th className="py-2 px-4 border border-white">H</th>
                          <th className="py-2 px-4 border border-white">I</th>
                          <th className="py-2 px-4 border border-white bg-red-400">A</th>
                        </>
                      ))}
                </tr>
              </thead>

              <tbody>
                {Object.keys(recap).length &&
                  Object.keys(recap).map((el, idx) => {
                    return (
                      <tr className="even:bg-slate-200 odd:bg-white">
                        <th className="py-2 border border-white">{idx + 1}.</th>
                        <th className="py-2 border border-white">{recap[el][0].name}</th>
                        <th className="py-2 border border-white">{recap[el][0].gender ? "L" : "P"}</th>

                        {/* Urutkan recap[el] berdasarkan week_start */}
                        {recap[el]
                          .slice()
                          .sort((a, b) => new Date(a.week_start) - new Date(b.week_start)) // Sorting ascending
                          .map((item: any) => {
                            return (
                              <>
                                <th className="py-2 border border-white">{item.jumlah_hadir_pagi}</th>
                                <th className="py-2 border border-white">{item.jumlah_izin_pagi}</th>
                                <th className="py-2 border border-white bg-red-400 text-white">{item.jumlah_alfa_pagi}</th>
                                <th className="py-2 border border-white">{item.jumlah_hadir_malam}</th>
                                <th className="py-2 border border-white">{item.jumlah_izin_malam}</th>
                                <th className="py-2 border border-white bg-red-400 text-white">{item.jumlah_alfa_malam}</th>
                              </>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <p className="font-bold text-xl md:text-3xl mb-16">
            Keterangan Presensi <span className="text-themeTeal">{`${search.startDate} s/d ${search.endDate}`}</span>
          </p>
          <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
            <table className="w-full h-12 text-center text-sm border-collapse">
              <thead className="bg-themeTeal text-white sticky top-0">
                <tr>
                  <th className="py-2 border border-white" rowSpan={2}>
                    No.
                  </th>
                  <th className="py-2 border border-white" rowSpan={2}>
                    Nama Lengkap
                  </th>
                  <th className="py-2 border border-white" rowSpan={2}>
                    Gender
                  </th>

                  <th className="py-2 border border-white" colSpan={2}>
                    Hadir
                  </th>
                  <th className="py-2 border border-white" colSpan={2}>
                    Izin/Sakit
                  </th>
                  <th className="py-2 border border-white" colSpan={2}>
                    Alfa
                  </th>
                </tr>
                <tr>
                  <th className="py-2 border border-white">P</th>
                  <th className="py-2 border border-white">M</th>
                  <th className="py-2 border border-white">P</th>
                  <th className="py-2 border border-white">M</th>
                  <th className="py-2 border border-white">P</th>
                  <th className="py-2 border border-white">M</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(recap).length &&
                  Object.keys(recap).map((el, idx) => {
                    const jumlah_alfa_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_alfa_malam, 0);
                    const jumlah_alfa_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_alfa_pagi, 0);
                    const jumlah_hadir_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_hadir_malam, 0);
                    const jumlah_hadir_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_hadir_pagi, 0);
                    const jumlah_izin_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_izin_malam, 0);
                    const jumlah_izin_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_izin_pagi, 0);

                    return (
                      <tr className="even:bg-slate-200 odd:bg-white">
                        <th className="py-2 border border-white">{idx + 1}.</th>
                        <th className="py-2 border border-white">{recap[el][0].name}</th>
                        <th className="py-2 border border-white">{recap[el][0].gender ? "L" : "P"}</th>
                        <th className="py-2 border border-white">{jumlah_hadir_pagi}</th>
                        <th className="py-2 border border-white">{jumlah_hadir_malam}</th>
                        <th className="py-2 border border-white">{jumlah_izin_pagi}</th>
                        <th className="py-2 border border-white">{jumlah_izin_malam}</th>
                        <th className="py-2 border border-white">{jumlah_alfa_pagi}</th>
                        <th className="py-2 border border-white">{jumlah_alfa_malam}</th>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <p className="font-bold text-xl md:text-3xl mb-16">
            Persentase Kehadiran <span className="text-themeTeal"> {`${search.startDate} s/d ${search.endDate}`}</span>
          </p>
          <div className="flex gap-4 mb-6">
            <p>Total ngaji: {totalAttendance.all}</p>
            <p>Sesi pagi: {totalAttendance.pagi}</p>
            <p>Sesi malam: {totalAttendance.malam}</p>
            <p>H: Hadir</p>
            <p>I: Izin/Sakit</p>
            <p>A: Alfa</p>
          </div>
          <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
            <table className="w-full h-12 text-center text-xs border-collapse">
              <thead className="bg-themeTeal text-white sticky top-0">
                <tr>
                  <th className="py-2 border border-white" rowSpan={2}>
                    No.
                  </th>
                  <th className="py-2 border border-white" rowSpan={2}>
                    Nama Lengkap
                  </th>
                  <th className="py-2 border border-white" rowSpan={2}>
                    Gender
                  </th>

                  <th className="py-2 border border-white" colSpan={3}>
                    Sesi Pagi
                  </th>
                  <th className="py-2 border border-white" colSpan={3}>
                    Sesi Malam
                  </th>
                  <th className="py-2 border border-white" rowSpan={2}>
                    Persentasi Kehadiran
                  </th>
                </tr>
                <tr>
                  <th className="py-2 border border-white">H</th>
                  <th className="py-2 border border-white">I</th>
                  <th className="py-2 border border-white">A</th>
                  <th className="py-2 border border-white">H</th>
                  <th className="py-2 border border-white">I</th>
                  <th className="py-2 border border-white">A</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(recap).length &&
                  Object.keys(recap).map((el, idx) => {
                    const jumlah_alfa_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_alfa_malam, 0);
                    const jumlah_alfa_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_alfa_pagi, 0);
                    const jumlah_hadir_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_hadir_malam, 0);
                    const jumlah_hadir_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_hadir_pagi, 0);
                    const jumlah_izin_malam = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_izin_malam, 0);
                    const jumlah_izin_pagi = recap[el].reduce((acc: any, el: any) => acc + el.jumlah_izin_pagi, 0);

                    return (
                      <tr className="even:bg-slate-200 odd:bg-white">
                        <th className="py-2 border border-white">{idx + 1}.</th>
                        <th className="py-2 border border-white">{recap[el][0].name}</th>
                        <th className="py-2 border border-white">{recap[el][0].gender ? "L" : "P"}</th>
                        <th className="py-2 border border-white">{Math.round((jumlah_hadir_pagi / totalAttendance.pagi) * 100) || 0}%</th>
                        <th className="py-2 border border-white">{Math.round((jumlah_izin_pagi / totalAttendance.pagi) * 100) || 0}%</th>
                        <th className="py-2 border border-white">{Math.round((jumlah_alfa_pagi / totalAttendance.pagi) * 100) || 0}%</th>
                        <th className="py-2 border border-white">{Math.round((jumlah_hadir_malam / totalAttendance.malam) * 100) || 0}%</th>
                        <th className="py-2 border border-white">{Math.round((jumlah_izin_malam / totalAttendance.malam) * 100) || 0}%</th>
                        <th className="py-2 border border-white">{Math.round((jumlah_alfa_malam / totalAttendance.malam) * 100) || 0}%</th>
                        <th className="py-2 border border-white">{Math.round(((jumlah_hadir_pagi + jumlah_hadir_malam + (jumlah_izin_pagi + jumlah_izin_malam) / 2) / totalAttendance.all) * 100) || 0}%</th>
                      </tr>
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

export default RekapPresensi;
