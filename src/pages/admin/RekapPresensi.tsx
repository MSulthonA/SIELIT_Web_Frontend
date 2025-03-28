/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
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

  function exportToPDF() {
    const doc = new jsPDF("landscape");
    const MAX_DAYS_PER_PAGE = 5; // Adjust this number based on your paper size
  
    // Get sorted weeks
    const weeks = Object.keys(recap).length 
      ? recap[Object.keys(recap)[0]]
          .slice()
          .sort((a, b) => new Date(a.week_start) - new Date(b.week_start))
      : [];
  
    // Split weeks into chunks
    const weekChunks = [];
    for (let i = 0; i < weeks.length; i += MAX_DAYS_PER_PAGE) {
      weekChunks.push(weeks.slice(i, i + MAX_DAYS_PER_PAGE));
    }
  
    let startY = 20;
    weekChunks.forEach((chunk, chunkIndex) => {
      // Build table structure for this chunk
      const { tableColumn, tableRows } = buildTableData(chunk);
  
      if (chunkIndex > 0) {
        doc.addPage();
        startY = 20;
      }
  
      // Add title
      doc.text(`Rekap Presensi - Part ${chunkIndex + 1}`, 14, 15);
      
      // Create table
      doc.autoTable({
        head: tableColumn,
        body: tableRows,
        startY: startY,
        headStyles: {
          fillColor: [19, 168, 157],
          textColor: [255, 255, 255],
          fontSize: 8,
        },
        styles: {
          fontSize: 7,
          overflow: "linebreak",
          valign: "middle",
          halign: "center",
          lineWidth: 0.1,
          cellPadding: 1,
        },
        columnStyles: {
          0: { cellWidth: 8 },  // No
          1: { cellWidth: 40 }, // Name
          2: { cellWidth: 15 }, // Gender
          3: { cellWidth: 20 }, // Total Schedule
        },
        theme: "grid",
        margin: { horizontal: 2 }
      });
  
      startY = (doc as any).lastAutoTable.finalY + 10;
    });
  
    doc.save("rekap_presensi.pdf");
  }
  
  // Helper function to build table data for each chunk
  function buildTableData(weeksChunk: any[]) {
    const tableColumn = [
      [
        { content: "No.", rowSpan: 4 },
        { content: "Nama Lengkap", rowSpan: 4 },
        { content: "Gender", rowSpan: 4 },
        { content: "Jml Jadwal", rowSpan: 4 },
      ],
    ];
  
    // Add date range header
    if (weeksChunk.length > 0) {
      const startDate = search.startDate ? new Date(search.startDate).toLocaleDateString("id-ID") : "-";
      const endDate = search.endDate ? new Date(search.endDate).toLocaleDateString("id-ID") : "-";
      
      tableColumn[0].push({
        content: `${startDate} - ${endDate}`,
        colSpan: 6 * weeksChunk.length,
        styles: { halign: "center" }
      });
  
      // Add subheaders
      tableColumn.push([]);
      weeksChunk.forEach((_, idx) => {
        tableColumn[1].push({ 
          content: `Hari-${idx + 1}`, 
          colSpan: 6 
        });
      });
  
      tableColumn.push([]);
      weeksChunk.forEach(() => {
        tableColumn[2].push({ content: "PAGI", colSpan: 3 });
        tableColumn[2].push({ content: "MALAM", colSpan: 3 });
      });
  
      tableColumn.push([]);
      weeksChunk.forEach(() => {
        ["H", "I", "A", "H", "I", "A"].forEach((label) => {
          tableColumn[3].push(label);
        });
      });
  
      // Add summary columns
      tableColumn[0].push(
        { content: "% Hadir", rowSpan: 4 },
        { content: "% Izin", rowSpan: 4 },
        { content: "% Alpha", rowSpan: 4 }
      );
    }
  
    // Build table rows
    const tableRows = [];
    Object.keys(recap).forEach((key, idx) => {
      const recapData = recap[key]
        .slice()
        .sort((a, b) => new Date(a.week_start) - new Date(b.week_start))
        .reverse()
        .filter(item => weeksChunk.some(chunkItem => chunkItem.week_start === item.week_start));
  
      // Calculate percentages
      const totals = recapData.reduce((acc, data) => ({
        hadir: acc.hadir + data.jumlah_hadir_pagi + data.jumlah_hadir_malam,
        izin: acc.izin + data.jumlah_izin_pagi + data.jumlah_izin_malam,
        alfa: acc.alfa + data.jumlah_alfa_pagi + data.jumlah_alfa_malam,
      }), { hadir: 0, izin: 0, alfa: 0 });
  
      const total = totals.hadir + totals.izin + totals.alfa;
      const percentages = {
        hadir: total ? `${Math.round((totals.hadir / total) * 100)}%` : "0%",
        izin: total ? `${Math.round((totals.izin / total) * 100)}%` : "0%",
        alfa: total ? `${Math.round((totals.alfa / total) * 100)}%` : "0%",
      };
  
      const rowData = [
        idx + 1,
        recapData[0]?.name || "",
        recapData[0]?.gender ? "L" : "P",
        recapData.length * 2, // Total sessions (pagi + malam)
        ...recapData.flatMap(data => [
          data.jumlah_hadir_pagi,
          data.jumlah_izin_pagi,
          data.jumlah_alfa_pagi,
          data.jumlah_hadir_malam,
          data.jumlah_izin_malam,
          data.jumlah_alfa_malam,
        ]),
        percentages.hadir,
        percentages.izin,
        percentages.alfa,
      ];
  
      tableRows.push(rowData);
    });
  
    return { tableColumn, tableRows };
  }

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
        const startDate = search.startDate ? new Date(search.startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";
        const endDate = search.endDate ? new Date(search.endDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";
        const dateRangeText = `${startDate} - ${endDate}`;
        headerRow1.push(`${dateRangeText}`, "", "", "", "", "");
        headerRow2.push(`Presensi Hari - ${idx + 1}`, "", "", "", "", "");
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

      // Sort recapData by week start date and then reverse the order
      const sortedRecapData = recapData
        .slice()
        .sort((a, b) => new Date(a.week_start) - new Date(b.week_start))
        .reverse(); // Membalik urutan dari kanan ke kiri

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
    // Merge cells for the headers
    const merge = [
      { s: { r: 0, c: 0 }, e: { r: 3, c: 0 } }, // No.
      { s: { r: 0, c: 1 }, e: { r: 3, c: 1 } }, // Nama Lengkap
      { s: { r: 0, c: 2 }, e: { r: 3, c: 2 } }, // Gender
      { s: { r: 0, c: 3 }, e: { r: 3, c: 3 } }, // Jml Jadwal
    ];

    let col = 4;
    weeks.forEach((week, idx) => {
      const startDate = search.startDate ? new Date(search.startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";
      const endDate = search.endDate ? new Date(search.endDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";
      const dateRangeText = `${startDate} - ${endDate}`;

      // Merge only dateRangeText at row 0
      merge.push({ s: { r: 0, c: col }, e: { r: 0, c: col + 5 } });

      // Preserve existing merges
      merge.push({ s: { r: 1, c: col }, e: { r: 1, c: col + 5 } }, { s: { r: 2, c: col }, e: { r: 2, c: col + 2 } }, { s: { r: 2, c: col + 3 }, e: { r: 2, c: col + 5 } });

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
    <div className="min-h-[100svh] flex flex-col items-center justify-start w-full pt-4 pb-16 overflow-x-auto">
      <p className="font-bold text-xl md:text-3xl mb-16">
        Rekap <span className="text-themeTeal">Presensi</span>
      </p>
      <div className="w-full flex flex-col xl:flex-row gap-2 justify-between mb-4">
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
                  {Object.keys(recap).length && (
                    <th
                      className="py-2 px-4 border border-white"
                      colSpan={6 * recap[Object.keys(recap)[0]].length} // Menggabungkan semua kolom presensi
                    >
                      {(() => {
                        const firstItem = recap[Object.keys(recap)[0]][0];
                        const startDate = search.startDate ? new Date(search.startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";
                        const endDate = search.endDate ? new Date(search.endDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";

                        return `${startDate} - ${endDate}`;
                      })()}
                    </th>
                  )}
                </tr>
                <tr>
                  {Object.keys(recap).length &&
                    recap[Object.keys(recap)[0]]
                      .slice()
                      .sort((a, b) => new Date(a.week_start) - new Date(b.week_start)) // Urutkan ascending
                      .map((el: any, idx) => (
                        <th className="py-2 px-4 border border-white" colSpan={6}>
                          {`Presensi Hari - ${idx + 1}`}
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
                      <tr className="even:bg-slate-200 odd:bg-white" key={idx}>
                        <th className="py-2 border border-white">{idx + 1}.</th>
                        <th className="py-2 border border-white">{recap[el][0].name}</th>
                        <th className="py-2 border border-white">{recap[el][0].gender ? "L" : "P"}</th>

                        {/* Urutkan berdasarkan week_end, lalu reverse */}
                        {recap[el]
                          .slice()
                          .sort((a, b) => new Date(a.week_end).getTime() - new Date(b.week_end).getTime()) // Sorting ascending
                          .reverse() // Membalik urutan dari kanan ke kiri
                          .map((item: any, index: number) => {
                            return (
                              <React.Fragment key={index}>
                                <th className="py-2 border border-white">{item.jumlah_hadir_pagi}</th>
                                <th className="py-2 border border-white">{item.jumlah_izin_pagi}</th>
                                <th className="py-2 border border-white bg-red-400 text-white">{item.jumlah_alfa_pagi}</th>
                                <th className="py-2 border border-white">{item.jumlah_hadir_malam}</th>
                                <th className="py-2 border border-white">{item.jumlah_izin_malam}</th>
                                <th className="py-2 border border-white bg-red-400 text-white">{item.jumlah_alfa_malam}</th>
                              </React.Fragment>
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

          {/* <p className="font-bold text-xl md:text-3xl mb-16">
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
          </div> */}
        </>
      )}
    </div>
  );
}

export default RekapPresensi;
