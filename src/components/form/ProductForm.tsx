// const isComplete = Object.entries(companyData).every(([key, value]) => {
//   if (key === "productType") {
//     return value && value !== "Select";
//   }
//   return value && value.trim() !== "";
// });

{
  /* Jenis Produk */
}
<div>
  <label
    className="block text-sm font-medium text-gray-700"
    htmlFor="productType"
  >
    Jenis Produk Perusahaan
  </label>
  <div className="relative">
    <select
      id="productType"
      name="productType"
      // value={companyData.productType}
      className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm pr-8"
      required
    >
      <option value="Select">Pilih Jenis Produk...</option>
      <option value="Makanan dan Minuman">Makanan dan Minuman</option>
      <option value="Obat">Obat</option>
      <option value="Kosmetik">Kosmetik</option>
      <option value="Barang Gunaan">Barang Gunaan</option>
      <option value="Alat Kesehatan">Alat Kesehatan</option>
      <option value="Produk Hasil Sembelihan">Produk Hasil Sembelihan</option>
      <option value="Jasa Penyembelihan">Jasa Penyembelihan</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
</div>;

{
  /* Skala Usaha */
}
<div className="items-start gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Skala Usaha di OSS
    </label>
  </div>

  <div className="flex space-x-4">
    <div className="grid grid-cols-2 gap-2">
      <label className="inline-flex items-center">
        <input
          type="radio"
          name="skalaUsaha"
          value="UMK"
          // checked={companyData.bussiness_scale_id === "UMK"}
        />
        <span className="ml-2 text-sm text-gray-700">UMK</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="radio"
          name="skalaUsaha"
          value="Non-UMK"
          // checked={companyData.bussiness_scale_id === "Non-UMK"}
        />
        <span className="ml-2 text-sm text-gray-700">Non-UMK</span>
      </label>
    </div>
  </div>
</div>;
