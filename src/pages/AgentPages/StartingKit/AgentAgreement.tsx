import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import Notification from "../../../components/common/Notification";
import { useNavigate } from "react-router-dom";

interface ApiData {
    content: string;
}

interface UserData {
    id?: number;
    role?: string;
}

const AgentAgreement: React.FC = () => {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [apiData, setApiData] = useState<ApiData>({ content: "" });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notif, setNotif] = useState<{ message: string; type: "success" | "error" }>({
        message: "",
        type: "success",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get("/agreements");
                const data = response.data;
                setApiData({ content: data.content });
            } catch (error) {
                console.error("Error fetching data:", error);
                setNotif({ message: "Gagal mengambil data. Silakan coba lagi.", type: "error" });
            }
        };

        fetchData();
    }, []);

    const handleAgree = async () => {
        const userData: UserData = JSON.parse(localStorage.getItem("USER") || "{}");

        if (userData?.role !== "agent") {
            setNotif({ message: "Hanya agent yang bisa menyetujui kontrak ini!", type: "error" });
            return;
        }

        setIsLoading(true);

        try {
            // Format waktu menjadi "YYYY-MM-DD HH:mm:ss"
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace("T", " "); // "2025-06-08 14:27:29"

            // Simpan tnc_accept_at ke localStorage USER
            const updatedUserData = {
                ...userData,
                tnc_accept_at: formattedDate,
            };
            localStorage.setItem("USER", JSON.stringify(updatedUserData));

            // Kirim data ke server
            const response = await axiosClient.post("/agreements", {
                accept: 1,
            });

            if (response.status === 200) {
                setNotif({ message: "Anda Telah Menyetujui\nTerms & Conditions", type: "success" });
                setTimeout(() => {
                    navigate("/change-password");
                }, 1000);
            } else {
                setNotif({ message: "Gagal menyetujui. Silakan coba lagi.", type: "error" });
            }
        } catch (error) {
            console.error("Error submitting agreement:", error);
            setNotif({ message: "Error saat submit. Silakan coba lagi nanti.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center sm:items-start mt-0 sm:mt-8 px-6 sm:px-0 justify-center">
            <div className="w-full max-w-md text-left">
                {/* Title (Hardcoded) */}
                <h1 className="text-3xl font-bold text-left w-full max-w-md">Terms & Conditions</h1>

                {/* Scrollable Content Box */}
                <div className="w-full border border-black my-6 bg-gray-100 rounded-lg p-1 overflow-hidden">
                    <div className="h-48 overflow-y-auto px-2">
                        <p className="text-sm whitespace-pre-line">{apiData.content || "Loading content..."}</p>
                    </div>
                </div>

                {/* Checkbox */}
                <label className="flex items-center space-x-2 w-full mb-6">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                        className="h-5 w-5"
                    />
                    <span className="text-sm">I Agree to the contract</span>
                </label>

                {/* Agree Button */}
                <button
                    disabled={!isChecked || isLoading}
                    onClick={handleAgree}
                    className={`w-full max-w-md py-3 text-white font-bold rounded transition ${isChecked ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isLoading ? "Uploading..." : "Agree"}
                </button>

                {/* Notification */}
                <Notification
                    message={notif.message}
                    type={notif.type}
                    onClose={() => setNotif({ message: "", type: "success" })}
                />
            </div>
        </div>
    );
};

export default AgentAgreement;
