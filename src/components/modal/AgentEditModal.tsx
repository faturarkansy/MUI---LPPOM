import React, { useState, useEffect, FormEvent } from "react";
import { XIcon } from "../../icons";
import axiosClient from "../../axios-client";
import Swal from "sweetalert2";

// Interface untuk props komponen Modal
interface AddUserModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger: boolean;
  setRefreshTrigger: (value: boolean) => void;
}

interface Meta {
  gender: string;
  phone: string;
  type: string;
}

// Interface untuk struktur data form
interface UserFormData {
  name: string;
  email: string;
  role: string;
  parent_id: string;
  region_id: string;
  meta: Meta;
}

// Nilai awal untuk form
const initialFormState: UserFormData = {
  name: "",
  email: "",
  role: "",
  parent_id: "",
  region_id: "",
  meta: {
    gender: "",
    phone: "",
    type: "",
  },
};

const AgentEditModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  userId,
  refreshTrigger,
  setRefreshTrigger,
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
          role: apiData.roles[0].name || "",
          parent_id: apiData.parent.id || "",
          region_id: apiData.region.id || "",
          meta: {
            gender: apiData.attr.gender || "",
            phone: apiData.attr.phone || "",
            type: apiData.attr.type || "",
          },
        });
        console.log("User data selected:", apiData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    if (isOpen) {
      fetchUser(userId);
      // setFormData(initialFormState);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/users/${userId}`, formData);
      Swal.fire({
        title: "Success",
        text: "Berhasil memperbarui data agent.",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
        customClass: {
          container: "my-swal-container",
        },
      });
    } catch (error) {
      console.error("Failed to update user data:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui data agent.",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
        customClass: {
          container: "my-swal-container",
        },
      });
    } finally {
      onClose();
      setRefreshTrigger(!refreshTrigger);
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
          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="parent_id"
              value={formData.parent_id}
            ></input>
            <input
              type="hidden"
              name="region_id"
              value={formData.region_id}
            ></input>
            {/* Visible Fields */}
            <div>
              <label htmlFor="name" className="font-bold">
                Nama:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="font-bold">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="font-bold">
                Role:
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                // onChange={handleChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border"
                required
                disabled
              />
            </div>
            <div>
              <label htmlFor="meta_gender" className="font-bold">
                Gender:
              </label>
              <select
                id="meta_gender"
                name="gender"
                value={formData.meta.gender}
                onChange={handleMetaChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                // 'appearance-none' ditambahkan untuk menghilangkan styling default browser pada select jika diinginkan,
                required
              >
                <option value="" disabled>
                  .....
                </option>
                <option value="male">Pria</option>
                <option value="female">Wanita</option>
              </select>
            </div>
            <div>
              <label htmlFor="meta_phone" className="font-bold">
                Telepon:
              </label>
              <input
                type="text" // Bisa juga "tel"
                id="meta_phone"
                name="phone" // name ini akan digunakan di handleMetaChange
                value={formData.meta.phone}
                onChange={handleMetaChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border"
                required
              />
            </div>
            <div>
              <label htmlFor="meta_type" className="font-bold">
                Tipe:
              </label>
              <select
                id="meta_type"
                name="type"
                value={formData.meta.type}
                onChange={handleMetaChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                // 'appearance-none' ditambahkan untuk menghilangkan styling default browser pada select jika diinginkan,
                required
              >
                <option value="" disabled>
                  .....
                </option>
                <option value="personal">Perorangan</option>
                <option value="company">Perusahaan</option>
              </select>
            </div>
            {/* Submit button */}
            <div className="flex justify-end gap-[10px] mt-5">
              {/* <button
                type="button"
                onClick={onClose}
                className="py-[10px] px-[15px] border-none rounded cursor-pointer bg-[#6c757d] text-white"
              >
                Batal
              </button> */}
              <button
                type="submit"
                className="py-[10px] px-[15px] border-none rounded cursor-pointer bg-[#007bff] text-white"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentEditModal;
