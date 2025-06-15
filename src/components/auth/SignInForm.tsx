import { useState, createRef } from "react";
import { isMobile } from "react-device-detect";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useStateContext } from "../../context/ContextProvider.js";
import axiosClient from "../../axios-client.js";
import Notification from "../../components/common/Notification";

export default function SignInForm() {
  const { setUser, setToken } = useStateContext();
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const emailRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();

  const device = isMobile ? "Mobile" : "Desktop";

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setErrors({}); // Reset error field

    const email = emailRef.current?.value?.trim() || "";
    const password = passwordRef.current?.value?.trim() || "";

    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Field email harus diisi";
    if (!password) newErrors.password = "Field password harus diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = { email, password, device };
    axiosClient
      .post("/tokens", payload)
      .then(({ data }) => {
        // Cek apakah role-nya agent
        if (data.role !== "agent") {
          // Jika bukan agent, tampilkan notifikasi dan jangan set user/token
          setNotification({
            message: "Invalid Credentials",
            type: "error",
          });
          return; // hentikan proses
        }

        // Jika agent, baru set user dan token
        const user = {
          id: data.id,
          role: data.role,
          name: data.name,
          email: data.email,
          tnc_accept_at: data.tnc_accept_at,
          password_change_at: data.password_change_at,
          test_passed_at: data.test_passed_at,
          status: data.status,
        };
        const token = data.token;

        setUser(user);
        setToken(token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          // Validasi dari backend
          setErrors(response.data.errors || {});
        } else {
          // Error kredensial atau lainnya
          setNotification({
            message: response?.data?.message || "Terjadi kesalahan kredensial. Silakan periksa kembali email dan password Anda.",
            type: "error",
          });
        }
      });
  };

  return (
    <div className="w-full p-6 md:p-8">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <h1 className="text-3xl font-bold text-[#670075] mb-2">Sign In</h1>
      <p className="text-gray-600 mb-8">Sign in with the account you registered.</p>
      <form className="space-y-8" onSubmit={onSubmit}>
        <div>
          <input
            id="email"
            ref={emailRef}
            type="email"
            className="dark:bg-dark-900 mt-8 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            placeholder="Email or Username"
          />
          {errors.email?.[0] && (
            <span className="text-sm text-red-500">{errors.email[0]}</span>
          )}
        </div>

        <div className="relative">
          <input
            id="password"
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? "hide" : "show"}
          </button>
          {errors.password?.[0] && (
            <span className="text-sm text-red-500">{errors.password[0]}</span>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex mt-12 w-full items-center justify-center px-4 py-2 text-md font-medium text-white transition rounded-md bg-[#7EC34B] shadow-theme-xs"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
