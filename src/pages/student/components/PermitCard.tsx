import appSettings from "../../../Appsettings"
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../../AppContext";
import { toast } from "react-toastify";
import { BiSolidTrash } from "react-icons/bi";
import Swal from "sweetalert2";

type PermitCardProps = {
    class_id: number
    class_name: string
    class_type: string
    start_date: string
    end_date: string
    description: string
    is_approved: boolean
    img_url: string,
    fetchData: () => void
}

function PermitCard({ class_id, class_name, class_type, start_date, end_date, is_approved, description, img_url, fetchData }: PermitCardProps) {
    const token = useContext(AppContext).token.data;
    const setToken = useContext(AppContext).token.set;

    function deletePermit() {
        Swal.fire({
            title: 'Apakan anda yakin ingin menghapus izin?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${appSettings.api}/permits?classId=${class_id}`, {
                    headers: { authorization: `Bearer ${token}` }
                }).then(res => {
                    toast.success(res.data.msg, { theme: "colored" });
                    fetchData();
                }).catch(err => {
                    if (err.response.status === 401) {
                        toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
                        localStorage.setItem('token', '');
                        setToken('');
                    } else {
                        toast.error(err.response.data.msg, { theme: "colored" })
                    }
                })
            } else if (result.isDenied) {
                return
            }
        });

    }

    return (
        <div className="w-full max-w-6xl bg-[#f6f6f6]/50 p-8 shadow-md flex flex-col rounded-xl mb-8 relative">
            <BiSolidTrash className='absolute text-2xl right-8 cursor-pointer' onClick={deletePermit} />
            <p className="font-bold text-lg mb-2">{class_name}</p>
            <p className="font-light text-sm mb-2">{class_type} ({(new Date(start_date)).toLocaleString('id').substring(0, 16)} - {(new Date(end_date)).toLocaleString('id').split(' ')[1].substring(0, 5)})</p>
            <p className={`font-semibold text-sm mb-6 ${is_approved ? 'text-themeTeal' : 'text-themeRed'}`}>{is_approved ? 'Disetujui' : 'Belum disetujui'}</p>
            <p className="mb-4">{description}</p>
            <img src={`${appSettings.api}${img_url}`} alt="" className="max-h-96 w-fit mx-auto" />
        </div>
    );
}
export default PermitCard;