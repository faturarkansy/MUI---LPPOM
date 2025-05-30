import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { toast } from 'react-toastify';
interface Role {
    id: number;
    name: string;
}

interface Parent {
    id: number;
    name: string;
}

interface Region {
    id: number;
    name: string;
    info: string;
}

interface Reference {
    id: number;
    name: string;
}

interface Meta {
    address: string;
    phone: string;
    gender: string;
}

interface UserFormData {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role: string;
    parent_id: number;
    region_id: number;
    region: { id: number; name: string; info: string };
    // reference: { id: number; name: string };
    meta: Meta
}
interface Props {
    mode: "add" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: UserFormData;
    setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
    emptyUser: UserFormData;
    // roles: Role[];
    // parents: Parent[];
    // regionOptions: Region[];
    // referenceOptions: Reference[];
    // loadingRoles?: boolean;
    // errorRoles?: string;
    // handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    // handleRegionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    // handleReferenceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const regionOptions = [
    { id: '1', name: 'Jakarta', info: 'Ibu Kota Indonesia' },
    { id: '2', name: 'Bandung', info: 'Kota Kembang' },
    { id: '3', name: 'Surabaya', info: 'Kota Pahlawan' }
];



const UserFormModal: React.FC<Props> = ({
    mode,
    isOpen,
    onClose,
    formData,
    setFormData,
    emptyUser,
    // roles,
    // parents,
    // regionOptions,
    // loadingRoles,
    // errorRoles,
    // handleInputChange,
    // handleRegionChange,

}) => {

    const [roles, setRoles] = useState<Role[]>([]);
    const [parents, setParent] = useState<Parent[]>([]);
    const [regions, setRegion] = useState<Region[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (isOpen) {
            console.log(formData)
            const fetchRoles = async () => {
                try {
                    setLoading(true);
                    setError('');
                    const response = await axiosClient.get('/roles');


                    if (response.data && Array.isArray(response.data.data)) {
                        setRoles(response.data.data);
                        console.log()
                    } else {
                        throw new Error('Invalid data format');
                    }
                } catch (error) {
                    console.error('Error fetching roles:', error);
                    setError(error.response?.data?.message || 'Gagal memuat data role');
                    setRoles([]);
                } finally {
                    setLoading(false);
                }
            };

            const fetchRegion = async () => {
                try {
                    setLoading(true);
                    setError('');
                    const response = await axiosClient.get('/regions');


                    if (response.data && Array.isArray(response.data.data)) {
                        setRegion(response.data.data);
                        console.log()
                    } else {
                        throw new Error('Invalid data format');
                    }
                } catch (error) {
                    console.error('Error fetching roles:', error);
                    setError(error.response?.data?.message || 'Gagal memuat data role');
                    setRoles([]);
                } finally {
                    setLoading(false);
                }
            };

            const fetchParent = async () => {
                try {
                    setLoading(true);
                    setError('');
                    const response = await axiosClient.get('/users');
                    console.log(response)

                    if (response.data && Array.isArray(response.data.data)) {
                        setParent(response.data.data);
                        console.log(response.data.data)
                    } else {
                        throw new Error('Invalid data format');
                    }
                } catch (error) {
                    console.error('Error fetching roles:', error);
                    setError(error.response?.data?.message || 'Gagal memuat data role');
                    setParent([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchRoles();
            fetchParent();
            fetchRegion();
        } else {
            // Reset roles data saat modal tertutup
            // setRoles([]);
        }
    }, [isOpen]);
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;


        setFormData((prev) => {
            // Jika field yang diubah adalah "role"

            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent as keyof User],
                        [child]: value
                    }
                }));
            }
            if (name === "role") {
                return {
                    // ...prev,
                    // roles: value ? { ...prev.roles?.[0], name: value } : [],
                    ...prev,
                    role: value,
                    roles: value ? [{ name: value }] : [],
                };
            }

            if (name === "parent") {
                const selectedParent = parents.find((p) => String(p.id) === value);
                return {
                    ...prev,
                    parent: selectedParent || null,
                    parent_id: selectedParent?.id || null,
                };
            }
            if (name === "region") {
                const selectedRegion = regions.find(region => String(region.id) === value);
                console.log(selectedRegion)
                return {

                    ...prev,
                    region: selectedRegion || null,
                    region_id: selectedRegion?.id || null


                };

            }

            // Field umum lainnya
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let response = null;
        try {
            formData.region_id = formData.region?.id ?? null
            formData.parent_id = formData.parent?.id ?? null
            formData.role = formData.roles?.[0]?.name ?? null
            formData.meta = formData.attr
            console.log('User :', formData);
            if (mode == "add") {
                response = await axiosClient.post('/users', formData); // Gunakan instance axios yang sudah dikonfigurasi
            } else {
                response = await axiosClient.put(`/users/${formData.id}`, formData);
            }
            console.log('User created:', response.data);
            //   setIsOpen(false);
            setFormData(emptyUser);
            toast.success("User berhasil dibuat!");
            // Tambahkan notifikasi sukses jika perlu
        } catch (error) {
            console.error('Error creating user:', error);

            toast.error(error.response?.data?.message || 'Gagal memuat permintaan');
            // Tambahkan notifikasi error jika perlu
            if (error.response?.status === 401) {
                // Handle unauthorized (misal: redirect ke login)
            }
        }
    };
    // console.log(formData)
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-opacity-30 backdrop-blur-sm flex justify-center items-center overflow-auto">
            <div className="relative mx-4 w-full max-w-md z-[110]">
                <div className="relative bg-white rounded-lg shadow-xl dark:bg-gray-800 max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Tambah User Baru
                        </h3>
                        <button
                            onClick={() => {
                                onClose();
                                setFormData(emptyUser);
                            }}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4 overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Nama
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    {mode === "add" && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Password Confirmation
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password_confirmation"
                                                    value={formData.password_confirmation}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}



                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Role
                                        </label>
                                        {loading ? (
                                            <div className="animate-pulse py-2 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                                        ) : error ? (
                                            <p className="text-red-500 text-sm">{error}</p>
                                        ) : (
                                            <select
                                                name="role"
                                                value={formData.roles?.[0]?.name ?? ""}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                required
                                            >
                                                <option value="">Pilih Role</option>
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.name}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Parent
                                        </label>
                                        {loading ? (
                                            <div className="animate-pulse py-2 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                                        ) : error ? (
                                            <p className="text-red-500 text-sm">{error}</p>
                                        ) : (
                                            <select
                                                name="parent"
                                                value={formData.parent?.id ?? ""}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                required
                                            >
                                                <option value="">Pilih Parent</option>
                                                {parents.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>





                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Meta Data
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Alamat
                                            </label>
                                            <input
                                                type="text"
                                                name="attr.address"
                                                value={formData.attr.address}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Telepon
                                            </label>
                                            <input
                                                type="text"
                                                name="attr.phone"
                                                value={formData.attr.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Gender
                                            </label>
                                            <input
                                                type="text"
                                                name="attr.gender"
                                                value={formData.attr.gender}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Region
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Pilih Region
                                            </label>
                                            <select
                                                name="region"
                                                value={formData.region?.id ?? ""}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="">Pilih Region</option>
                                                {regions.map(region => (
                                                    <option key={region.id} value={region.id}>
                                                        {region.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Nama Region
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.region?.name ?? ""}
                                                readOnly
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Info Region
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.region?.info ?? ""}
                                                readOnly
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Reference
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Pilih Reference
                                            </label>
                                            <select
                                                value={formData.reference.id}
                                                onChange={handleReferenceChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="">Pilih Reference</option>
                                                {referenceOptions.map(ref => (
                                                    <option key={ref.id} value={ref.id}>
                                                        {ref.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Nama Reference
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.reference.name}
                                                readOnly
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            {/* 👉 Paste seluruh isi <form> di sini tanpa header/footer */}
                            {/* Kamu bisa potong dari kode kamu di atas mulai dari <form> sampai </form> */}
                            {/* Footer juga tetap di dalam sini */}

                            {/* Contoh untuk Footer */}
                            <div className="mt-4 flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        setFormData(emptyUser);
                                    }}
                                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 text-sm border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserFormModal;
