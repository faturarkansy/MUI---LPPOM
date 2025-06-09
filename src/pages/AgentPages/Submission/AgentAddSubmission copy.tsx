import React, { useState, useEffect, FormEvent } from "react";
import Swal from "sweetalert2";
import axiosClient from "../../../axios-client";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

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
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [isLoadingRegencies, setIsLoadingRegencies] = useState(false);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

    useEffect(() => {
        const fetchBusinessScale = async () => {
            const axiosResponse = await axiosClient.get("/business-scales");
            setBusinessScale(axiosResponse.data || []);
        };
        const fetchProvinces = async () => {
            try {
                let allProvinces: any[] = [];
                let page = 1;
                let hasNextPage = true;

                while (hasNextPage) {
                    const response = await axiosClient.get(`/provinces?page=${page}`);
                    const { data, next_page_url } = response.data;

                    allProvinces = [...allProvinces, ...data];
                    page += 1;
                    hasNextPage = !!next_page_url;
                }

                setProvinces(allProvinces);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };

        const fetchVillages = async () => {
            const axiosResponse = await axiosClient.get("/villages");
            setVillages(axiosResponse.data.data || []);
        };
        const fetchProductTypes = async () => {
            const axiosResponse = await axiosClient.get("/ext/product-types");
            setProductTypes(axiosResponse.data.data || []);
        };

        fetchBusinessScale();
        fetchProvinces();
        fetchVillages();
        fetchProductTypes();
    }, []);

    // fetch regency
    useEffect(() => {
        const fetchRegenciesByProvince = async () => {
            if (!formData.province_id) {
                setRegencies([]);
                return;
            }

            setIsLoadingRegencies(true);

            try {
                let allRegencies: any[] = [];
                let page = 1;
                let hasNextPage = true;

                while (hasNextPage) {
                    const response = await axiosClient.get(`/regencies?page=${page}`);
                    const { data, next_page_url } = response.data;

                    allRegencies = [...allRegencies, ...data];
                    page++;
                    hasNextPage = !!next_page_url;
                }

                const filtered = allRegencies.filter(
                    (item: any) => item.province_id === parseInt(formData.province_id)
                );
                setRegencies(filtered);
            } catch (err) {
                console.error("Failed to fetch regencies", err);
            } finally {
                setIsLoadingRegencies(false); // Selesai loading
            }
        };
        fetchRegenciesByProvince();

    }, [formData.province_id]);

    // fetch district
    useEffect(() => {
        const fetchDistrictsByRegency = async () => {
            if (!formData.regency_id) {
                setDistricts([]);
                return;
            }

            setIsLoadingDistricts(true);
            try {
                let allDistricts: any[] = [];
                let page = 1;
                let hasNextPage = true;

                while (hasNextPage) {
                    const response = await axiosClient.get(`/districts?page=${page}`);
                    const { data, next_page_url } = response.data;
                    allDistricts = [...allDistricts, ...data];
                    page++;
                    hasNextPage = !!next_page_url;
                }

                const filtered = allDistricts.filter(
                    (item: any) => item.regency_id === parseInt(formData.regency_id)
                );
                setDistricts(filtered);
            } catch (err) {
                console.error("Failed to fetch districts", err);
            } finally {
                setIsLoadingDistricts(false);
            }
        };

        fetchDistrictsByRegency();
    }, [formData.regency_id]);




    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;

        if (id === "province_id") {
            setFormData((prev) => ({
                ...prev,
                province_id: value,
                regency_id: "",
            }));
            return;
        }

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

    const handleFormSubmit = async () => {
        setIsLoading(true);
        try {
            await axiosClient.post(`/ext/submissions`, formData);
            Swal.fire({
                title: "Success",
                text: "Berhasil menambahkan data submission.",
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
                customClass: {
                    container: "my-swal-container",
                },
            });
            setFormData(initCompanyFormData);
        } catch (err: any) {
            Swal.fire({
                title: "Error",
                text: "Gagal menambahkan data submission.",
                icon: "error",
                showConfirmButton: false,
                timer: 1000,
                customClass: {
                    container: "my-swal-container",
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFormSubmit();
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
                        required
                    />
                </div>
                <div>
                    <label htmlFor="name" className="text-sm">Nama Perusahaan</label>
                    <input
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="business_scale_id" className="text-sm">Skala Bisnis</label>
                    <select
                        id="business_scale_id"
                        value={formData.business_scale_id}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="" disabled>---</option>
                        {businessScale.map((scale) => (
                            <option key={scale.id} value={scale.id}>{scale.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="product_type_id" className="text-sm">
                        Jenis Produk
                    </label>
                    <select
                        id="product_type_id"
                        value={formData.product_type_id}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        // 'appearance-none' ditambahkan untuk menghilangkan styling default browser pada select jika diinginkan,
                        required
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
                </div>
                <div>
                    <label htmlFor="type" className="text-sm">
                        Jenis Pengajuan
                    </label>
                    <select
                        id="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        // 'appearance-none' ditambahkan untuk menghilangkan styling default browser pada select jika diinginkan,
                        required
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
                        required
                    />
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
                        required
                    />
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
                        required
                    />
                </div>
                <div>
                    <label htmlFor="province_id" className="text-sm">
                        Provinsi
                    </label>
                    <select
                        id="province_id"

                        value={formData.province_id}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
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
                </div>

                <div>
                    <label htmlFor="regency_id" className="text-sm">
                        Kabupaten / Kota
                    </label>
                    <div className="relative">
                        <select
                            id="regency_id"
                            value={formData.regency_id}
                            onChange={handleInputChange}
                            className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={!formData.province_id}
                        >
                            <option value="" disabled>
                                {isLoadingRegencies ? "Memuat data Kabupaten / Kota ..." : "Pilih Kabupaten / Kota"}
                            </option>

                            {!isLoadingRegencies &&
                                regencies.map((regency: any) => (
                                    <option key={regency.id} value={regency.id}>
                                        {regency.name}
                                    </option>
                                ))
                            }
                        </select>

                        {/* Horizontal Loading Bar Overlay */}
                        {isLoadingRegencies && (
                            <div className="absolute left-0 right-0 bottom-1 h-[3px] bg-blue-500 animate-pulse rounded-b-md" />
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="district_id" className="text-sm">
                        Kecamatan
                    </label>
                    <div className="relative">
                        <select
                            id="district_id"
                            value={formData.district_id}
                            onChange={handleInputChange}
                            className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            // 'appearance-none' ditambahkan untuk menghilangkan styling default browser pada select jika diinginkan,
                            required
                            disabled={!formData.province_id}
                        >
                            <option value="" disabled>
                                {isLoadingDistricts ? "Memuat data Kecamatan ..." : "Pilih Kecamatan"}
                            </option>
                            {!isLoadingDistricts &&
                                districts.map((district: any) => (
                                    <option key={district.id} value={district.id}>
                                        {district.name}
                                    </option>
                                ))}
                        </select>
                        {/* Horizontal Loading Bar Overlay */}
                        {isLoadingDistricts && (
                            <div className="absolute left-0 right-0 bottom-1 h-[3px] bg-blue-500 animate-pulse rounded-b-md" />
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="village_id" className="text-sm">
                        Kelurahan/Desa
                    </label>
                    <select
                        id="village_id"
                        value={formData.village_id}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        // 'appearance-none' ditambahkan untuk menghilangkan styling default browser pada select jika diinginkan,
                        required
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
                        required
                    />
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
                        required
                    />
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
                        required
                    />
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
                        required
                    />
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
                        required
                    />
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
        </div>
    );
};

export default AgentAddSubmission;
