import { useState, useRef } from "react";
import { isMobile } from "react-device-detect";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosClient from "../../axios-client.js";
import Notification from "../common/Notification.js";

export default function ChangePasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" }>({
        message: "",
        type: "success",
    });

    const oldPasswordRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const device = isMobile ? "Mobile" : "Desktop";

    const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const payload = {
            old_password: oldPasswordRef.current?.value,
            new_password: passwordRef.current?.value,
            confirm_password: confirmPasswordRef.current?.value,
            device,
        };

        try {
            // 🔥 Sesuaikan endpoint sesuai API yang kamu gunakan
            const { data } = await axiosClient.post("/users", payload);
            setNotification({ message: data.message || "Password berhasil diubah!", type: "success" });
        } catch (err: any) {
            const response = err.response;
            if (response && response.data && response.data.message) {
                setNotification({ message: response.data.message, type: "error" });
            } else {
                setNotification({ message: "Terjadi kesalahan.", type: "error" });
            }
        }
    };

    return (
        <div className="w-full max-w-md p-6 md:p-10 space-y-4">
            <h2 className="text-4xl font-bold text-[#1975a6] text-left">Change Password</h2>
            <p className="text-lg font-bold text-gray-400 text-left">We recommend you to change your password</p>

            <form className="space-y-6" onSubmit={onSubmit}>
                {/* Password Lama */}
                <div className="relative">
                    <input
                        id="old_password"
                        ref={oldPasswordRef}
                        type={showOldPassword ? "text" : "password"}
                        className="w-full border border-black px-3 py-2"
                        placeholder="Password Lama"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

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
