import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../../icons/profile-icon-white.svg";
import { Link } from "react-router";
import axiosClient from "../../../axios-client"; // pastikan path ini sesuai

interface UserData {
    name?: string;
    email?: string;
}

const AgentProfile: React.FC = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData>({});

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("USER") || "{}");
                const userId = storedUser?.id;

                if (!userId) {
                    throw new Error("ID pengguna tidak ditemukan di localStorage");
                }

                const response = await axiosClient.get(`/profiles`);
                const { name, email } = response.data;
                setUserData({ name, email });

            } catch (error) {
                console.error("Gagal mengambil profil pengguna:", error);
                setUserData({
                    name: "Tidak diketahui",
                    email: "Tidak diketahui",
                });
            }
        };

        fetchUserProfile();
    }, []);

    const signOutHandler = () => {
        localStorage.removeItem("USER");
        localStorage.removeItem("ACCESS_TOKEN");
        window.location.reload();
    };

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex flex-row items-center h-20 py-4 px-6 mb-3 rounded-2xl bg-gradient-to-r from-[#87c75a] to-[#d1e9bf] text-white shadow">
                <img src={Profile} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
                <div className="flex flex-col">
                    <p className="text-2xl font-normal">{userData?.name || "Profile tidak ditemukan"}</p>
                    <p className="text-xs font-medium">{userData?.email || "Email tidak ditemukan"}</p>
                </div>
            </div>

            <div className="w-full h-8 bg-gradient-to-r from-[#87c75a] to-[#d1e9bf] flex items-center justify-start px-6 py-3 rounded-2xl text-white">
                <ol className="flex items-center font-medium whitespace-nowrap text-sm">
                    <li className="inline-flex items-center">
                        <Link to="/profile" className="hover:underline">Profile</Link>
                    </li>
                </ol>
            </div>

            {/* Menu Buttons */}
            <div className="flex flex-col px-6 py-8 gap-4">
                <button
                    onClick={() => navigate("/profile/edit-profile")}
                    className="w-full border bg-white border-black rounded-md py-3 px-4 text-left font-medium text-sm flex justify-between items-center hover:bg-gray-100 transition"
                >
                    Edit Profile <span className="text-lg">&gt;</span>
                </button>

                <button
                    onClick={() => navigate("/profile/change-password")}
                    className="w-full border bg-white border-black rounded-md py-3 px-4 text-left font-medium text-sm flex justify-between items-center hover:bg-gray-100 transition"
                >
                    Change Password <span className="text-lg">&gt;</span>
                </button>

                <button
                    onClick={() => navigate("/profile/terms-and-conditions")}
                    className="w-full border bg-white border-black rounded-md py-3 px-4 text-left font-medium text-sm flex justify-between items-center hover:bg-gray-100 transition"
                >
                    View Terms and Conditions <span className="text-lg">&gt;</span>
                </button>
            </div>

            {/* Logout Button */}
            <div className="pb-6 px-6 mt-5">
                <button
                    onClick={signOutHandler}
                    className="w-full py-2 bg-black text-white rounded-md font-semibold text-sm hover:bg-gray-800 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AgentProfile;
