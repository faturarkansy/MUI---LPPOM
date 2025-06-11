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
        scale?: string;
        submissionType?: string;
    };
    setFilters: (filters: any) => void;
    onApply: () => void;
}

const scales = ["Mikro & Kecil", "Menengah", "Besar", "Luar Negeri"];
const types = ["Pengajuan Baru", "Pengembangan Produk", "Pengembangan Fasilitas"];

const SubmissionFilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    filters,
    setFilters,
    onApply,
}) => {
    const isActive = (value: string, selected: string | undefined) =>
        value === selected
            ? "bg-black text-white border-black"
            : "bg-white text-black border-black";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-99999 flex justify-center items-end sm:items-center backdrop-blur-sm bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full max-w-md z-999999 shadow-lg p-6 bg-white rounded-t-2xl mb-20 sm:rounded-xl sm:mb-0"
                    >
                        <h2 className="text-xl font-bold mb-4">Filter Submission</h2>

                        {/* Skala Bisnis */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Berdasarkan Skala Bisnis</label>
                            <div className="flex flex-wrap gap-2">
                                {scales.map((scale) => (
                                    <button
                                        key={scale}
                                        className={`border px-3 py-1 rounded text-sm ${isActive(scale, filters.scale)}`}
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                scale: filters.scale === scale ? "" : scale,
                                            })
                                        }
                                    >
                                        {scale}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Jenis Pengajuan */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Berdasarkan Jenis Pengajuan</label>
                            <div className="flex flex-wrap gap-2">
                                {types.map((type) => (
                                    <button
                                        key={type}
                                        className={`border px-3 py-1 rounded text-sm ${isActive(type, filters.submissionType)}`}
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                submissionType: filters.submissionType === type ? "" : type,
                                            })
                                        }
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-x-2 mt-5">
                            <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                                Batal
                            </button>
                            <button
                                className="bg-black text-white px-4 py-2 rounded"
                                onClick={() => {
                                    setFilters({
                                        name: "",
                                        id: "",
                                        date: "",
                                        status: "",
                                        scale: "",
                                        submissionType: "",
                                    });
                                }}
                            >
                                Reset
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
