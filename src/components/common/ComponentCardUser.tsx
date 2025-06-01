import { useState } from "react";
// import axiosClient from "../../axios-client.js";
// import { toast } from 'react-toastify';
import UserFormModal from "../form/FormUser.js";

interface Reference {
  id: string;
  name: string;
}

interface Meta {
  address: string;
  phone: string;
  gender: string;
}

// interface Parent {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
//   password_confirmation: string;
//   role: string;
//   parent_id: string;
//   region_id: string;
//   reference: Reference;
//   meta: Meta;
// }

interface User {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  parent_id: string;
  region_id: string;
  reference: Reference;
  meta: Meta;
}

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  onAdd?: () => void;
}

// const roleOptions = [
//   { value: 'admin', label: 'Administrator' },
//   { value: 'user', label: 'Regular User' },
//   { value: 'editor', label: 'Editor' },
//   { value: 'viewer', label: 'Viewer' }
// ];

// const regionOptions = [
//   { id: '1', name: 'Jakarta', info: 'Ibu Kota Indonesia' },
//   { id: '2', name: 'Bandung', info: 'Kota Kembang' },
//   { id: '3', name: 'Surabaya', info: 'Kota Pahlawan' }
// ];

// const referenceOptions = [
//   { id: 'ref1', name: 'Departemen IT' },
//   { id: 'ref2', name: 'Departemen HR' },
//   { id: 'ref3', name: 'Departemen Finance' }
// ];

const emptyUser: User = {
  name: "",
  email: "",
  role: "",
  region_id: "",

  reference: {
    id: "",
    name: "",
  },
  meta: {
    address: "",
    phone: "",
    gender: "",
  },
  password: "",
  password_confirmation: "",
  parent_id: "",
};

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<User>(emptyUser);

  // useEffect(() => {
  //   if (isOpen) {
  //     const fetchRoles = async () => {
  //       try {
  //         setLoadingRoles(true);
  //         setErrorRoles('');
  //         const response = await axiosClient.get('/roles');
  //         console.log(response)

  //         if (response.data && Array.isArray(response.data.data)) {
  //           setRoles(response.data.data);
  //         } else {
  //           throw new Error('Invalid data format');
  //         }
  //       } catch (error) {
  //         console.error('Error fetching roles:', error);
  //         setErrorRoles(error.response?.data?.message || 'Gagal memuat data role');
  //         setRoles([]);
  //       } finally {
  //         setLoadingRoles(false);
  //       }
  //     };

  //     const fetchParent = async () => {
  //       try {
  //         setLoadingRoles(true);
  //         setErrorRoles('');
  //         const response = await axiosClient.get('/users');
  //         console.log(response)

  //         if (response.data && Array.isArray(response.data.data)) {
  //           setParent(response.data.data);
  //           console.log(response.data.data)
  //         } else {
  //           throw new Error('Invalid data format');
  //         }
  //       } catch (error) {
  //         console.error('Error fetching roles:', error);
  //         setErrorRoles(error.response?.data?.message || 'Gagal memuat data role');
  //         setParent([]);
  //       } finally {
  //         setLoadingRoles(false);
  //       }
  //     };

  //     fetchRoles();
  //     fetchParent()
  //   } else {
  //     // Reset roles data saat modal tertutup
  //     // setRoles([]);
  //   }
  // }, [isOpen]);

  // const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedId = e.target.value;
  //   const selectedRegion = regionOptions.find(region => region.id === selectedId);

  //   if (selectedRegion) {
  //     setFormData(prev => ({
  //       ...prev,
  //       region_id: selectedRegion.id,
  //       region: {
  //         id: selectedRegion.id,
  //         name: selectedRegion.name,
  //         info: selectedRegion.info
  //       }
  //     }));
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     console.log('User :', formData);
  //     const response = await axiosClient.post('/users', formData); // Gunakan instance axios yang sudah dikonfigurasi

  //     console.log('User created:', response.data);
  //     setIsOpen(false);
  //     setFormData(emptyUser);
  //     toast.success("User berhasil dibuat!");
  //     // Tambahkan notifikasi sukses jika perlu
  //   } catch (error) {
  //     console.error('Error creating user:', error);

  //     toast.error(error.response?.data?.message || 'Gagal memuat permintaan');
  //     // Tambahkan notifikasi error jika perlu
  //     if (error.response?.status === 401) {
  //       // Handle unauthorized (misal: redirect ke login)
  //     }
  //   }
  // };

  return (
    <>
      {/* Wrapper untuk seluruh konten yang akan memudar */}
      <div
        className={`relative min-h-screen ${
          isOpen ? "opacity-50 blur-sm" : "opacity-100"
        }`}
      >
        {/* Header layout Anda - pastikan ini bagian dari konten yang memudar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          {/* Isi header Anda di sini */}
        </header>

        {/* Konten utama */}
        <main>
          <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                  {title}
                </h3>
                {desc && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {desc}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Tambah
              </button>
            </div>

            {/* Card Body */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="space-y-6">{children}</div>
            </div>
          </div>
        </main>
      </div>

      {/* Popup Form */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          {/* Overlay dengan backdrop blur */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => {
              setIsOpen(false);
              setFormData(emptyUser);
            }}
          />

          {/* Modal container */}
          <UserFormModal
            mode="add"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            // onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            emptyUser={emptyUser}
            // roles={roles}
            // parents={parents}
            // regionOptions={regionOptions}
            // loadingRoles={loadingRoles}
            // errorRoles={errorRoles}
            // handleInputChange={handleInputChange}
            // handleRegionChange={handleRegionChange}
          />
        </div>
      )}
    </>
  );
};

export default ComponentCard;
