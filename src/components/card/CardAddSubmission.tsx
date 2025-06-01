import { useState, FormEvent, useEffect } from "react";
import axiosClient from "../../axios-client";

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
    pic_title: string;
    pic_phone: string;
    pic_email: string;
    cp_name: string;
    cp_title: string;
    cp_phone: string;
    cp_email: string;
  };
}

const initCompanyData: CompanyData = {
  // --- default values
  user_id: "",
  business_scale_id: "",
  location_id: "",
  // ---
  name: "",
  nib: "",
  meta: {
    address: "",
    phone: "",
    fax: "",
    email: "",
    pic_name: "",
    pic_title: "",
    pic_phone: "",
    pic_email: "",
    cp_name: "",
    cp_title: "",
    cp_phone: "",
    cp_email: "",
  },
};

const CardAddSubmission = () => {
  const [userId, setUserId] = useState<number>(0);
  const [businessScale, setBusinessScale] = useState<any>([]);
  const [locations, setLocations] = useState<any>([]);
  const [companyData, setCompanyData] = useState<CompanyData>(initCompanyData);

  useEffect(() => {
    const fetchBusinessScale = async () => {
      const axiosResponse = await axiosClient.get("/ext/business-scales");
      const responseData = axiosResponse.data.data;
      setBusinessScale(responseData);
    };
    const fetchLocation = async () => {
      const axiosResponse = await axiosClient.get("/ext/locations");
      const responseData = axiosResponse.data.data;
      setLocations(responseData);
    };

    const userLocalStorage = localStorage.getItem("USER");
    const userLocalId = JSON.parse(userLocalStorage || "{}")?.id;
    setUserId(userLocalId);

    fetchBusinessScale();
    fetchLocation();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    // Untuk field yang ada di dalam meta
    if (
      [
        "address",
        "phone",
        "fax",
        "email",
        "pic_name",
        "pic_title",
        "pic_phone",
        "pic_email",
        "cp_name",
        "cp_title",
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

  const handleCheckNIB = async () => {
    console.log("Memeriksa NIB ceritanya:", companyData.nib);
    console.log(companyData);
    // const axiosResponse = await axiosClient.get(`/ext/companies`);
    // const responseData = axiosResponse.data.data;
    // const isNIBExists = responseData.some(
    //   (company: any) => company.nib === companyData.nib
    // );
  };

  const handleCompanySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    companyData.user_id = String(userId);
    // console.log("Berhasil menyimpan company:", companyData);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 my-4">
        <div className="text-left">
          <h2 className="text-lg font-bold border border-b-black text-gray-900">
            Informasi Pelaku Usaha
          </h2>
        </div>
        <div className="col-span-2 space-y-4 text-left mb-4">
          <form onSubmit={handleCompanySubmit}>
            <div>
              <label htmlFor="nib" className="text-sm">
                NIB Perusahaan
              </label>
              <input
                id="nib"
                value={companyData.nib}
                onChange={handleInputChange}
                onBlur={handleCheckNIB}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="text-sm">
                Nama Perusahaan
              </label>
              <input
                id="name"
                value={companyData.name}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="business_scale_id" className="ext-sm">
                Skala Bisnis
              </label>
              <select
                id="business_scale_id"
                value={companyData.business_scale_id}
                onChange={handleInputChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                // 'appearance-none' ditambahkan untuk menghilangkan styling default browser pada select jika diinginkan,
                required
              >
                <option value="" disabled>
                  .....
                </option>
                {businessScale.map((scale: any) => (
                  <option key={scale.id} value={scale.id}>
                    {scale.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location_id" className="text-sm">
                Provinsi
              </label>
              <select
                id="location_id"
                value={companyData.location_id}
                onChange={handleInputChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                // 'appearance-none' ditambahkan untuk menghilangkan styling default browser pada select jika diinginkan,
                required
              >
                <option value="" disabled>
                  .....
                </option>
                {locations.map((location: any) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
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
                value={companyData.meta.address}
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
                value={companyData.meta.phone}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="fax" className="text-sm">
                Nomor Fax Perusahaan
              </label>
              <input
                id="fax"
                value={companyData.meta.fax}
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
                value={companyData.meta.email}
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
                value={companyData.meta.pic_name}
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
                value={companyData.meta.pic_phone}
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
                value={companyData.meta.pic_email}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="cp_name" className="flex text-sm">
                <p>Nama CP</p>
                <p className="ml-3 font-light">*(Opsional)</p>
              </label>
              <input
                id="cp_name"
                value={companyData.meta.cp_name}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="cp_phone" className="flex text-sm">
                <p>Nomor Telepon CP</p>
                <p className="ml-3 font-light">*(Opsional)</p>
              </label>
              <input
                id="cp_phone"
                value={companyData.meta.cp_phone}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="cp_email" className="flex text-sm">
                <p>Email CP</p>
                <p className="ml-3 font-light">*(Opsional)</p>
              </label>
              <input
                id="cp_email"
                value={companyData.meta.cp_email}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
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
};

export default CardAddSubmission;
