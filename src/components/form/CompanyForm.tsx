import { useState } from "react";
// import axiosClient from "../../../axios-client.js";

interface CompanyData {
  user_id: string;
  business_scale_id: string;
  location_id: string;
  name: string;
  nib: string;
  meta: {
    address: string;
    phone: string;
    fax: string;
    email: string;
    pic_name: string;
    pic_phone: string;
    pic_email: string;
    cp_name: string;
    cp_phone: string;
    cp_email: string;
  };
  // [key: string]: any;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export default function CompanyForm() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    // --- default values
    user_id: "2",
    business_scale_id: "1",
    location_id: "1",
    // ---
    name: "",
    nib: "",
    meta: {
      address: "",
      phone: "",
      fax: "",
      email: "",
      pic_name: "",
      pic_phone: "",
      pic_email: "",
      cp_name: "",
      cp_phone: "",
      cp_email: "",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Untuk field yang ada di dalam meta
    if (
      [
        "address",
        "phone",
        "fax",
        "email",
        "pic_name",
        "pic_phone",
        "pic_email",
        "cp_name",
        "cp_phone",
        "cp_email",
      ].includes(id)
    ) {
      setCompanyData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [id]: value,
        },
      }));
    } else {
      // Untuk field di level root
      setCompanyData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const validateCompanyData = (data: CompanyData): ValidationResult => {
    const errors: string[] = [];

    // // Validasi field utama
    // if (!data.name.trim()) errors.push("Nama perusahaan wajib diisi");
    // if (!data.nib.trim()) errors.push("NIB perusahaan wajib diisi");

    // // Validasi meta fields
    // const requiredMetaFields: (keyof CompanyData["meta"])[] = [
    //   "address",
    //   "phone",
    //   "email",
    //   "pic_name",
    //   "pic_phone",
    //   "pic_email",
    //   "cp_name",
    //   "cp_phone",
    //   "cp_email",
    // ];

    // requiredMetaFields.forEach((field) => {
    //   if (!data.meta[field].trim()) {
    //     errors.push(`${field.replace("_", " ").toUpperCase()} wajib diisi`);
    //   }
    // });

    // Validasi format email
    const emailFields = ["email", "pic_email", "cp_email"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    emailFields.forEach((field) => {
      const email = data.meta[field as keyof CompanyData["meta"]];
      if (email && !emailRegex.test(email)) {
        errors.push(
          `Format ${field.replace("_", " ").toUpperCase()} tidak valid`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    const validation = validateCompanyData(companyData);

    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }

    // axiosClient
    //   .post("/tokens", companyData)
    //   .then(({ data }) => {
    //     console.log(
    //       "Berhasil menyimpan company submission ke local host ?",
    //       data
    //     );
    //     navigate("/agent/pelaku-usaha/submission");
    //   })
    //   .catch((err) => {
    //     const response = err.response;
    //     if (response && response.status === 422) {
    //       console.error(response.data.message);
    //     }
    //   });

    console.log(
      "Berhasil menyimpan company submission ke local host! :",
      companyData
    );
  };

  return (
    <div>
      {/* Form 1 */}
      {/* <div className="grid grid-cols-3 gap-6 my-4"> */}
      <div className="grid grid-cols-2 gap-6 my-4">
        {/* Left side: title */}
        <div className="text-left">
          {/* <h2 className="text-lg font-semibold text-gray-900">
                  Profil Perusahaan
                </h2> */}
          <p className="text-sm text-gray-500">
            * Isi detail perusahaan yang ingin didaftarkan sertifikasi Halal.
          </p>
        </div>
        {/* Right side: form */}
        <div className="col-span-2 space-y-4 text-left mb-4">
          <form onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Perusahaan
              </label>
              <input
                id="name"
                value={companyData.name}
                onChange={handleInputChange}
                type="text"
                placeholder="Nama Perusahaan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                NIB Perusahaan
              </label>
              <input
                id="nib"
                value={companyData.nib}
                onChange={handleInputChange}
                type="text"
                placeholder="NIB Perusahaan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alamat Perusahaan
              </label>
              <input
                id="address"
                value={companyData.meta.address}
                onChange={handleInputChange}
                type="text"
                placeholder="Alamat Perusahaan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nomor Telepon Perusahaan
              </label>
              <input
                id="phone"
                value={companyData.meta.phone}
                onChange={handleInputChange}
                type="text"
                placeholder="+62xxx-xxxx-xxxx"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nomor Fax Perusahaan
              </label>
              <input
                id="fax"
                value={companyData.meta.fax}
                onChange={handleInputChange}
                type="text"
                placeholder="021-xxxx-xxxx"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Perusahaan
              </label>
              <input
                id="email"
                value={companyData.meta.email}
                onChange={handleInputChange}
                type="text"
                placeholder="example@email.com"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama PIC
              </label>
              <input
                id="pic_name"
                value={companyData.meta.pic_name}
                onChange={handleInputChange}
                type="text"
                placeholder="Nama PIC Perusahaan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nomor Telepon PIC
              </label>
              <input
                id="pic_phone"
                type="text"
                value={companyData.meta.pic_phone}
                onChange={handleInputChange}
                placeholder="Nomor Telepon PIC Perusahaan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email PIC
              </label>
              <input
                id="pic_email"
                value={companyData.meta.pic_email}
                onChange={handleInputChange}
                type="text"
                placeholder="Email PIC Perusahaan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama CP
              </label>
              <input
                id="cp_name"
                value={companyData.meta.cp_name}
                onChange={handleInputChange}
                type="text"
                placeholder="Nama CP Perusahaan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nomor Telepon CP
              </label>
              <input
                id="cp_phone"
                value={companyData.meta.cp_phone}
                onChange={handleInputChange}
                type="text"
                placeholder="Nomor Telepon CP Perusahaan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email CP
              </label>
              <input
                id="cp_email"
                value={companyData.meta.cp_email}
                onChange={handleInputChange}
                type="text"
                placeholder="Email CP Perusahaan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div className="text-right pt-4">
              <button
                type="submit"
                className="inline-block bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 text-sm"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
