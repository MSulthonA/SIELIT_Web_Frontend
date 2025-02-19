/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";
import TextInput from "../../components/TextInput";
import { toast } from "react-toastify";
import SelectInput from "../../components/SelectInput";

function BypassPresensi() {
	const [attendances, setAttendances] = useState<any[]>([]);
	const [classes, setClasses] = useState<any[]>([]);
	const [selectedClassId, setSelectedClassId] = useState<any>(0);
	const [search, setSearch] = useState<string>('');
	const token = useContext(AppContext).token.data;
	const setToken = useContext(AppContext).token.set;

	const namaHari = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

	useEffect(() => {
		getClasses();
		getAttendances();
		// const interval = setInterval(() => getAttendances(), 2000);
		// return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		getAttendances();
	}, [selectedClassId]);


	function handleSearch(e: any) {
		setSearch(e.target.value);
	}

	function checkSearch(attendance: any) {
		let searchString = attendance.name + attendance.nis + attendance.class_name + attendance.grade + attendance.status;

		if (attendance.gender) {
			searchString += 'Laki-laki';
		} else {
			searchString += 'Perempuan';
		}

		try {
			const re = new RegExp(search.replace(/\\*/, ''), 'i');
			return re.exec(searchString);
		} catch {
			const re = new RegExp('zzzzzzz', 'i');
			return re.exec(searchString);
		}
	}

	function getClasses() {
		axios.get(`${appSettings.api}/classes`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(res => {
			const classes = res.data.map((classData: any) => {
				const startDate = new Date(classData.start_date);
				const endDate = new Date(classData.end_date);
				return {
					value: classData.id,
					label: `${classData.name} - ${namaHari[startDate.getDay()]} ${startDate.getHours() > 13 ? startDate.getHours() > 18 ? 'malam' : 'sore' : 'pagi'}, ${startDate.toLocaleString('id').replace(/\//g, '-').replace(',', '').split(' ')[0]} (${startDate.toLocaleTimeString('id')} s/d ${endDate.toLocaleTimeString('id')})`
				}
			});
			setClasses(classes);
		}).catch(err => {
			if (err.response.status === 401) {
				localStorage.setItem('token', '');
				setToken('');
				toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
			} else {
				toast.error(err, { theme: "colored" })
			}
		})
	}

	function getAttendances() {
		axios.get(`${appSettings.api}/attendances?classId=${selectedClassId}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(res => {

			setAttendances(res.data);
		}).catch(err => {
			if (err.response.status === 401) {
				localStorage.setItem('token', '');
				setToken('');
				toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
			} else {
				toast.error(err, { theme: "colored" })
			}
		})
	}

	function updateAttendance(user_id: number, class_id: number, status: 'hadir' | 'izin' | null) {
		axios.put(`${appSettings.api}/attendances`, {
			user_id: user_id,
			class_id: class_id,
			status: status,
			attend_at: (new Date()).toISOString()
		}, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(res => {
			getAttendances();
		})
	}

	return (
		<div className="min-h-[100svh] flex flex-col items-center justify-start pt-4 pb-16 grow px-12 overflow-x-scroll">
			<p className="font-bold text-xl md:text-3xl mb-16">Bypass Presensi</p>
			<div className="w-full flex justify-between mb-4">
				<TextInput name="search" title="🔎 masukkan kata kunci" errorMsg="" onChange={handleSearch} className="w-full max-w-md" inputClassName="bg-white" value={search} />
				<SelectInput name="class" title="Pilih kelas" errorMsg="" onChange={(e: any) => { setSelectedClassId(e.target.value); getAttendances() }} className="w-full ml-4" value={selectedClassId} values={classes} />
			</div>
			<div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
				<table className="w-full h-12 text-center">
					<thead className="bg-themeTeal text-white sticky top-0 text-sm">
						<tr>
							<th className="pl-6 py-2">No</th>
							<th className="pl-6 py-2">NIS</th>
							<th className="pl-6 py-2">Nama</th>
							<th className="pl-6 py-2">Kelas</th>
							<th className="pl-6 py-2">Tanggal</th>
							<th className="pl-6 py-2">Keterangan</th>
							<th className="px-6 py-2">Aksi</th>
						</tr>
					</thead>
					<tbody className="text-sm">
						{
							attendances.map((attendance: any, index) => {
								const startDate = new Date(attendance.start_date);

								return (
									checkSearch(attendance) &&
									<tr className="even:bg-slate-200 odd:bg-white" key={index}>
										<td className="pl-6 py-2">{index + 1}</td>
										<td className="pl-6 py-2">{attendance.nis}</td>
										<td className="pl-6 py-2">{attendance.name.length > 24 ? attendance.name.substring(0, 24) + '...' : attendance.name}</td>
										<td className="pl-6 py-2">{attendance.class_name.length > 20 ? attendance.class_name.substring(0, 20) + '...' : attendance.class_name}</td>
										<td className="pl-6 py-2">{startDate.toLocaleString('id')}</td>
										<td>
											<div
												className={`rounded ${attendance.status ? attendance.status === 'hadir' ? 'bg-green-500/70	 text-white ' : 'bg-yellow-500/70 text-white ' : 'bg-red-500/70 text-white'}`}>
												{attendance.status ? attendance.status : 'Not set'}
											</div>
										</td>
										<td className="px-6 py-2 flex flex-wrap gap-2 items-center">
											<button className="bg-themeTeal text-white px-2 py-1 rounded" onClick={() => {
												updateAttendance(attendance.user_id, attendance.class_id, 'hadir');
											}}>
												hadir
											</button>
											<button className="bg-themeOrange text-white px-2 py-1 rounded" onClick={() => {
												updateAttendance(attendance.user_id, attendance.class_id, 'izin')
											}}>
												izin
											</button>
											<button className="bg-[#d9d9d9] px-2 py-1 rounded" onClick={() => {
												updateAttendance(attendance.user_id, attendance.class_id, null)
											}}>
												reset
											</button>
										</td>
									</tr>
								)
							})
						}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default BypassPresensi;