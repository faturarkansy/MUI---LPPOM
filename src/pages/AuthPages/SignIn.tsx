import { useEffect, useState } from "react";
import SignInForm from "../../components/auth/SignInForm";
import backgroundImage from "../../assets/Element.svg";

export default function SignIn() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 900;
      setIsMobile(isMobileView); // Expand hanya saat bukan mobile
    };

    handleResize(); // run on initial load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tampilan Mobile
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        <div className=" flex-1 basis-1/4">
          <div className="min-h-full w-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#1874a5] to-[#a2c7db] text-white px-4 pb-4 relative">
            <h1 className="text-3xl font-bold mb-2">LPPOM</h1>
            <p className="text-sm font-medium text-center">
              Leading in Halal Assurance Solutions
            </p>
          </div>
        </div>

        <div className=" flex-1 basis-3/4 -mt-5">
          <div className="h-full w-full flex  justify-center items-center relative bg-tranparent  ">
            <div className="w-full h-full bg-white rounded-t-3xl shadow-lg relative flex  justify-center items-center pb-20 px-8">
              <SignInForm />

              {/* Curve background */}
              <img
                src={backgroundImage}
                alt="curve"
                className="absolute bottom-0 left-0 w-full pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan Desktop (Expand)
  return (
    <div className="min-h-screen flex flex-row bg-gray-100 overflow-hidden relative">
      {/* Sisi kiri */}
      <div className="w-[60%] flex flex-col items-center justify-center bg-gradient-to-tr from-[#1874a5] to-[#a2c7db] text-white relative z-0">
        <div className="text-center px-10 z-10">
          <h1 className="text-4xl font-bold mb-4">LPPOM</h1>
          <p className="text-lg font-medium">
            Leading in Halal Assurance Solutions
          </p>
        </div>
        <img
          src={backgroundImage}
          alt="curve"
          className="absolute bottom-0 left-0 w-full"
        />
      </div>

      {/* Sisi kanan */}
      <div className="w-[50%] -ml-10 rounded-l-[2rem] flex items-center justify-center bg-white shadow-xl z-10 px-6 pb-8">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
