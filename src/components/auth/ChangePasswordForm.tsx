import { useEffect, useState, useRef } from "react";
import { isMobile } from "react-device-detect";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosClient from "../../axios-client.js";
import Notification from "../common/Notification.js";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordForm() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" }>({
        message: "",
        type: "success",
    });

    const [userDetail, setUserDetail] = useState<{ name: string; email: string } | null>(null);

    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const device = isMobile ? "Mobile" : "Desktop";

    // Ambil data user dari API saat komponen dimount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("USER") || "{}");

                if (!userData.id) {
                    setNotification({ message: "User ID tidak ditemukan.", type: "error" });
                    return;
                }

                const res = await axiosClient.get(`/users/${userData.id}`);
                setUserDetail({
                    name: res.data.name,
                    email: res.data.email,
                });
            } catch (err) {
                setNotification({ message: "Gagal mengambil data user.", type: "error" });
            }
        };

        fetchUser();
    }, []);

    const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const new_password = passwordRef.current?.value;
        const confirm_password = confirmPasswordRef.current?.value;

        if (new_password !== confirm_password) {
            setNotification({ message: "Password baru dan konfirmasi tidak sama.", type: "error" });
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
            device,
        };

        try {
            await axiosClient.put("/profiles", payload);
            setNotification({ message: "Password berhasil diubah!", type: "success" });
        } catch (err: any) {
            const response = err.response;
            if (response && response.data && response.data.message) {
                setNotification({ message: response.data.message, type: "error" });
            } else {
                setNotification({ message: "Terjadi kesalahan.", type: "error" });
            }
        }
    };

    const handleSkip = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("USER") || "{}");

            if (!userData.id || !userData.role) {
                setNotification({ message: "Data pengguna tidak ditemukan!", type: "error" });
                return;
            }

            const response = await axiosClient.get(`/users/${userData.id}`);
            const userDetail = response.data;

            const hasTestPassed = !!userDetail.test_passed_at;
            const hasAcceptedTnc = !!userDetail.tnc_accept_at;

            if (hasTestPassed && hasAcceptedTnc) {
                navigate("/agent/submissions");
            } else {
                navigate("/agent/e-learning");
            }
        } catch (error) {
            setNotification({ message: "Gagal memeriksa status user.", type: "error" });
            console.error("Error checking user status:", error);
        }
    };

    return (
        <div className="w-full max-w-md p-6 md:p-10 space-y-4">
            <h2 className="text-4xl font-bold text-[#1975a6] text-left">Change Password</h2>
            <p className="text-lg font-bold text-gray-400 text-left">We recommend you to change your password</p>

            <form className="space-y-6" onSubmit={onSubmit}>
                {/* Password Baru */}
                <div className="relative">
                    <input
                        id="new_password"
                        ref={passwordRef}
                        type={showPassword ? "text" : "password"}
                        className="w-full border border-black px-3 py-2"
                        placeholder="Password Baru"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Konfirmasi Password Baru */}
                <div className="relative">
                    <input
                        id="confirm_password"
                        ref={confirmPasswordRef}
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full border border-black px-3 py-2"
                        placeholder="Konfirmasi Password Baru"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <div className="space-y-1.5">
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 font-semibold rounded-lg"
                    >
                        Change Password
                    </button>

                    <p className="text-lg font-bold text-gray-400 text-center">or</p>

                    <button
                        type="button"
                        className="w-full bg-black text-white py-2 font-semibold rounded-lg"
                        onClick={handleSkip}
                    >
                        Skip
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
