// CardAgentSubmission.tsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Submission {
    id: number;
    name: string;
    product_type_id: string;
    date: string;
    type: string;
    status: string;
}

interface Props {
    searchQuery: string;
    filters?: {
        name: string;
        id: string;
        date: string;
        status: string;
    };
    filterAppliedTrigger?: number;
}


const CardAgentSubmission: React.FC<Props> = ({ searchQuery, filters, filterAppliedTrigger }) => {
    const navigate = useNavigate();
    const [dataPelakuUsaha, setDataPelakuUsaha] = useState<Submission[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listResponse = await axiosClient.get("/submissions");
                const submissionList = listResponse.data.data;

                if (!Array.isArray(submissionList)) {
                    console.error("Expected array but got:", submissionList);
                    return;
                }

                const detailedDataPromises = submissionList.map((item: any) =>
                    axiosClient.get(`/submissions/${item.id}`).then(res => res.data)
                );

                const detailedData = await Promise.all(detailedDataPromises);

                const formattedData = detailedData.map((item: any) => ({
                    id: item.id,
                    name: item.company?.name || "-",
                    product_type_id: typeof item.product_type?.type === 'string' ? item.product_type.type : JSON.stringify(item.product_type?.type),
                    date: item.date,
                    type: item.type,
                    status: item.status?.status || "-",
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
    }, [filterAppliedTrigger]);


    const filteredData = dataPelakuUsaha.filter((item) => {
        const nameMatch = filters?.name
            ? item.name.toLowerCase().includes(filters.name.toLowerCase())
            : true;
        const idMatch = filters?.id ? item.id.toString().includes(filters.id) : true;
        const dateMatch = filters?.date ? item.date.includes(filters.date) : true;
        const statusMatch = filters?.status
            ? item.status.toLowerCase().includes(filters.status.toLowerCase())
            : true;

        const searchMatch = item.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        return nameMatch && idMatch && dateMatch && statusMatch && searchMatch;
    });


    return (
        <div>
            <div className="hidden md:block mt-3">
                <div className="max-w-full overflow-x-auto rounded-xl border border-gray-200">
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
                            {filteredData.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="max-w-[200px] overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                                            <span className="inline-block whitespace-nowrap">{item.product_type_id}</span>
                                        </div>

                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.status}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => navigate("/submission/detail-submission", { state: { id: item.id } })}
                                            className="inline-block sm:py-2 py-1.5 sm:px-3 px-2 text-xs sm:text-sm font-semibold bg-black border-2 border-black text-white rounded-lg hover:bg-gray-400 hover:text-black"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredData.length === 0 && (
                    <div className="text-center text-sm text-gray-500 mt-4">
                        Submission yang anda cari tidak ditemukan
                    </div>
                )}
            </div>

            {/* Tampilan Mobile */}
            <div className="md:hidden mt-3">
                {filteredData.map((item) => (
                    <div key={item.id} className="w-full bg-white border-1 border-gray-400 rounded-xl shadow-sm my-3">
                        <div className="flex justify-between items-start p-4">
                            <div>
                                <h3 className="text-base font-semibold text-black">{item.name}</h3>
                                <p className="text-xs text-gray-500">{item.date}</p>
                            </div>
                            <div>
                                <span
                                    className="px-2 pt-0.5 pb-1 text-xs rounded-full font-medium bg-gray-200 text-black">{item.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-black border-t p-4">
                            <p className="text-sm font-bold text-black truncate">ID Submission : {item.id}</p>
                            <button
                                type="button"
                                onClick={() => navigate("/submission/detail-submission", { state: { id: item.id } })}
                                className="inline-block sm:py-2 py-1.5 sm:px-3 px-2 text-xs sm:text-sm font-semibold bg-black border-2 border-black text-white rounded-lg hover:bg-gray-400 hover:text-black"
                            >
                                Detail
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardAgentSubmission;


