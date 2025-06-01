import React, { useState, useEffect, FormEvent } from "react";
import Swal from "sweetalert2";
import { XIcon } from "../../icons";
import axiosClient from "../../axios-client";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger: boolean;
  setRefreshTrigger: (value: boolean) => void;
  submissionId: number | null;
}

interface SubmissionFormData {
  user_id: string;
  company_id: string;
  product_type_id: string;
  type: string;
  date: string;
  facility: string;
  product: string;
  due: string;
}

const initFormData: SubmissionFormData = {
  user_id: "",
  company_id: "",
  product_type_id: "",
  type: "",
  date: "",
  facility: "",
  product: "",
  due: "",
};

const SubmissionAddModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  refreshTrigger,
  setRefreshTrigger,
  submissionId,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState<SubmissionFormData>(initFormData);
  const [productTypes, setProductTypes] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const fetchData = async () => {
          const axiosResponseProductTypes = await axiosClient.get(
            "/ext/product-types"
          );
          setProductTypes(axiosResponseProductTypes.data.data || []);
          const axiosResponseSubmissions = await axiosClient.get(
            `/ext/submissions/${submissionId}`
          );
          const submissionData = axiosResponseSubmissions.data.data;
          if (submissionData) {
            setFormData({
              user_id: submissionData.user_id || "",
              company_id: submissionData.company_id || "",
              product_type_id: submissionData.product_type_id || "",
              type: submissionData.type || "",
              date: submissionData.date || "",
              facility: submissionData.facility || "",
              product: submissionData.product || "",
              due: submissionData.due || "",
              // cost: submissionData.cost || "",
            });
          } else {
            setFormData(initFormData);
          }
        };
        fetchData();
      } catch (error) {
        console.error("Error", error);
      } finally {
        setFormData(initFormData);
      }
    }
  }, [isOpen, submissionId]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // console.log(`Field ${id} changed to ${value}`);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      console.log("Form data: ", formData);
      await axiosClient.put(`/ext/submissions/${submissionId}`, formData);
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
      // setFormData(initFormData);
      setIsSubmit(false);
      onClose();
      setRefreshTrigger(!refreshTrigger);
    }
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
              <label htmlFor="due" className="text-sm">
                Tanggal Pengajuan Selesai
              </label>
              <input
                id="due"
                value={formData.due}
                onChange={handleInputChange}
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div className="text-right pt-4">
              {!isSubmit ? (
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
