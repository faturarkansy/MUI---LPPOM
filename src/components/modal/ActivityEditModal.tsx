import React, { useState, useEffect, FormEvent } from "react";
import Swal from "sweetalert2";
import { XIcon } from "../../icons";
import axiosClient from "../../axios-client";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger: boolean;
  setRefreshTrigger: (value: boolean) => void;
  activityId: number | null;
}

interface ActivityFormData {
  submission_id: string;
  user_id: string;
  date: string;
  status: string;
  activity: string;
  response: string;
}

const initFormData: ActivityFormData = {
  submission_id: "",
  user_id: "",
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
  activityId,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState<ActivityFormData>(initFormData);

  useEffect(() => {
    if (isOpen) {
      try {
        const fetchData = async () => {
          const axiosResponseActivities = await axiosClient.get(
            `/ext/submission-histories/${activityId}`
          );
          const activitiesData = axiosResponseActivities.data.data;
          if (activitiesData) {
            setFormData({
              submission_id: String(activitiesData.id),
              user_id: String(activitiesData.user_id),
              date: activitiesData.date || "",
              status: activitiesData.status || "",
              activity: activitiesData.activity || "",
              response: activitiesData.response || "",
            });
          } else {
            setFormData(initFormData);
          }
        };
        fetchData();
        console.log("Form data initialized:", formData);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setFormData(initFormData);
      }
    }
  }, [isOpen, activityId]);

  function formatDateForInput(dateString: string) {
    if (!dateString) return "";

    // Jika dateString sudah dalam format yang benar, kembalikan apa adanya
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;

    // Jika dateString menyertakan waktu, ekstrak hanya bagian tanggal
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

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
      await axiosClient.put(
        `/ext/submission-histories/${activityId}`,
        formData
      );
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
      setFormData(initFormData);
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
            {/* <div>
              <label htmlFor="agent" className="text-sm">
                Agent
              </label>
              <input
                id="agent"
                value={getUserName(formData.user_id)}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                disabled
              />
            </div> */}
            <div>
              <label htmlFor="date" className="text-sm">
                Tanggal
              </label>
              <input
                id="date"
                value={formatDateForInput(formData.date)}
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

export default ActivityAddModal;
