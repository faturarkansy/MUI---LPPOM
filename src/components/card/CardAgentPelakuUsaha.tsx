import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import axios from "axios";
import { Link } from "react-router-dom";

interface PelakuUsaha {
    id: number;
    name: string;
    location_name: string;
    business_scale_name: string;
}

const CardAgentPelakuUsaha: React.FC = () => {
    const [dataPelakuUsaha, setDataPelakuUsaha] = useState<PelakuUsaha[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get("/ext/companies");
                const rawData = response.data.data;

                const formatted = rawData.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    location_name: item.location.name || "-",
                    business_scale_name: item.business_scale?.name || "-",
                }));

                setDataPelakuUsaha(formatted);
                console.log("Pelaku Usaha Data:", formatted);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Axios error:", error.response?.data || error.message);
                } else {
                    console.error("Unexpected error:", error);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="hidden md:block mt-2">
                <div className="overflow-x-auto w-full rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#1975a6] text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">NAME</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">LOKASI</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">SKALA USAHA</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dataPelakuUsaha.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.business_scale_name}</td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <Link to={`/agent-detail-submission/${item.id}`} className="text-black hover:underline">
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
                                <p className="text-xs text-gray-500">{item.business_scale_name}</p>
                            </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex justify-between items-center border-black border-t p-4">
                            <p className="text-sm font-bold text-black truncate">
                                {item.location_name}
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

export default CardAgentPelakuUsaha;
