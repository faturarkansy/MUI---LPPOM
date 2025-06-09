import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        name: string;
        id: string;
        date: string;
        status: string;
    };
    setFilters: (filters: any) => void;
    onApply: () => void;
}

const SubmissionFilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    filters,
    setFilters,
    onApply,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-99999 flex items-end justify-center backdrop-blur-sm bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white z-999999 w-full max-w-md p-6 mb-20 rounded-t-2xl shadow-lg"
                    >
                        <h2 className="text-xl font-bold mb-4">Filter Submission</h2>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">Nama</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 p-2 rounded focus:border-[#1975a6]  focus:border-2 focus:outline-none"
                                value={filters.name}
                                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">ID Submission</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 p-2 rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                                value={filters.id}
                                onChange={(e) => setFilters({ ...filters, id: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">Tanggal</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 p-2 rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                                value={filters.date}
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Status</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 p-2 rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={onClose}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-black text-white px-4 py-2 rounded"
                                onClick={() => {
                                    onApply();
                                    onClose();
                                }}
                            >
                                Terapkan
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SubmissionFilterModal;
