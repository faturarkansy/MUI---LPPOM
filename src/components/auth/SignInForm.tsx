import { useState, createRef } from "react";
import { isMobile } from "react-device-detect";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useStateContext } from "../../context/ContextProvider.js";
import axiosClient from "../../axios-client.js";

export default function SignInForm() {
  const { setUser, setToken } = useStateContext();
  // const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();
  let device: string | null = null;
  if (isMobile) {
    device = "Mobile";
  } else {
    device = "Desktop";
  }

  const onSubmit = (ev: { preventDefault: () => void }) => {
    ev.preventDefault();
    const payload = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      device: device,
    };
    axiosClient
      .post("/tokens", payload)
      .then(({ data }) => {
        const user = {
          id: data.data.user.id,
          role: data.data.user.roles[0].name,
          name: data.data.user.name,
          email: data.data.user.email,
        };
        const token = data.data.token;
        setUser(user);
        console.log("user from signin: ", user);
        console.log("token from signin: ", token);
        setToken(token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          // setMessage(response.data.message);
        }
      });
  };

  return (
    <div className="w-full max-w-md p-6 md:p-10 space-y-12">
      <h2 className="text-4xl font-bold text-[#1975a6] text-left">Login</h2>
      <form className="space-y-8" onSubmit={onSubmit}>
        <div>
          <input
            id="email"
            ref={emailRef}
            type="email"
            className="w-full border border-black px-3 py-2"
            placeholder="Email or Username"
            required
          />
        </div>

        <div className="relative">
          <input
            id="password"
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            className="w-full border border-black px-3 py-2 pr-10"
            placeholder="Password"
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
