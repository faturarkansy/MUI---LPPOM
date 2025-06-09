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
    <div className="w-full max-w-md p-6 md:p-10 space-y-12">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <h2 className="text-4xl font-bold text-[#1975a6] text-left">Login</h2>
      <form className="space-y-8" onSubmit={onSubmit}>
        <div>
          <input
            id="email"
            ref={emailRef}
            type="email"
            className="w-full border border-black px-3 py-2"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="relative">
          <input
            id="password"
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            className="w-full border border-black px-3 py-2 pr-10"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-2" />
            Remember Me
          </label>
          <a href="#" className="font-semibold">
            Forget Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
