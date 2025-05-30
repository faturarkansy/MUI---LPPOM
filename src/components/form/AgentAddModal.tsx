import React, { useState, useEffect, FormEvent } from "react";
import { XIcon } from "../../icons";

// Interface untuk props komponen Modal
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: UserFormData) => void;
  initialParentId?: string; // Opsional, jika ingin set dari luar
  initialRegionId?: string; // Opsional
  initialSubRegionId?: string; // Opsional
}

interface Meta {
  gender: string;
  phone: string;
  type: string;
}

// Interface untuk struktur data form
export interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  parent_id: string;
  region_id: string;
  sub_region_id: string;
  meta: Meta[];
}

// Nilai awal untuk form
const initialFormState: UserFormData = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "",
  parent_id: "", // Default string kosong, bisa di-override oleh props
  region_id: "", // Default string kosong
  sub_region_id: "", // Default string kosong
  meta: [
    {
      gender: "",
      phone: "",
      type: "",
    },
  ],
};

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialParentId = "", // Default jika tidak ada props
  initialRegionId = "",
  initialSubRegionId = "",
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    ...initialFormState,
    parent_id: initialParentId,
    region_id: initialRegionId,
    sub_region_id: initialSubRegionId,
  });

  // Reset form ketika modal dibuka (jika isOpen berubah menjadi true)
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialFormState,
        parent_id: initialParentId,
        region_id: initialRegionId,
        sub_region_id: initialSubRegionId,
      });
    }
  }, [isOpen, initialParentId, initialRegionId, initialSubRegionId]);

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

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    onSubmit(formData);
    // onClose(); // Opsional: tutup modal setelah submit berhasil
  };

  // Style sederhana untuk modal (bisa Anda kembangkan dengan CSS/Tailwind)
  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999999,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "clamp(300px, 80vw, 500px)", // Lebar responsif
    maxHeight: "90vh",
    overflowY: "auto",
    // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  //   const labelStyle: React.CSSProperties = {
  //     display: "block",
  //     marginBottom: "5px",
  //     fontWeight: "bold",
  //   };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const submitButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "white",
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    color: "white",
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div className="px-2 py-1 rounded-2xl bg-white">
        <div
          className=""
          style={modalContentStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end items-center">
            <button type="button" className="p-2 hover:bg-gray-200 rounded-lg">
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
                style={inputStyle}
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
                style={inputStyle}
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
                style={inputStyle}
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
                style={inputStyle}
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
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            {/* <hr className="m-3" />
            <h4>Meta Informasi:</h4> */}

            <div>
              <label htmlFor="meta_gender">Gender:</label>
              <input
                type="text"
                id="meta_gender"
                name="gender" // name ini akan digunakan di handleMetaChange
                value={formData.meta.gender}
                onChange={handleMetaChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="meta_phone">Telepon:</label>
              <input
                type="text" // Bisa juga "tel"
                id="meta_phone"
                name="phone" // name ini akan digunakan di handleMetaChange
                value={formData.meta.phone}
                onChange={handleMetaChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="meta_type">Tipe:</label>
              <input
                type="text"
                id="meta_type"
                name="type" // name ini akan digunakan di handleMetaChange
                value={formData.meta.type}
                onChange={handleMetaChange}
                style={inputStyle}
              />
            </div>

            <div style={buttonContainerStyle}>
              <button type="button" onClick={onClose} style={cancelButtonStyle}>
                Batal
              </button>
              <button type="submit" style={submitButtonStyle}>
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* <h2>Tambah Pengguna Baru</h2> */}
    </div>
  );
};

export default AddUserModal;
