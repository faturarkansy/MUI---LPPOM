import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import axios from "axios";
import SubmissionDetailModal from "../modal/SubmissionDetailModal";

interface Submission {
    id: number;
    name: string;
    product_type_id: string;
    date: string;
    type: string;
    status: string;
}

const CardAgentSubmission: React.FC = () => {
    const [dataPelakuUsaha, setDataPelakuUsaha] = useState<Submission[]>([]);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);

    const handleOpenDetailModal = (id: number) => {
        setSelectedSubmissionId(id);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => setIsDetailModalOpen(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get("/ext/submissions");
                const rawData = response.data.data;
                const formattedData = rawData.map((item: any) => ({
                    id: item.id,
                    name: item.company.name,
                    product_type_id: item.product_type.type,
                    date: item.date,
                    type: item.type,
                    status: item.status,
                }));
                setDataPelakuUsaha(formattedData);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Axios error:", error.response?.data || error.message);
                } else {
                    console.error("Unknown error:", error);
                }
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {/* Tampilan Desktop */}
            <div className="hidden md:block mt-2">
                <div className="max-w-[940px] overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-[#1975a6] text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Pelaku Usaha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Jenis Produk</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Jenis Pengajuan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dataPelakuUsaha.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product_type_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenDetailModal(item.id)}
                                            className="inline-block px-4 py-1.5 text-xs font-semibold bg-black text-white rounded-lg"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tampilan Mobile */}
            <div className="md:hidden mt-4">
                {dataPelakuUsaha.map((item) => (
                    <div key={item.id} className="w-full bg-white border border-gray-200 rounded-xl shadow-sm my-3">
                        <div className="flex justify-between items-start p-4">
                            <div>
                                <h3 className="text-base font-semibold text-black">{item.name}</h3>
                                <p className="text-xs text-gray-500">{item.date}</p>
                            </div>
                            <div>
                                <span
                                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.type === "new"
                                        ? "bg-gray-200 text-black"
                                        : "bg-gray-200 text-black"
                                        }`}
                                >
                                    {item.type === "new" ? "New" : "Development"}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-black border-t p-4">
                            <p className="text-sm font-bold text-black truncate">{item.product_type_id}</p>
                            <button
                                type="button"
                                onClick={() => handleOpenDetailModal(item.id)}
                                className="inline-block px-4 py-1.5 text-xs font-semibold bg-black text-white rounded-lg"
                            >
                                Detail
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Detail */}
            <SubmissionDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                submissionId={selectedSubmissionId}
            />
        </div>
    );
};

export default CardAgentSubmission;
