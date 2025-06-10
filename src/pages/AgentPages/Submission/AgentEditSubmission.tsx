import React, { useState, useEffect, FormEvent } from "react";
import axiosClient from "../../../axios-client";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Notification from "../../../components/common/Notification.js";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const AgentEditSubmission: React.FC = () => {
    // const todayDate = new Date().toISOString().split("T")[0];
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
    const location = useLocation();
    const submissionId = location.state?.id;

    const { allowed } = location.state || {};
    if (!allowed) {
        return <Navigate to="/dashboard" replace />;
    }
    const [notification, setNotification] = useState<{
        title?: string;
        message: string;
        type: "success" | "error";
    }>({
        title: "",
        message: "",
        type: "success",
    });

    const fieldLabels: Record<string, string> = {
        nib: "NIB",
        name: "Nama Perusahaan",
        business_scale_id: "Skala Usaha",
        product_type_id: "Jenis Produk",
        type: "Tipe Perusahaan",
        date: "Tanggal Pengajuan",
        facility: "Fasilitas Produksi",
        product: "Produk",
        province_id: "Provinsi",
        regency_id: "Kabupaten/Kota",
        district_id: "Kecamatan",
        village_id: "Kelurahan/Desa",
        address: "Alamat Perusahaan",
        phone: "Nomor Telepon Perusahaan",
        email: "Email Perusahaan",
        pic_name: "Nama PIC",
        pic_phone: "Nomor Telepon PIC",
        pic_email: "Email PIC",
    };

    //fetch Submission Data
    useEffect(() => {
        const fetchSubmissionData = async () => {
            if (submissionId) {
                try {
                    const response = await axiosClient.get(`/submissions/${submissionId}`);
                    const data = response.data;

                    setFormData({
                        user_id: data.user_id || "",
                        nib: data.company.nib || "",
                        name: data.company.name || "",
                        business_scale_id: data.business_scale_id || "",
                        product_type_id: data.product_type_id || "",
                        type: data.type || "",
                        date: data.date || "",
                        facility: data.facility || "",
                        product: data.product || "",
                        province_id: data.province_id || "",
                        regency_id: data.regency_id || "",
                        district_id: data.district_id || "",
                        village_id: data.village_id || "",
                        meta: {
                            address: data.company.attr.address || "",
                            phone: data.company.attr.phone || "",
                            email: data.company.attr.email || "",
                            pic_name: data.company.attr.pic_name || "",
                            pic_phone: data.company.attr.pic_phone || "",
                            pic_email: data.company.attr.pic_email || "",
                        },
                    });
                } catch (error) {
                    console.error("Gagal memuat data submission:", error);
                    setNotification({
                        title: "Error",
                        message: "Gagal memuat data submission.",
                        type: "error",
                    });
                }
            }
        };

        fetchSubmissionData();
    }, [submissionId]);

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
            "date", "facility", "product", "province_id", "regency_id", "district_id", "village_id",
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
                newErrors[field] = `Field ${fieldLabels[field] || field} harus diisi`;
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
            await axiosClient.put(`/submissions/${submissionId}`, formData);
            setNotification({
                title: "Success",
                message: "Berhasil mengupdate data submission.",
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
            <PageBreadcrumb pageTitle="Edit Submission" />
            <form onSubmit={handleSubmit} className="space-y-3 mt-3 px-2">
                <div>
                    <label htmlFor="nib" className="text-sm">NIB Perusahaan</label>
                    <input
                        id="nib"
                        value={formData.nib}
                        onChange={handleInputChange}
                        type="text"
                        className="mt-1 block w-full border border-black p-2 text-sm rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                        className="mt-1 block w-full border border-black p-2 text-sm rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                        className="w-full p-2 border border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                    >
                        <option value="" disabled>
                            .....
                        </option>
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
                        className="w-full p-2 border border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                        className="w-full p-2 border border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                    <label htmlFor="date" className="text-sm block mb-0.5">
                        Tanggal Pengajuan
                    </label>
                    <DatePicker
                        id="date"
                        selected={formData.date ? new Date(formData.date) : null}
                        onChange={(date: Date | null) => {
                            setFormData({
                                ...formData,
                                date: date?.toISOString().split("T")[0] || "",
                            });
                        }}
                        dateFormat="dd/MM/yyyy"
                        className="w-full p-2 border border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                        wrapperClassName="w-full"
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
                        className="mt-1 block w-full border p-2 border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                        className="mt-1 block w-full border p-2 border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                        className="w-full p-2 border border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                    >
                        <option value="" disabled>
                            ....
                        </option>
                        {provinces.map((province: any) => (
                            <option key={province.id} value={province.id}>
                                {province.name}
                            </option>
                        ))}
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
                        className="w-full p-2 border border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                        className="w-full p-2 border border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                    {errors.district_id && (
                        <p className="text-red-500 text-sm">{errors.district_id}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="village_id" className="text-sm">
                        Kelurahan / Desa
                    </label>
                    <select
                        id="village_id"
                        value={formData.village_id}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                    {errors.village_id && (
                        <p className="text-red-500 text-sm">{errors.village_id}</p>
                    )}
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
                        className="mt-1 block w-full border p-2 border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                        className="mt-1 block w-full border p-2 border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                        className="mt-1 block w-full border p-2 border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                        className="mt-1 block w-full border p-2 border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
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
                        className="mt-1 block w-full border p-2 border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                    />
                    {errors.pic_phone && (
                        <p className="text-red-500 text-sm">{errors.pic_phone}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="pic_email" className="flex text-sm">
                        <p>Email PIC</p>
                    </label>
                    <input
                        id="pic_email"
                        value={formData.meta.pic_email}
                        onChange={handleInputChange}
                        type="text"
                        className="mt-1 block w-full border p-2 border-black rounded focus:border-[#1975a6] focus:border-2 focus:outline-none"
                    />
                    {errors.pic_email && (
                        <p className="text-red-500 text-sm mt-1">{errors.pic_email}</p>
                    )}
                </div>
                <div className="pt-2 text-right">
                    <button>

                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-500"
                    >
                        {isLoading ? "Menyimpan..." : "Tambahkan"}
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

export default AgentEditSubmission;
