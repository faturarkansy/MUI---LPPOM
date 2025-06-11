// src/pages/SubmissionDetailPage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../../axios-client";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { PlusCircle } from "lucide-react";

interface Submission {
    id: number;
    status: {
        status: string;
        edit: boolean;
    };
    company: {
        name: string;
        province: { name: string };
        regency: { name: string };
        district: { name: string };
        village: { name: string };
        business_scale: { name: string };
        nib: number;
        attr: {
            address: string;
            phone: string;
            email: string;
            pic_name: string;
            pic_phone: string;
            pic_email: string;
        };
    };
    user: {
        name: string;
    }
    product_type: { type: string };
    type: string;
    date: string;
    facility: string;
    product: string;
    activities: Activity[];
}

interface Activity {
    activity: string;
    response: string;
    date: string;
    status: {
        status: string;
    };
}

const AgentDetailSubmission = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [item, setItem] = useState<Submission | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const submissionId = location.state?.id;
    useEffect(() => {
        if (!submissionId) {
            navigate(-1);
            return;
        }

        const fetchSubmission = async () => {
            try {
                const res = await axiosClient.get(`/submissions/${submissionId}`);
                console.log(res.data);
                setItem({
                    ...res.data,
                    activities: res.data.activity,
                });
            } catch (error) {
                console.error("Failed to fetch submission detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [submissionId, navigate]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (!item) return <div className="p-4">Submission not found.</div>;

    const toTitleCase = (str: string): string =>
        str
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    const formattedData = [
        { label: "NIB", value: item.company?.nib },
        { label: "Status", value: item.status?.status || "-" },
        { label: "Skala Bisnis", value: item.company?.business_scale?.name || "-" },
        { label: "Lokasi", value: "" },
        {
            label: "Provinsi", value: item.company?.province?.name
                ? toTitleCase(item.company?.province?.name)
                : "-",
        },
        {
            label: "Kabupaten / Kota", value: item.company?.regency?.name
                ? toTitleCase(item.company?.regency?.name)
                : "-",
        },
        {
            label: "Kecamatan", value: item.company?.district?.name
                ? toTitleCase(item.company?.district?.name)
                : "-",
        },
        {
            label: "Kelurahan / Desa", value: item.company?.village?.name
                ? toTitleCase(item.company?.village?.name)
                : "-",
        },
        { label: "Jenis Produk", value: item.product_type?.type || "-" },
        { label: "Tanggal Pembuatan", value: item.date || "-" },
        { label: "Jenis Pengajuan", value: item.type || "-" },
        { label: "Jumlah Fasilitas", value: item.facility || "-" },
        { label: "Jumlah Produk", value: item.product || "-" },
        { label: "Alamat Perusahaan", value: item.company?.attr?.address || "-" },
        { label: "Telepon Perusahaan", value: item.company?.attr?.phone || "-" },
        { label: "Email Perusahaan", value: item.company?.attr?.email || "-" },
        { label: "Nama PIC", value: item.company?.attr?.pic_name || "-" },
        { label: "Telepon PIC", value: item.company?.attr?.pic_phone || "-" },
        { label: "Email PIC", value: item.company?.attr?.pic_email || "-" },
    ];


    return (
        <div>
            <PageBreadcrumb pageTitle="Detail Submission" />

            <div className="flex justify-between mt-3 pl-2">
                <div>
                    <div className="text-lg font-bold">{item.company?.name}</div>
                    <div className="text-sm text-gray-500">Submission ID : {item.id}</div>
                </div>
                <div>
                    <button
                        disabled={!item.status?.edit}
                        className={`sm:py-2 py-1 sm:px-3 px-1.5 inline-flex items-center gap-x-2 text-xs sm:text-sm font-bold border-2 rounded-lg 
                            ${item.status.edit
                                ? "border-[#7EC34B] text-[#7EC34B] bg-white hover:bg-gray-200"
                                : "border-gray-400 text-gray-400 bg-gray-100 cursor-not-allowed"
                            }`}
                        onClick={() => {
                            if (item.status?.edit) {
                                sessionStorage.setItem("submissionId", item.id.toString());
                                navigate("/submission/detail-submission/edit-submission", {
                                    state: { id: item.id, allowed: true, },
                                });
                            }
                        }}
                    >
                        <PlusCircle size={20} />
                        Edit Submission
                    </button>

                </div>

            </div>

            <div className="border border-gray-400 rounded-lg p-4 mt-3 bg-white">
                {formattedData.map((field, index) => {
                    // Tentukan apakah perlu diberi padding kiri
                    const indentedLabels = [
                        "Provinsi",
                        "Kabupaten / Kota",
                        "Kecamatan",
                        "Kelurahan / Desa",
                    ];
                    const isIndented = indentedLabels.includes(field.label);

                    return (
                        <div
                            key={index}
                            className={`mb-1 flex items-start gap-y-4 gap-x-2 text-xs sm:text-sm ${isIndented ? "pl-4" : ""}`}
                        >
                            <span className="font-medium whitespace-nowrap">{field.label}</span> :
                            {field.label === "Jenis Produk" ? (
                                <div className="border px-1 py-0 rounded w-full max-w-md h-[60px] overflow-auto bg-gray-50">
                                    {field.value}
                                </div>
                            ) : (
                                <span>{field.value}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Activity Section */}
            <div className="mt-4 mb-14">
                <h3 className="text-lg px-2 font-semibold border-b-2 border-[#1874A5] pb-1 mb-3 text-[#1874A5]">Activity</h3>

                {item.activities?.length > 0 ? (
                    item.activities.map((activity, idx) => (
                        <div key={idx} className="border border-gray-400 rounded-lg py-3 mb-3">
                            <div className="flex justify-between px-3 pb-1">
                                <div>
                                    <div className="font-semibold">{activity.activity}</div>
                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                        <span>
                                            {new Date(activity.date).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                                        <span>{item.user.name}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs bg-gray-300 px-2 py-1 rounded">
                                        {activity?.status?.status || "Unknown"}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 border-t-1 border-black px-3 pt-3">Respon : {activity.response}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-500 px-2">Belum ada aktivitas.</div>
                )}


                <button
                    className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 gap-2  shadow-lg  transition z-50
                    mt-3 sm:py-2 py-1 sm:px-3 px-1.5 inline-flex items-center gap-x-2 text-xs sm:text-sm font-bold border-2 border-[#7EC34B] rounded-lg bg-white text-[#7EC34B] hover:bg-gray-200"
                    onClick={() => {
                        sessionStorage.setItem("submissionId", item.id.toString()); // simpan ID sementara
                        navigate("/submission/detail-submission/add-activity", {
                            state: { id: item.id }, // tetap kirim via state
                        });
                    }}
                >
                    <PlusCircle size={20} />
                    Add Activity
                </button>

            </div>
        </div>
    );
};

export default AgentDetailSubmission;
