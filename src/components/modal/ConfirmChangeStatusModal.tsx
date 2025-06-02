import React, { useState, useEffect } from "react";
import { XIcon } from "../../icons";
import axiosClient from "../../axios-client";
import Swal from "sweetalert2";

interface ConfirmChangeStatusModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger: boolean;
  setRefreshTrigger: (value: boolean) => void;
}

interface Meta {
  gender: string | null;
  phone: string | null;
}

interface UserData {
  region_id: number | null;
  parent_id: number | null;
  name: string;
  email: string;
  role: string;
  status: number;
  meta: Meta[];
}

const initialUserData: UserData = {
  region_id: null,
  parent_id: null,
  name: "",
  email: "",
  role: "",
  status: 1,
  meta: [
    {
      gender: "",
      phone: "",
    },
  ],
};

const ConfirmChangeStatusModal: React.FC<ConfirmChangeStatusModalProps> = ({
  isOpen,
  onClose,
  userId,
  refreshTrigger,
  setRefreshTrigger,
}) => {
  const [payloadForPut, setPayloadForPut] = useState<UserData>(initialUserData);

  useEffect(() => {
    const fetchUserData = async () => {
      const axiosResponse = await axiosClient.get(`/users`);
      console.log("User ID : ", userId, ", typeof userId : ", typeof userId);
      const currentUserData = axiosResponse.data.data.find(
        (user: { id: number }) => user.id === userId
      );
      // console.log("currentUserData", currentUserData);
      setPayloadForPut({
        region_id: currentUserData.region_id,
        parent_id: currentUserData.parent_id,
        name: currentUserData.name,
        email: currentUserData.email,
        role: currentUserData.roles[0].name,
        status: currentUserData.status === 1 ? 0 : 1,
        meta: [
          {
            gender: currentUserData.attr.gender,
            phone: currentUserData.attr.phone,
          },
        ],
      });
      // console.log("payloadForPut", payloadForPut);
    };
    if (userId !== null) {
      fetchUserData();
    }
  }, [userId]);

  if (!isOpen) {
    return null;
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/users/${userId}`, payloadForPut);
      Swal.fire({
        title: "Success",
        text: "Akun berhasil dinonaktifkan.",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
        customClass: {
          container: "my-swal-container",
        },
      });
    } catch (error) {
      console.error("Error change user status:", error);
      Swal.fire({
        title: "Failed",
        text: "Akun gagal dinonaktifkan.",
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

export default ConfirmChangeStatusModal;
