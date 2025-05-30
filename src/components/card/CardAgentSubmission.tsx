import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";
import axios from "axios";

// Tipe data item
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
                    status: item.status
                }));

                setDataPelakuUsaha(formattedData);
                console.log("data pelaku usaha: ", formattedData)
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
                {/* Kontainer overflow untuk tabel */}
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
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
                                        <Link
                                            to={`/agent-detail-submission/${item.id}`}
                                            className="text-black hover:underline text-sm font-medium"
                                        >
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </Link>
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
                    <div
                        key={item.id}
                        className="w-full bg-white border border-gray-200 rounded-xl shadow-sm my-3"
                    >
                        {/* Top Row */}
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

                        {/* Bottom Row */}
                        <div className="flex justify-between items-center border-black border-t p-4">
                            <p className="text-sm font-bold text-black truncate">
                                {item.product_type_id}
                            </p>
                            <div className="flex justify-end">
                                <Link
                                    to={`/agent-detail-submission/${item.id}`}
                                    className="inline-block px-4 py-1.5 text-xs font-semibold bg-black text-white rounded-lg"
                                >
                                    Detail
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardAgentSubmission;
