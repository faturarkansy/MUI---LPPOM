import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface NotificationProps {
    title?: string;
    message: string;
    type?: "success" | "error";
    duration?: number;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
    title,
    message,
    type = "success",
    duration = 3000,
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
        "fixed top-3 sm:top-6 right-4 sm:right-6 z-[999999] w-fit max-w-sm flex items-start gap-3 px-4 py-3 rounded-lg shadow-md";

    const successStyle =
        "border border-green-200 bg-white text-green-800";
    const errorStyle =
        "border border-red-200 bg-white text-red-800";

    const Icon = type === "success" ? CheckCircle : XCircle;
    const iconColor = type === "success" ? "text-green-500" : "text-red-500";

    return (
        <div className={`${baseStyle} ${type === "success" ? successStyle : errorStyle}`}>
            <Icon className={`w-5 h-5 mt-1 ${iconColor}`} />
            <div>
                <p className="font-semibold text-black">
                    {title || (type === "success" ? "Successfully" : "Failed")}
                </p>
                <p className="text-sm text-gray-400">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default Notification;
