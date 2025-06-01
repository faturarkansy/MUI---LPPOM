import React, { useState, useEffect, FormEvent } from "react";
import Swal from "sweetalert2";
import { XIcon } from "../../icons";
import axiosClient from "../../axios-client";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger: boolean;
  setRefreshTrigger: (value: boolean) => void;
}

interface CompanyFormData {
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
  submission: {
    product_type_id: string;
    type: string;
    date: string;
    facility: string;
    product: string;
    due: string;
    cost: string;
  };
}

const initCompanyFormData: CompanyFormData = {
  user_id: "",
  business_scale_id: "",
  location_id: "",
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
  submission: {
    product_type_id: "",
    type: "",
    date: "",
    facility: "",
    product: "",
    due: "",
    cost: "",
  },
};

const SubmissionAddModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  refreshTrigger,
  setRefreshTrigger,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] =
    useState<CompanyFormData>(initCompanyFormData);
  const [businessScale, setBusinessScale] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);

  // Reset form ketika modal dibuka (jika isOpen berubah menjadi true)
  useEffect(() => {
    if (isOpen) {
      const fetchBusinessScale = async () => {
        const axiosResponse = await axiosClient.get("/ext/business-scales");
        setBusinessScale(axiosResponse.data.data || []);
      };
      const fetchLocation = async () => {
        const axiosResponse = await axiosClient.get("/ext/locations");
        setLocations(axiosResponse.data.data || []);
      };
      const fetchProductTypes = async () => {
        const axiosResponse = await axiosClient.get("/ext/product-types");
        setProductTypes(axiosResponse.data.data || []);
      };
      fetchBusinessScale();
      fetchLocation();
      fetchProductTypes();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
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
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [id]: value,
        },
      }));
    } else if (
      [
        "product_type_id",
        "type",
        "date",
        "facility",
        "product",
        "due",
        "cost",
      ].includes(id)
    ) {
      setFormData((prev) => ({
        ...prev,
        submission: {
          ...prev.submission,
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
      console.log("Form data: ", formData);
      const axiosResponse = await axiosClient.post(
        `/ext/submissions`,
        formData
      );
      //   alert("Test allert!");
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
      console.log("Axios response: ", axiosResponse);
    } catch (err: any) {
      console.error("Failed:", err);
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
      setFormData(initCompanyFormData);
      onClose();
      setRefreshTrigger(!refreshTrigger);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Anda bisa menambahkan validasi di sini sebelum submit
    handleFormSubmit();
  };

  return (
    <div
      onClick={onClose}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/75 flex justify-center items-center z-999999"
    >
      <div className="px-2 py-1 rounded-2xl bg-white">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-5 rounded-lg w-[clamp(300px,80vw,500px)] max-h-[90vh] overflow-y-auto shadow-md"
        >
          <div className="flex justify-end items-center">
            <button
              aria-label="close-modal"
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nib" className="text-sm">
                NIB Perusahaan
              </label>
              <input
                id="nib"
                value={formData.nib}
                onChange={handleInputChange}
                // onBlur={handleCheckNIB}
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
                value={formData.name}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="business_scale_id" className="text-sm">
                Skala Bisnis Perusahaan
              </label>
              <select
                id="business_scale_id"
                value={formData.business_scale_id}
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
                Provinsi Perusahaan
              </label>
              <select
                id="location_id"
                value={formData.location_id}
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
              <label htmlFor="fax" className="text-sm">
                Nomor Fax Perusahaan
              </label>
              <input
                id="fax"
                value={formData.meta.fax}
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
            <div>
              <label htmlFor="cp_name" className="flex text-sm">
                <p>Nama CP</p>
                <p className="ml-3 font-light">*(Opsional)</p>
              </label>
              <input
                id="cp_name"
                value={formData.meta.cp_name}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="cp_phone" className="flex text-sm">
                <p>Nomor Telepon CP</p>
                <p className="ml-3 font-light">*(Opsional)</p>
              </label>
              <input
                id="cp_phone"
                value={formData.meta.cp_phone}
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
                value={formData.meta.cp_email}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="product_type_id" className="text-sm">
                Jenis Produk
              </label>
              <select
                id="product_type_id"
                value={formData.submission.product_type_id}
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
                value={formData.submission.type}
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
                value={formData.submission.date}
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
                value={formData.submission.facility}
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
                value={formData.submission.product}
                onChange={handleInputChange}
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="due" className="text-sm">
                Tanggal Pengajuan Selesai
              </label>
              <input
                id="due"
                value={formData.submission.due}
                onChange={handleInputChange}
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div className="text-right pt-4">
              {!isLoading ? (
                <button
                  type="submit"
                  className="inline-block bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 text-sm"
                >
                  Kirim
                </button>
              ) : (
                <button className="inline-block bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 text-sm">
                  .....
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmissionAddModal;
