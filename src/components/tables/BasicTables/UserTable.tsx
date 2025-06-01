import { useState, useEffect } from "react";
import axiosClient from "../../../axios-client.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserFormModal from "../../form/FormUser.js";

interface User {
  id: number;
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

interface ApiResponse {
  code: number;
  status: string;
  data: User[];
}
interface Role {
  id: string;
  name: string;
}

interface Region {
  id: string;
  name: string;
  info: string;
}

interface Reference {
  id: string;
  name: string;
}

interface Meta {
  address: string;
  phone: string;
  gender: string;
}

interface Parent {
  id: string;
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

const regionOptions = [
  { id: "1", name: "Jakarta", info: "Ibu Kota Indonesia" },
  { id: "2", name: "Bandung", info: "Kota Kembang" },
  { id: "3", name: "Surabaya", info: "Kota Pahlawan" },
];

const UsersTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [formData, setFormData] = useState<User | null>(null);
  const [formData, setFormData] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [parents, setParent] = useState<Parent[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [errorRoles, setErrorRoles] = useState("");
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setUsers((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof User],
          [child]: value,
        },
        [name]:
          name === "parent_id"
            ? value === ""
              ? null
              : { id: parseInt(value) } // atur sesuai struktur parent
            : value,
      }));
    } else {
      setUsers((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    fetchUsers();
    if (isOpen) {
      const fetchRoles = async () => {
        try {
          setLoadingRoles(true);
          setErrorRoles("");
          const response = await axiosClient.get("/roles");
          console.log(response);

          if (response.data && Array.isArray(response.data.data)) {
            setRoles(response.data.data);
          } else {
            throw new Error("Invalid data format");
          }
        } catch (error) {
          console.error("Error fetching roles:", error);
          setErrorRoles(
            error.response?.data?.message || "Gagal memuat data role"
          );
          setRoles([]);
        } finally {
          setLoadingRoles(false);
        }
      };

      const fetchParent = async () => {
        try {
          setLoadingRoles(true);
          setErrorRoles("");
          const response = await axiosClient.get("/users");
          console.log(response);

          if (response.data && Array.isArray(response.data.data)) {
            setParent(response.data.data);
            console.log(response.data.data);
          } else {
            throw new Error("Invalid data format");
          }
        } catch (error) {
          console.error("Error fetching roles:", error);
          setErrorRoles(
            error.response?.data?.message || "Gagal memuat data role"
          );
          setParent([]);
        } finally {
          setLoadingRoles(false);
        }
      };

      fetchRoles();
      fetchParent();
    } else {
      // Reset roles data saat modal tertutup
      // setRoles([]);
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get<ApiResponse>("/users");
      setUsers(response.data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    if (!selectedId) {
      // Jika user memilih opsi kosong
      setUsers((prev) => ({
        ...prev,
        region_id: null,
        region: null,
      }));
      return;
    }

    const selectedRegion = regionOptions.find(
      (region) => region.id.toString() === selectedId
    );

    if (selectedRegion) {
      setUsers((prev) => ({
        ...prev,
        region_id: selectedRegion.id,
        region: {
          id: selectedRegion.id,
          name: selectedRegion.name,
          info: selectedRegion.info,
        },
      }));
    }
  };

  const handleEditClick = (user: User) => {
    console.log(user);
    setFormData({
      ...user,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("User :", formData);
      const response = await axiosClient.post("/users", formData); // Gunakan instance axios yang sudah dikonfigurasi

      console.log("User created:", response.data);
      setIsOpen(false);
      setUsers(users);
      toast.success("User berhasil dibuat!");
      // Tambahkan notifikasi sukses jika perlu
    } catch (error) {
      console.error("Error creating user:", error);

      toast.error(error.response?.data?.message || "Gagal memuat permintaan");
      // Tambahkan notifikasi error jika perlu
      if (error.response?.status === 401) {
        // Handle unauthorized (misal: redirect ke login)
      }
    }
  };

  const getMetaValue = (meta: User["meta"], key: string) => {
    const item = meta.find((item) => item.key === key);
    return item ? item.value : "";
  };

  return (
    <div className="relative">
      <div className={`transition-all duration-300 ${isOpen ? "blur-sm" : ""}`}>
        {loading ? (
          <div className="p-4 text-center">Memuat data...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-white/[0.05]">
                <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                  <tr>
                    <th className="px-5 py-3 text-xs font-medium text-start text-gray-500 dark:text-gray-400">
                      User
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-start text-gray-500 dark:text-gray-400">
                      Email
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-start text-gray-500 dark:text-gray-400">
                      Role
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-start text-gray-500 dark:text-gray-400">
                      Region
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-start text-gray-500 dark:text-gray-400">
                      Phone
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-start text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-start text-gray-500 dark:text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-gray-700 dark:text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="block font-medium text-sm text-gray-800 dark:text-white/90">
                              {user.name}
                            </span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                              {user.parent?.name || "No parent"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-start text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-start text-gray-500 dark:text-gray-400">
                        {user.roles[0]?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-start text-gray-500 dark:text-gray-400">
                        {user.region?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-start text-gray-500 dark:text-gray-400">
                        {getMetaValue(user.meta, "phone")}
                      </td>
                      <td className="px-4 py-3 text-sm text-start text-gray-500 dark:text-gray-400">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.email_verified_at
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {user.email_verified_at ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-start">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleEditClick(user);
                            }}
                            className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 text-xs text-red-600 bg-red-100 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-white/[0.05]">
              Total Data: {users.length}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          {/* Overlay dengan backdrop blur */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => {
              setIsOpen(false);
            }}
          />

          {/* Modal container */}
          <UserFormModal
            mode="edit"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            emptyUser={formData}
            roles={roles}
            parents={parents}
            regionOptions={regionOptions}
            loadingRoles={loadingRoles}
            errorRoles={errorRoles}
            handleInputChange={handleInputChange}
            handleRegionChange={handleRegionChange}
          />
        </div>
      )}
    </div>
  );
};

export default UsersTable;
