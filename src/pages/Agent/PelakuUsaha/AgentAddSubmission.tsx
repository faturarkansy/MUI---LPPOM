import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormDataType {
  nib: string;
  name: string;
  business_scale_id: string;
  location_id: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  date: Date | null;
  product_type_id: string;
  type: string;
  facility: string;
  product: string;
  due: Date | null;
}

type FormErrorType = Partial<Record<keyof FormDataType, string>>;

const AgentAddSubmission = () => {
  const today = new Date();
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({
    nib: "",
    name: "",
    business_scale_id: "1",
    location_id: "1",
    address: "",
    phone: "",
    fax: "",
    email: "",
    date: today,
    product_type_id: "1",
    type: "new",
    facility: "",
    product: "",
    due: today,
  });

  const [errors, setErrors] = useState<FormErrorType>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm1 = (): FormErrorType => {
    let newErrors: FormErrorType = {};
    if (!formData.nib.trim())
      newErrors.nib = "Field tidak boleh kosong";
    if (!formData.name.trim())
      newErrors.name = "Field tidak boleh kosong";
    return newErrors;
  };

  const validateForm2 = (): FormErrorType => {
    let newErrors: FormErrorType = {};
    if (!formData.product_type_id.trim())
      newErrors.product_type_id = "Field tidak boleh kosong";
    if (!formData.type.trim())
      newErrors.type = "Field tidak boleh kosong";
    if (!formData.due)
      newErrors.due = "Field tidak boleh kosong";
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateForm1();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setFormStep(2);
    }
  };

  const handleDateChange = (name: keyof FormDataType, date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const newErrors = validateForm2();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const formDataToSend = new FormData();
        for (const key in formData) {
          const value = (formData as any)[key];
          const isDate = value instanceof Date;
          formDataToSend.append(
            key,
            isDate ? value.toISOString().split("T")[0] : value || ""
          );
        }

        const response = await fetch("http://mui.invix.id/api/v1/ext/submissions", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) throw new Error("Gagal mengirim data");

        const result = await response.json();
        console.log("Berhasil:", result);
        alert("Data berhasil dikirim!");
      } catch (error) {
        console.error("Error:", error);
        alert("Gagal mengirim data");
      }
    }
  };

  return (
    <div>
      {/* Header Title with full width and bottom-left alignment */}
      <div className="w-full h-20 bg-gradient-to-r from-[#1975a6] to-[#87d1f8] flex items-end justify-start px-6 py-3 mb-3 rounded-3xl text-white">
        <h1 className="font-normal text-3xl">Submissions</h1>
      </div>

      <div className="w-full h-9 bg-gradient-to-r from-[#1975a6] to-[#87d1f8] flex items-center justify-start px-6 py-3 mb-3 rounded-3xl text-white">
        <ol className="flex items-center font-medium whitespace-nowrap">
          <li className="inline-flex items-center text-sm">Submissions</li>
          <li className="mx-2">/</li>
          <li className="inline-flex items-center text-sm">
            {formStep === 1 ? "Add Pelaku Usaha" : "Add Submission"}
          </li>
        </ol>
      </div>

      {formStep === 1 && (
        <div className="space-y-4 text-left mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">NIB</label>
            <input
              name="nib"
              value={formData.nib}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
            />
            {errors.nib && <p className="text-red-500 text-sm">{errors.nib}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Perusahaan/Usaha</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="businessScale"
            >
              Skala Usaha
            </label>
            <div className="relative">
              <select
                name="business_scale_id"
                value={formData.business_scale_id}
                onChange={handleChange}
                id="businessScale"
                className="appearance-none mt-1 block w-full border border-black rounded-md p-2 text-sm pr-8"
              >
                <option value="1">Mikro & Kecil</option>
                <option value="2">Menengah</option>
                <option value="3">Besar</option>
                <option value="4">Luar Negeri</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="location_id"
            >
              Lokasi
            </label>
            <div className="relative">
              <select
                id="location_id"
                className="appearance-none mt-1 block w-full border border-black rounded-md p-2 text-sm pr-8 "
              >
                <option value="1">Aceh</option>
                <option value="2">Sumatera Utara</option>
                <option value="3">Sumatera Barat</option>
                <option value="4">Riau</option>
                <option value="5">Kepulauan Riau</option>
                <option value="6">Jambi</option>
                <option value="7">Sumatera Selatan</option>
                <option value="8">Bengkulu</option>
                <option value="9">Lampung</option>
                <option value="10">Bangka Belitung</option>
                <option value="11">DKI Jakarta</option>
                <option value="12">Jawa Barat</option>
                <option value="13">Banten</option>
                <option value="14">Jawa Tengah</option>
                <option value="15">DI Yogyakarta</option>
                <option value="16">Jawa Timur</option>
                <option value="17">Bali</option>
                <option value="18">Nusa Tenggara Barat</option>
                <option value="19">Nusa Tenggara Timur</option>
                <option value="20">Kalimantan Barat</option>
                <option value="21">Kalimantan Tengah</option>
                <option value="22">Kalimantan Selatan</option>
                <option value="23">Kalimantan Timur</option>
                <option value="24">Kalimantan Utara</option>
                <option value="25">Sulawesi Utara</option>
                <option value="26">Gorontalo</option>
                <option value="27">Sulawesi Tengah</option>
                <option value="28">Sulawesi Barat</option>
                <option value="29">Sulawesi Selatan</option>
                <option value="30">Sulawesi Tenggara</option>
                <option value="31">Maluku</option>
                <option value="32">Maluku Utara</option>
                <option value="33">Papua</option>
                <option value="34">Papua Barat</option>
                <option value="35">Papua Pegunungan</option>
                <option value="36">Papua Selatan</option>
                <option value="37">Papua Tengah</option>
                <option value="38">Papua Barat Daya</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alamat Perusahaan
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telepon Perusahaan
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fax Perusahaan
            </label>
            <input
              name="fax"
              value={formData.fax}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Perusahaan
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
            />
          </div>
          <div className="text-right pt-4">
            <button
              onClick={handleNext}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {formStep === 2 && (
        <div className="space-y-4 text-left mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Perusahaan/Usaha</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              disabled
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm bg-gray-200 text-gray-700 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => handleDateChange("date", date)}
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm "
              dateFormat="yyyy-MM-dd"
              wrapperClassName="block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jumlah Fasilitas
            </label>
            <input
              name="facility"
              value={formData.facility}
              onChange={handleChange}
              type="number"
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jumlah Produk
            </label>
            <input
              name="product"
              value={formData.product}
              onChange={handleChange}
              type="number"
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jenis Produk</label>
            <select
              id="product_type_id"
              name="product_type_id"
              value={formData.product_type_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
            >
              <option value="1">Susu & Analognya</option>
              <option value="2">Lemak, Minyak, & Emulsi Minyak</option>
              <option value="3">Es Untuk Dimakan (Edible Ice) Termasuk Sherbet dan Sorbet</option>
              <option value="4">Buah dan Sayur dengan Pengolahan dan Penambahan Bahan Tambahan Pangar</option>
              <option value="5">Kembang Gula/Permen dan Cokelat</option>
              <option value="6">Serealia dan Produk Serealia Yang Merupakan Produk Turunan Dari Biji Serealia, Akar & Umbi, Kacang-kacangan dan Empulur dengan Pengolahan dan Penambahan Bahan Tambahan Pangan</option>
              <option value="7">Produk Bakeri</option>
              <option value="8">Daging & Produk Olahan Daging</option>
              <option value="9">Daging & Produk Olahan Daging (Gelatin)</option>
              <option value="10">Ikan dan Produk Perikanan, Termasuk Moluska, Krustase, dan Ekinodermata dengan Pengolahan dan Penambahan Bahan Tambahan Pangan</option>
              <option value="11">Telur Olahan dan Produk-Produk Telur Hasil Olahan</option>
              <option value="12">Gula Pemanis Termasuk Madu</option>
            </select>
            {errors.product_type_id && <p className="text-red-500 text-sm">{errors.product_type_id}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jenis Pengajuan</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
            >
              <option value="new">Baru</option>
              <option value="development">Pengembangan</option>
              <option value="facilities_development">Pengembangan Fasilitas</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jatuh Tempo</label>
            <DatePicker
              selected={formData.due}
              onChange={(date) => handleDateChange("due", date)}
              className="mt-1 block w-full border border-black rounded-md p-2 text-sm"
              dateFormat="yyyy-MM-dd"
              wrapperClassName="block w-full"
            />
            {errors.due && <p className="text-red-500 text-sm">{errors.due}</p>}
          </div>
          <div className="text-right pt-4">
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentAddSubmission;
