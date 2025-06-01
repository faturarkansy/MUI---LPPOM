import React, { useState, useEffect, FormEvent } from "react";
import Swal from "sweetalert2";
import { XIcon } from "../../icons";
import axiosClient from "../../axios-client";

// Interface untuk props komponen Modal
interface AddUserModalProps {
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
  password: string;
  password_confirmation: string;
  role: string;
  parent_id: string;
  region_id: string;
  sub_region_id: string;
  meta: Meta;
}

// Nilai awal untuk form
const initialFormState: UserFormData = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "agent",
  parent_id: "",
  region_id: "",
  sub_region_id: "",
  meta: {
    gender: "",
    phone: "",
    type: "",
  },
};

const AgentAddModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  refreshTrigger,
  setRefreshTrigger,
}) => {
  const [formData, setFormData] = useState<UserFormData>(initialFormState);

  // Reset form ketika modal dibuka (jika isOpen berubah menjadi true)
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleFormSubmit = async (formData: UserFormData) => {
    try {
      // setLoading(true);

      // Get parent_id, region_id, sub_region_id dari API
      const userLocalData = localStorage.getItem("USER");
      const userId = userLocalData ? JSON.parse(userLocalData).id : null;
      const userDataFromAxios = await axiosClient.get(`/users/${userId}`);
      let userData = userDataFromAxios.data.data;

      // Filter userData untuk mendapatkan data yang sesuai dengan userId
      for (const key in userData) {
        if (userData[key].id == userId) {
          userData = userData[key];
          break;
        }
      }

      formData.parent_id = userData.parent?.id ?? "";
      formData.region_id = userData.region?.id ?? "";
      formData.sub_region_id = userData.sub_region?.id ?? "";

      // Kirim data form ke API untuk membuat user baru
      await axiosClient.post("/users", formData);
      // alert("Test allert!");
      Swal.fire({
        title: "Success",
        text: "Berhasil menambahkan data agent.",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
        customClass: {
          container: "my-swal-container",
        },
      });
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      Swal.fire({
        title: "Error",
        text: "Gagal menambahkan data agent.",
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Anda bisa menambahkan validasi di sini sebelum submit
    if (formData.password !== formData.password_confirmation) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }
    handleFormSubmit(formData);
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
            {/* Hidden Fields */}
            <input type="hidden" name="parent_id" value={formData.parent_id} />
            <input type="hidden" name="region_id" value={formData.region_id} />
            <input
              type="hidden"
              name="sub_region_id"
              value={formData.sub_region_id}
            />
            {/* Visible Fields */}
            <div>
              <label htmlFor="name">Nama:</label>
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
              <label htmlFor="email">Email:</label>
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
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border"
                required
              />
            </div>
            <div>
              <label htmlFor="password_confirmation">
                Konfirmasi Password:
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border"
                required
              />
            </div>
            <div>
              <label htmlFor="role">Role:</label>
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
              <label htmlFor="meta_gender">Gender:</label>

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
              <label htmlFor="meta_phone">Telepon:</label>
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
              <label htmlFor="meta_type">Tipe:</label>
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

export default AgentAddModal;
