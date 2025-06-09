import React, { useState, useEffect, FormEvent } from "react";
import axiosClient from "../../../axios-client";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Notification from "../../../components/common/Notification";
import { useNavigate } from "react-router-dom";

interface ProfileData {
    name: string;
    email: string;
}

const EditProfile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData>({ name: "", email: "" });
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [notification, setNotification] = useState<{
        title?: string;
        message: string;
        type: "success" | "error";
    }>({
        title: "",
        message: "",
        type: "success",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosClient.get("/profiles");
                const data = res.data;
                setProfile({
                    name: data.name || "",
                    email: data.email || "",
                });
            } catch (error) {
                console.error("Gagal mengambil data profile:", error);
                setNotification({
                    title: "Gagal Memuat",
                    message: "Gagal mengambil data profile",
                    type: "error",
                });
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmit(true);
        try {
            await axiosClient.put("/profiles", profile);

            const storedUser = JSON.parse(localStorage.getItem("USER") || "{}");

            const updatedUser = {
                ...storedUser,
                name: profile.name,
                email: profile.email,
            };

            localStorage.setItem("USER", JSON.stringify(updatedUser));

            setNotification({
                title: "Berhasil",
                message: "Profil berhasil diperbarui.",
                type: "success",
            });
            setTimeout(() => {
                navigate("/profile");
            }, 1500);
        } catch (error: any) {
            console.error("Gagal memperbarui profil:", error);
            console.log("Axios error response:", error.response);
            setNotification({
                title: "Gagal",
                message: "Gagal memperbarui profil",
                type: "error",
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Profile" />
            <form onSubmit={handleSubmit} className="flex flex-col px-6 py-6 gap-4">
                <div>
                    <label htmlFor="name" className="text-sm">Nama</label>
                    <input
                        id="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        type="text"
                        className="block w-full border border-gray-300 p-2 rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="text-sm">Email</label>
                    <input
                        id="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        type="email"
                        className="block w-full border border-gray-300 p-2 rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                        required
                    />
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 text-sm"
                        disabled={isSubmit}
                    >
                        {isSubmit ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>

            {/* Notification */}
            {notification.message && (
                <Notification
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    onClose={() =>
                        setNotification({ title: "", message: "", type: "success" })
                    }
                />
            )}
        </div>
    );
};

export default EditProfile;
