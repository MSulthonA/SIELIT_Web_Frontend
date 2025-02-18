// import { BiSolidTrash } from "react-icons/bi";

// interface AttendanceCardProps {
//     attendance: any;
//     index: number;
//     deleteAttendance: (user_id: number, class_id: number) => void;
//     namaHari: string[];
// }

// const AttendanceCard: React.FC<AttendanceCardProps> = ({ attendance, index, deleteAttendance, namaHari }) => {
//     const startDate = new Date(attendance.start_date);
//     const attendAt = new Date(attendance.attend_at).toLocaleString('id').replace(/\//g, '-').replace(',', '');

//     return (
//         <div className="bg-white rounded-lg shadow-md p-4 mb-4">
//             <div className="flex justify-between items-center mb-2">
//                 <span className="font-bold">No: {index + 1}</span>
//                 <button className="bg-themeRed text-white px-2 py-1 rounded" onClick={() => deleteAttendance(attendance.user_id, attendance.class_id)}>
//                     <BiSolidTrash />
//                 </button>
//             </div>
//             <p><strong>NIS:</strong> {attendance.nis}</p>
//             <p><strong>Nama:</strong> {attendance.name.length > 24 ? attendance.name.substring(0, 24) + '...' : attendance.name}</p>
//             <p><strong>Kelas:</strong> {attendance.class_type}</p>
//             <p><strong>Pengajian:</strong> {startDate.getHours() > 13 ? startDate.getHours() > 18 ? 'Malam' : 'Sore' : 'Pagi'}</p>
//             <p><strong>Hari:</strong> {namaHari[startDate.getDay()]}</p>
//             <p><strong>Kehadiran:</strong> {attendance.attend_at ? attendAt : 'Not set'}</p>
//             <p><strong>Pengabsen:</strong> {attendance.lastEditBy}</p>
//         </div>
//     );
// };

// export default AttendanceCard;