import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import Notification from "../../../components/common/Notification";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

interface ApiData {
    title: string;
    content: string;
}


const AgentAgreement: React.FC = () => {
    const [apiData, setApiData] = useState<ApiData>({ title: "", content: "" });
    const [notif, setNotif] = useState<{ message: string; type: "success" | "error" }>({
        message: "",
        type: "success",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get("/agreements");
                const data = response.data.data;
                setApiData({ title: data.title, content: data.content });
            } catch (error) {
                console.error("Error fetching data:", error);
                setNotif({ message: "Gagal mengambil data. Silakan coba lagi.", type: "error" });
            }
        };

        fetchData();
    }, []);


    return (
        <div>
            <PageBreadcrumb pageTitle="Terms & Conditions" />
            <div className="flex justify-center px-6 py-6">
                <div className="w-full max-w-md">
                    {/* Scrollable Content Box */}
                    <div className="w-full border border-black my-6 bg-gray-100 rounded-lg p-1 overflow-hidden">
                        <div className="h-48 overflow-y-auto px-2">
                            <p className="text-sm whitespace-pre-line">{apiData.content || "Loading content..."}</p>
                        </div>
                    </div>

                    {/* Notification */}
                    <Notification
                        message={notif.message}
                        type={notif.type}
                        onClose={() => setNotif({ message: "", type: "success" })}
                    />
                </div>
            </div>
        </div>
    );
};

export default AgentAgreement;
