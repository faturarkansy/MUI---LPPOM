import ChangePasswordForm from "../../components/auth/ChangePasswordForm";

export default function ChangePassword() {

    return (
        <>
            <div id="marketing-banner" tabIndex={-1} className="fixed z-50 flex flex-col md:flex-row justify-between w-[calc(100%-2rem)] p-4 -translate-x-1/2 rounded-lg shadow-xs left-1/2 top-3">
                <div className="flex flex-col items-start mb-3 me-4 md:items-center md:flex-row md:mb-0">
                    <a href="#" className="flex items-center mb-2 md:pe-4 md:me-4 md:mb-0">
                        <img src="/images/logo/MUI.png" className="h-8 me-2" alt="Flowbite Logo" />
                        <span className="self-center text-lg font-semibold text-white whitespace-nowrap dark:text-white">LPPOM MUI</span>
                    </a>
                </div>
            </div>

            <div className="min-h-screen bg-custom-body flex items-center justify-center">
                <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg bg-white mx-4">
                    <div className="w-full md:w-1/2 p-2 md:p-8">
                        <ChangePasswordForm />
                    </div>

                    <div className="hidden md:flex w-full md:w-1/2 bg-custom-side-right text-white p-8 md:p-12 flex flex-col justify-end items-start">
                        <h3 className="text-3xl font-extrabold">LPPOM MUI</h3>
                        <p className="text-white text-lg font-thin">Leading in Halal Assurance Solutions</p>
                    </div>
                </div>
            </div>
        </>
    );
}