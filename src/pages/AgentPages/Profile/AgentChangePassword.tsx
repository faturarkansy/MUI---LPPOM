import { useEffect, useState, useRef } from "react";
import { isMobile } from "react-device-detect";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosClient from "../../../axios-client.js";
import Notification from "../../../components/common/Notification.js";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useNavigate } from "react-router-dom";

export default function AgentChangePassword() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [notification, setNotification] = useState<{
        title?: string;
        message: string;
        type: "success" | "error";
    }>({
        title: "",
        message: "",
        type: "success",
    });


    const [userDetail, setUserDetail] = useState<{
        name: string;
        email: string;
        meta: {
            gender: string;
            phone: string;
        };
    } | null>(null);

    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const device = isMobile ? "Mobile" : "Desktop";

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("USER") || "{}");

        if (!userData.id || !userData.name || !userData.email) {
            setNotification({ message: "Informasi user tidak lengkap di localStorage.", type: "error" });
            return;
        }

        // Ambil data meta (gender, phone) dari API
        axiosClient.get("/profiles")
            .then((response) => {
                const metaData = response.data.meta || {};

                setUserDetail({
                    name: userData.name,
                    email: userData.email,
                    meta: {
                        gender: metaData.gender || "",
                        phone: metaData.phone || "",
                    },
                });

                console.log("=== Data Lengkap User ===");
                console.log("Name:", userData.name);
                console.log("Email:", userData.email);
                console.log("Gender:", metaData.gender || "Tidak ditemukan");
                console.log("Phone:", metaData.phone || "Tidak ditemukan");
            })
            .catch((err) => {
                console.error("Gagal memuat data profil:", err);
                setNotification({ message: "Gagal memuat data profil.", type: "error" });
            });
    }, []);

    const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const new_password = passwordRef.current?.value;
        const confirm_password = confirmPasswordRef.current?.value;

        if (new_password !== confirm_password) {
            setNotification({
                title: "Validation Error",
                message: "Password baru dan konfirmasi tidak sama.",
                type: "error"
            });

            return;
        }

        if (!userDetail) {
            setNotification({ message: "Data user belum tersedia.", type: "error" });
            return;
        }

        const payload = {
            name: userDetail.name,
            email: userDetail.email,
            password: new_password,
            password_confirmation: confirm_password,
            meta: {
                gender: userDetail.meta.gender,
                phone: userDetail.meta.phone,
            },
            device,
        };

        try {
            await axiosClient.put("/profiles/password", payload);
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
            const currentUser = JSON.parse(localStorage.getItem("USER") || "{}");
            const updatedUser = {
                ...currentUser,
                password_change_at: formattedDate,
            };
            localStorage.setItem("USER", JSON.stringify(updatedUser));

            setNotification({
                title: "Password Updated",
                message: "Password berhasil diubah!",
                type: "success"
            });
            setTimeout(() => {
                navigate("/profile");
            }, 1500);
        } catch (err: any) {
            const response = err.response;
            if (response?.data?.message) {
                setNotification({ message: response.data.message, type: "error" });
            } else {
                setNotification({ message: "Terjadi kesalahan.", type: "error" });
            }
        }
    };



    return (
        <div>
            <PageBreadcrumb pageTitle="Change Password" />
            <form className="flex flex-col px-6 py-6 gap-4" onSubmit={onSubmit}>
                {/* Password Baru */}
                <div className="relative">
                    <label htmlFor="name" className="text-sm">New Password</label>
                    <input
                        id="new_password"
                        ref={passwordRef}
                        type={showPassword ? "text" : "password"}
                        className="block w-full border border-gray-300 p-2 rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                        placeholder="Password Baru"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Konfirmasi Password Baru */}
                <div className="relative">
                    <label htmlFor="name" className="text-sm">Confirm Password</label>
                    <input
                        id="confirm_password"
                        ref={confirmPasswordRef}
                        type={showConfirmPassword ? "text" : "password"}
                        className="block w-full border border-gray-300 p-2 rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                        placeholder="Konfirmasi Password Baru"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 text-sm"
                    >
                        Change Password
                    </button>
                </div>

            </form>

            {/* Notifikasi */}
            {notification.message && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "success" })}
                />
            )}
        </div>
    );
}
