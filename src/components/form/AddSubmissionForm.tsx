import React from "react";

interface Props {
    formData: any;
    businessScale: any[];
    productTypes: any[];
    provinces: any[];
    regencies: any[];
    districts: any[];
    villages: any[];
    isLoading: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddSubmissionForm: React.FC<Props> = ({
    formData,
    businessScale,
    productTypes,
    provinces,
    regencies,
    districts,
    villages,
    isLoading,
    handleInputChange,
    handleSubmit,
}) => {
    return (
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
                <label htmlFor="product_type_id" className="text-sm">Jenis Produk</label>
                <select
                    id="product_type_id"
                    value={formData.product_type_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                >
                    <option value="" disabled>---</option>
                    {productTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.type}</option>
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
                    Kabupaten
                </label>
                <select
                    id="regency_id"
                    value={formData.regency_id}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // 'appearance-none' ditambahkan untuk menghilangkan styling default browser pada select jika diinginkan,
                    required
                    disabled={!formData.province_id}
                >
                    <option value="" disabled>
                        Pilih Kabupaten...
                    </option>
                    {regencies.map((regency) => (
                        <option key={regency.id} value={regency.id}>
                            {regency.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="district_id" className="text-sm">
                    Kecamatan
                </label>
                <select
                    id="district_id"
                    value={formData.district_id}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // 'appearance-none' ditambahkan untuk menghilangkan styling default browser pada select jika diinginkan,
                    required
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
    );
};

export default AddSubmissionForm;
