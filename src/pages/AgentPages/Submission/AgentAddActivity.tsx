import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import Notification from "../../../components/common/Notification";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Option {
    value: string;
    label: string;
}

const AgentAddActivity = () => {
    const todayDate = new Date().toISOString().split("T")[0];
    const [formData, setFormData] = useState({
        submission_id: "",
        date: todayDate,
        status: "",
        activity: "",
        response: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const location = useLocation();
    const submissionId = location.state?.id;
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        if (submissionId) {
            setFormData(prev => ({
                ...prev,
                submission_id: submissionId.toString(),
            }));
        }
    }, [submissionId]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axiosClient.get("/data/activity-status");
                const data = response.data.map((item: any) => ({
                    value: item.id.toString(),
                    label: item.status,
                }));
                setOptions(data);
            } catch (err) {
                console.error("Error fetching options:", err);
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                window.history.back();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await axiosClient.post("/submissions/activity", formData);
            setSuccess("Activity successfully added!");
        } catch (err: any) {
            setError("Failed to submit activity.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Add Activity" />
            {error && (
                <Notification
                    type="error"
                    title="Submission Failed"
                    message={error}
                    onClose={() => setError(null)}
                />
            )}
            {success && (
                <Notification
                    type="success"
                    title="Success"
                    message={success}
                    onClose={() => setSuccess(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-3 px-2">
                <div>
                    <label className="block font-medium">Submission ID</label>
                    <input
                        type="text"
                        name="submission_id"
                        value={formData.submission_id}
                        readOnly
                        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2.5 bg-gray-100"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Date</label>
                    <DatePicker
                        selected={formData.date ? new Date(formData.date) : null}
                        onChange={(date: Date | null) => {
                            setFormData({ ...formData, date: date ? date.toISOString().split('T')[0] : '' });
                        }}
                        dateFormat="dd-MM-yyyy"
                        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2.5 bg-gray-100"
                        placeholderText="Select Date"
                        wrapperClassName="w-full"
                    />
                </div>


                <div>
                    <label htmlFor="status">Status</label>
                    <Select
                        options={options}
                        value={options.find((opt) => opt.value === formData.status)}
                        onChange={(option) =>
                            setFormData((prev) => ({
                                ...prev,
                                status: option?.value || "",
                            }))
                        }
                        className="border border-gray-300 rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                        required

                    />
                    {error?.status && (
                        <span className="text-red-500 text-sm">{error.status[0]}</span>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Activity</label>
                    <input
                        type="text"
                        name="activity"
                        value={formData.activity}
                        onChange={handleChange}
                        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2.5 bg-gray-100"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Response</label>
                    <textarea
                        name="response"
                        value={formData.response}
                        onChange={handleChange}
                        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2.5 bg-gray-100"
                        rows={3}
                        required
                    ></textarea>
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#1874A5] text-white py-2 px-4 rounded hover:bg-gray-500"
                    >
                        {loading ? "Submitting..." : "Tambah Activity"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgentAddActivity;
