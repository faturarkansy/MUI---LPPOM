// src/components/AgentAddActivity.tsx

import { useState } from "react";
import axiosClient from "../../../axios-client";

const AgentAddActivity = () => {
    const [formData, setFormData] = useState({
        submission_id: "",
        date: "",
        status: "",
        activity: "",
        response: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await axiosClient.post("/submissions/activity", formData);
            setSuccess("Activity successfully added!");
            // Opsional: navigate(-1); // kembali ke halaman sebelumnya
        } catch (err: any) {
            setError("Failed to submit activity.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-white border border-gray-300 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Add Activity</h2>

            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Submission ID</label>
                    <input
                        type="text"
                        name="submission_id"
                        value={formData.submission_id}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Status</label>
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Activity</label>
                    <input
                        type="text"
                        name="activity"
                        value={formData.activity}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Response</label>
                    <textarea
                        name="response"
                        value={formData.response}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        rows={3}
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Submitting..." : "Submit Activity"}
                </button>
            </form>
        </div>
    );
};
export default AgentAddActivity;
