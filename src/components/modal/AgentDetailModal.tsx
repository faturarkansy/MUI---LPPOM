import React, { useState, useEffect } from "react";
import { XIcon } from "../../icons";
import axiosClient from "../../axios-client";

// Interface untuk props komponen Modal
interface AddUserModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger: boolean;
  setRefreshTrigger: (value: boolean) => void;
}

// Interface untuk struktur data form
interface UserFormData {
  name: string;
  email: string;
  role: string;
  parent: string;
  region: string;
  gender: string;
  phone: string;
  type: string;
}

// Nilai awal untuk form
const initialFormState: UserFormData = {
  name: "",
  email: "",
  role: "",
  parent: "",
  region: "",
  gender: "",
  phone: "",
  type: "",
};

const AgentDetailModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  // const [formData, setFormData] = useState<UserFormData>(initialFormState);
  const [formData, setFormData] = useState<UserFormData>(initialFormState);

  // Reset form ketika modal dibuka (jika isOpen berubah menjadi true)
  useEffect(() => {
    const fetchUser = async (id: number | null) => {
      try {
        const axiosResponse = await axiosClient.get(`/users/${id}`);
        let apiData = axiosResponse.data.data;
        for (const key in apiData) {
          if (apiData[key].id === userId) {
            apiData = apiData[key];
            break;
          }
        }
        setFormData({
          name: apiData.name,
          email: apiData.email,
          role: apiData.roles[0].name || "-",
          parent: apiData.parent.name || "-",
          region: apiData.region.name || "-",
          gender: apiData.attr.gender || "-",
          phone: apiData.attr.phone || "-",
          type: apiData.attr.type || "-",
        });
        console.log("User data selected:", apiData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    if (isOpen) {
      fetchUser(userId);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

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
          <div className="flex justify-end items-center">
            <button
              aria-label="close-modal"
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <ul>
            {Object.entries(formData).map(([key, value]) => {
              const formattedKey =
                key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
              return (
                <li key={key} className="grid grid-cols-4 mb-2">
                  <div className="font-semibold">{formattedKey}</div>
                  <div className="py-1 px-2 col-span-3 border rounded-sm">
                    {value}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailModal;
