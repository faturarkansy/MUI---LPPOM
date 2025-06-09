import React, { useState, useEffect, FormEvent } from "react";
import axiosClient from "../../../axios-client";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Notification from "../../../components/common/Notification.js";
import { useNavigate } from "react-router-dom";

interface CompanyFormData {
    user_id: string;
    nib: string;
    name: string;
    business_scale_id: string;
    product_type_id: string;
    type: string;
    date: string;
    facility: string;
    product: string;
    province_id: string;
    regency_id: string;
    district_id: string;
    village_id: string;
    meta: {
        address: string;
        phone: string;
        email: string;
        pic_name: string;
        pic_phone: string;
        pic_email: string;
    };
}

const initCompanyFormData: CompanyFormData = {
    user_id: "",
    nib: "",
    name: "",
    business_scale_id: "",
    product_type_id: "",
    type: "",
    date: "",
    facility: "",
    product: "",
    province_id: "",
    regency_id: "",
    district_id: "",
    village_id: "",
    meta: {
        address: "",
        phone: "",
        email: "",
        pic_name: "",
        pic_phone: "",
        pic_email: "",
    },
};

const AgentAddSubmission: React.FC = () => {
    const [provinces, setProvinces] = useState<any[]>([]);
    const [regencies, setRegencies] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [villages, setVillages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CompanyFormData>(initCompanyFormData);
    const [businessScale, setBusinessScale] = useState<any[]>([]);
    const navigate = useNavigate();
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [notification, setNotification] = useState<{
        title?: string;
        message: string;
        type: "success" | "error";
    }>({
        title: "",
        message: "",
        type: "success",
    });

    //fetch General & Provinsi
    useEffect(() => {
        const fetchBusinessScale = async () => {
            const axiosResponse = await axiosClient.get("/data/business-scales");
            setBusinessScale(axiosResponse.data || []);
        };
        const fetchProvinces = async () => {
            const axiosResponse = await axiosClient.get("/data/provinces");
            setProvinces(axiosResponse.data || []);
        };
        const fetchProductTypes = async () => {
            const axiosResponse = await axiosClient.get("/data/product-types");
            setProductTypes(axiosResponse.data || []);
        };

        fetchBusinessScale();
        fetchProvinces();
        fetchProductTypes();
    }, []);

    //fetch Kabupaten
    useEffect(() => {
        const fetchRegenciesByProvince = async () => {
            if (formData.province_id) {
                try {
                    const response = await axiosClient.get(`/data/regencies?province_id=${formData.province_id}`);
                    setRegencies(response.data || []);
                    // Reset regency, district, and village when province changes
                    setFormData((prev) => ({
                        ...prev,
                        regency_id: "",
                        district_id: "",
                        village_id: "",
                    }));
                } catch (error) {
                    console.error("Gagal memuat data kabupaten:", error);
                }
            } else {
                setRegencies([]);
            }
        };

        fetchRegenciesByProvince();
    }, [formData.province_id]);

    //fetch Kecamatan
    useEffect(() => {
        const fetchDistrictsByRegency = async () => {
            if (formData.regency_id) {
                const response = await axiosClient.get(`/data/districts?regency_id=${formData.regency_id}`);
                setDistricts(response.data || []);
                setFormData((prev) => ({
                    ...prev,
                    district_id: "",
                    village_id: "",
                }));
            } else {
                setDistricts([]);
            }
        };

        fetchDistrictsByRegency();
    }, [formData.regency_id]);

    //fetch Kelurahan
    useEffect(() => {
        const fetchVillagesByDistrict = async () => {
            if (formData.district_id) {
                const response = await axiosClient.get(`/data/villages?district_id=${formData.district_id}`);
                setVillages(response.data || []);
                setFormData((prev) => ({
                    ...prev,
                    villages_id: "",
                }));
            } else {
                setVillages([]);
            }
        };

        fetchVillagesByDistrict();
    }, [formData.district_id]);




    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        if (
            ["address", "phone", "email", "pic_name", "pic_phone", "pic_email"].includes(id)
        ) {
            setFormData((prev) => ({
                ...prev,
                meta: {
                    ...prev.meta,
                    [id]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        const requiredFields: string[] = [
            "nib", "name", "business_scale_id", "product_type_id", "type",
            "date", "facility", "product", "province_id", "regency_id",
            "address", "phone", "email", "pic_name", "pic_phone", "pic_email"
        ];

        requiredFields.forEach((field) => {
            let value;
            if (["address", "phone", "email", "pic_name", "pic_phone", "pic_email"].includes(field)) {
                value = formData.meta[field as keyof typeof formData.meta];
            } else {
                value = (formData as any)[field];
            }

            if (!value?.toString().trim()) {
                newErrors[field] = `Field ${field.replace(/_/g, " ")} harus diisi`;
            }
        });

        if (formData.nib && !/^\d+$/.test(formData.nib)) {
            newErrors["nib"] = "Field hanya menerima angka";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async () => {
        setIsLoading(true);
        try {
            await axiosClient.post(`/submissions`, formData);
            setNotification({
                title: "Success",
                message: "Berhasil menambahkan data submission.",
                type: "success",
            });

            setFormData(initCompanyFormData);
            setTimeout(() => {
                navigate("/submission");
            }, 2000);
        } catch (err: any) {
            setNotification({
                title: "Error",
                message: "Gagal menambahkan data submission.",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            handleFormSubmit();
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Add Submission" />
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nib" className="text-sm">NIB Perusahaan</label>
                    <input
                        id="nib"
                        value={formData.nib}
                        onChange={handleInputChange}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.nib && (
                        <p className="text-red-500 text-sm">{errors.nib}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="name" className="text-sm">Nama Perusahaan</label>
                    <input
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="business_scale_id" className="text-sm">Skala Bisnis</label>
                    <select
                        id="business_scale_id"
                        value={formData.business_scale_id}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="" disabled>---</option>
                        {businessScale.map((scale) => (
                            <option key={scale.id} value={scale.id}>{scale.name}</option>
                        ))}
                    </select>
                    {errors.business_scale_id && (
                        <p className="text-red-500 text-sm">{errors.business_scale_id}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="product_type_id" className="text-sm">
                        Jenis Produk
                    </label>
                    <select
                        id="product_type_id"
                        value={formData.product_type_id}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="" disabled>
                            .....
                        </option>
                        {productTypes.map((productType: any) => (
                            <option key={productType.id} value={productType.id}>
                                {productType.type}
                            </option>
                        ))}
                    </select>
                    {errors.product_type_id && (
                        <p className="text-red-500 text-sm">{errors.product_type_id}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="type" className="text-sm">
                        Jenis Pengajuan
                    </label>
                    <select
                        id="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="" disabled>
                            .....
                        </option>
                        <option key={1} value={"Baru"}>
                            Baru
                        </option>
                        <option key={2} value={"Pengembangan Produk"}>
                            Pengembangan Produk
                        </option>
                        <option key={3} value={"Pengembangan Fasilitas"}>
                            Pengembangan Fasilitas
                        </option>
                    </select>
                    {errors.type && (
                        <p className="text-red-500 text-sm">{errors.type}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="date" className="text-sm">
                        Tanggal Pengajuan
                    </label>
                    <input
                        id="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        type="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.date && (
                        <p className="text-red-500 text-sm">{errors.date}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="facility" className="text-sm">
                        Jumlah Fasilitas Produksi
                    </label>
                    <input
                        id="facility"
                        value={formData.facility}
                        onChange={handleInputChange}
                        type="number"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.facility && (
                        <p className="text-red-500 text-sm">{errors.facility}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="product" className="text-sm">
                        Jumlah Produk
                    </label>
                    <input
                        id="product"
                        value={formData.product}
                        onChange={handleInputChange}
                        type="number"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.product && (
                        <p className="text-red-500 text-sm">{errors.product}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="province_id" className="text-sm">
                        Provinsi
                    </label>
                    <select
                        id="province_id"
                        value={formData.province_id}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="" disabled>
                            ....
                        </option>
                        {provinces.map((province: any) => (
                            <option key={province.id} value={province.id}>
                                {province.name}
                            </option>
                        ))}
                        {/* {locations.map((location: any) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))} */}
                    </select>
                    {errors.province_id && (
                        <p className="text-red-500 text-sm">{errors.province_id}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="regency_id" className="text-sm">
                        Kabupaten / Kota
                    </label>
                    <select
                        id="regency_id"
                        value={formData.regency_id}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="" disabled>
                            .....
                        </option>
                        {regencies.map((regency: any) => (
                            <option key={regency.id} value={regency.id}>
                                {regency.name}
                            </option>
                        ))}
                    </select>
                    {errors.regency_id && (
                        <p className="text-red-500 text-sm">{errors.regency_id}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="district_id" className="text-sm">
                        Kecamatan
                    </label>
                    <select
                        id="district_id"
                        value={formData.district_id}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="" disabled>
                            .....
                        </option>
                        {districts.map((district: any) => (
                            <option key={district.id} value={district.id}>
                                {district.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="village_id" className="text-sm">
                        Kelurahan / Desa
                    </label>
                    <select
                        id="village_id"
                        value={formData.village_id}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="" disabled>
                            .....
                        </option>
                        {villages.map((village: any) => (
                            <option key={village.id} value={village.id}>
                                {village.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="address" className="text-sm">
                        Alamat Perusahaan
                    </label>
                    <input
                        id="address"
                        value={formData.meta.address}
                        onChange={handleInputChange}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.address && (
                        <p className="text-red-500 text-sm">{errors.address}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="phone" className="text-sm">
                        Nomor Telepon Perusahaan
                    </label>
                    <input
                        id="phone"
                        value={formData.meta.phone}
                        onChange={handleInputChange}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="email" className="text-sm">
                        Email Perusahaan
                    </label>
                    <input
                        id="email"
                        value={formData.meta.email}
                        onChange={handleInputChange}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="pic_name" className="text-sm">
                        Nama PIC
                    </label>
                    <input
                        id="pic_name"
                        value={formData.meta.pic_name}
                        onChange={handleInputChange}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.pic_name && (
                        <p className="text-red-500 text-sm">{errors.pic_name}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="pic_phone" className="text-sm">
                        Nomor Telepon PIC
                    </label>
                    <input
                        id="pic_phone"
                        type="text"
                        value={formData.meta.pic_phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.pic_phone && (
                        <p className="text-red-500 text-sm">{errors.pic_phone}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="pic_email" className="flex text-sm">
                        <p>Email PIC</p>
                        <p className="ml-3 font-light">*(Opsional)</p>
                    </label>
                    <input
                        id="pic_email"
                        value={formData.meta.pic_email}
                        onChange={handleInputChange}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                    {errors.pic_email && (
                        <p className="text-red-500 text-sm mt-1">{errors.pic_email}</p>
                    )}
                </div>
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        {isLoading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </form>

            {/* Notifikasi */}
            {notification.message && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "success" })}
                />
            )}
        </div>
    );
};

export default AgentAddSubmission;
