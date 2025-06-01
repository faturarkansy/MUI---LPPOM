import React from "react";
import { XIcon } from "../../icons";
import axiosClient from "../../axios-client";
import Swal from "sweetalert2";

// Interface untuk props komponen Modal
interface ConfirmDeleteModalProps {
  // userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger: boolean;
  setRefreshTrigger: (value: boolean) => void;
  url: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  // userId,
  refreshTrigger,
  setRefreshTrigger,
  url,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      // await axiosClient.delete(`/users/${userId}`);
      await axiosClient.delete(url);
      Swal.fire({
        title: "Success",
        text: "Berhasil menghapus data agent.",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
        customClass: {
          container: "my-swal-container",
        },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        title: "Failed",
        text: "Gagal menghapus data agent.",
        icon: "warning",
        showConfirmButton: false,
        timer: 1000,
        customClass: {
          container: "my-swal-container",
        },
      });
    } finally {
      setTimeout(() => {
        onClose();
        setRefreshTrigger(!refreshTrigger);
      }, 100);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center z-999999"
    >
      <div className="px-2 py-1 rounded-2xl bg-white">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-5 rounded-lg w-[clamp(300px,80vw,500px)] max-h-[90vh] overflow-y-auto shadow-md"
        >
          <div className="flex justify-between items-center">
            <div>Yakin ingin menghapus ?</div>
            <button
              aria-label="close-modal"
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          {/* Submit button */}
          <div className="flex justify-center items-center gap-[10px] mt-5">
            <button
              type="submit"
              onClick={handleDelete}
              className="py-[10px] px-[15px] border-none rounded cursor-pointer bg-red-500 text-white"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
