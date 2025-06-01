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

interface ActivitiesFormData {
  submission_id: string;
  user_id: string;
  date: string;
  status: string;
  activity: string;
  response: string;
}

const initCompanyFormData: ActivitiesFormData = {
  user_id: "",
  submission_id: "",
  date: "",
  status: "",
  activity: "",
  response: "",
};

const ActivityAddModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  refreshTrigger,
  setRefreshTrigger,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] =
    useState<ActivitiesFormData>(initCompanyFormData);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Reset form ketika modal dibuka (jika isOpen berubah menjadi true)
  useEffect(() => {
    if (isOpen) {
      const fetchSubmissionsData = async () => {
        const axiosResponse = await axiosClient.get("/ext/submissions");
        setSubmissions(axiosResponse.data.data || []);
      };
      fetchSubmissionsData();
      const userLocalData = localStorage.getItem("USER");
      const userId = JSON.parse(userLocalData || "{}").id || "";
      formData.user_id = String(userId);
    }
  }, [isOpen]);

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
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    try {
      console.log("Form data: ", formData);
      const axiosResponse = await axiosClient.post(
        `/ext/submission-histories`,
        formData
      );
      console.log("Axios response: ", axiosResponse);
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
              <label htmlFor="submission_id" className="text-sm">
                Submission ID
              </label>
              <select
                id="submission_id"
                value={formData.submission_id}
                onChange={handleInputChange}
                className="w-full p-2 mb-[10px] border border-[#ccc] rounded box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="" disabled>
                  .....
                </option>
                {submissions.map((submission: any) => (
                  <option key={submission.id} value={submission.id}>
                    {submission.company.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="text-sm">
                Tanggal
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
              <label htmlFor="status" className="text-sm">
                Status
              </label>
              <input
                id="status"
                value={formData.status}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="activity" className="text-sm">
                Activity
              </label>
              <input
                id="activity"
                value={formData.activity}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="response" className="text-sm">
                Response
              </label>
              <input
                id="response"
                value={formData.response}
                onChange={handleInputChange}
                type="text"
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

export default ActivityAddModal;
