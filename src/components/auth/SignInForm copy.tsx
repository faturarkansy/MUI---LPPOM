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

  const emailRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();

  let device: string | null = null;
  if (isMobile) {
    device = "Mobile";
  } else {
    device = "Desktop";
  }

  const defaultValueFormData = {
    email: '',
    password: ''
  };
  const [formData, setFormData] = useState(defaultValueFormData)
  const [errorValidate, setErrorValidate] = useState(defaultValueFormData)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const onSubmit = (ev: { preventDefault: () => void }) => {
    ev.preventDefault();
    axiosClient
      .post("/tokens", formData)
      .then(({ data }) => {
        const token = data.token;
        setUser(data);
        setToken(token);
        setFormData(defaultValueFormData)
      })
      .catch((xhr) => {
        const response = xhr.response
        if (response.status == 422) {
          const responseData = response.data;
          Object.keys(responseData.errors).forEach(function (key, value) {
            responseData.errors[key] = value[0] || 0;
          });
          setErrorValidate({ ...defaultValueFormData, ...responseData.errors });
        } else {
          setErrorValidate(defaultValueFormData);
          setNotification({
            type: 'error',
            message: response.message || xhr.message
          })
        }
        // const response = err.response;
        // if (err && response.status === 422) {
        //   setErrorValidate(response.errors);
        //   setNotification({
        //     message: response.message || "Login gagal. Silakan cek email dan password.",
        //     type: "error",
        //   });
        // }
        // if(response && response.status === 422){
        //   setNotification({
        //     message: "Terjadi kesalahan inputan email atau password",
        //     type: "error",
        //   });
        // }
      })
      .finally(() => {
        setErrorValidate(defaultValueFormData);
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
            name="email"
            type="email"
            className="w-full border border-black px-3 py-2"
            placeholder="Email or Username"
            value={formData.email}
            onChange={handleChange}
          />
          {errorValidate.email != '' && (<p className="text-sm text-red-500">{errorValidate.email}</p>)}
        </div>
        <div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full border border-black px-3 py-2 pr-10"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errorValidate.password != '' && (<p className="text-sm text-red-500">{errorValidate.password}</p>)}
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
