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
    business_scale: string;
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
    selectedBusinessScale?: string | null;
    selectedSubmissionType?: string | null;
}


const CardAgentSubmission: React.FC<Props> = ({
    searchQuery,
    filters,
    filterAppliedTrigger,
    selectedBusinessScale,
    selectedSubmissionType, }) => {
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
                    business_scale: item.business_scale.name,
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

        const scaleMatch = selectedBusinessScale
            ? item.business_scale.toLowerCase() === selectedBusinessScale.toLowerCase()
            : true;

        const typeMatch = selectedSubmissionType
            ? item.type.toLowerCase() === selectedSubmissionType.toLowerCase()
            : true;

        return nameMatch && idMatch && dateMatch && statusMatch && searchMatch && scaleMatch && typeMatch;
    });



    return (
        <>
            <div className="mt-4 flex flex-col gap-4 lg:hidden">
                {filteredData.map((item) => (
                    <div key={item.id} className="rounded-lg shadow-sm bg-white">
                        <div className="p-4">
                            <div className="mb-4">
                                <div className="text-xs text-gray-300">
                                    Pelaku Usaha |
                                    <span className="inline-block mx-1 px-2 rounded-sm bg-[#7EC34B] text-white text-xs font-medium">
                                        ID - {item.id}
                                    </span>
                                </div>
                                <div className="text-lg font-bold text-gray-900">{item.name || <span className="text-gray-400">Unknown</span>}</div>
                            </div>
                            <hr className="my-4" />
                            <div className="mb-3">
                                <div className="flex">
                                    <div>
                                        <div className="text-xs text-gray-300">Jenis Pengajuan</div>
                                        <div>
                                            <span className="inline-block px-3 py-1 rounded-md bg-[#7EC34B] text-white text-xs font-medium">
                                                {item.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mx-3">
                                        <div className="text-xs text-gray-300">Status</div>
                                        <div>
                                            <span className="inline-block px-3 py-1 rounded-md bg-[#7EC34B] text-white text-xs font-medium">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-300">Tanggal</div>
                                        <div className="text-sm mt-1 font-medium text-gray-900">
                                            {item.date
                                                ? new Date(item.date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })
                                                : <span className="text-gray-400">Unknown</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2">
                            </div>
                        </div>

                        <div className="flex items-center rounded-b-md bg-gray-100 w-full">
                            <button onClick={() => navigate("/submission/detail-submission", { state: { id: item.id } })} className="flex w-full items-center justify-center px-4 py-2 rounded-b-md transition font-medium text-sm bg-gray-300 text-gray-600 border-gray-500">
                                <span className="font-medium">Detail</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CardAgentSubmission;


