import { useEffect } from "react";

interface NotificationProps {
    message: string;
    type?: "success" | "error";
    duration?: number;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
    message,
    type = "success",
    duration = 1500,
    onClose,
}) => {
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    const baseStyle =
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 z-[999999] w-fit max-w-md flex justify-center px-4 py-2 rounded-lg shadow-md";
    const successStyle = "border border-green-400 bg-green-100 text-green-600 font-semibold";
    const errorStyle = "border border-red-400 bg-red-100 text-red-600 font-semibold";

    return (
        <div className={`${baseStyle} ${type === "success" ? successStyle : errorStyle}`}>
            <p className="text-center whitespace-pre-line">{message}</p>
        </div>
    );
};

export default Notification;
