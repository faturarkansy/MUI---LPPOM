import React, { useState, useEffect } from "react";
import { XIcon } from "../../icons";
import axiosClient from "../../axios-client";

interface AddUserModalProps {
  submissionId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

interface UserFormData {
  company_name: string;
  product_type: string;
  type: string;
  date: string;
  facility: string;
  product: string;
  due: string;
}

const initialFormState: UserFormData = {
  company_name: "",
  product_type: "",
  type: "",
  date: "",
  facility: "",
  product: "",
  due: "",
};

const SubmissionDetailModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  submissionId,
}) => {
  const [submissionData, setSubmissionData] =
    useState<UserFormData>(initialFormState);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const axiosResponse = await axiosClient.get(
          `/ext/submissions/${submissionId}`
        );
        const submissionData = axiosResponse.data.data;
        setSubmissionData({
          company_name: submissionData.company.name || "",
          product_type: submissionData.product_type.type || "",
          type: submissionData.type || "",
          date: submissionData.date || "",
          facility: submissionData.facility || "",
          product: submissionData.product || "",
          due: submissionData.due || "",
        });
      } catch (error) {
        console.error("Failed to fetch submission:", error);
      }
    };
    if (isOpen) {
      fetchUser();
    }
  }, [isOpen, submissionId]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center z-999999"
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
          <ul>
            {Object.entries(submissionData).map(([key, value]) => {
              const formattedKey =
                key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
              return (
                <li key={key} className="grid grid-cols-4 mb-2">
                  <div className="font-semibold">{formattedKey}</div>
                  <div className="py-1 px-2 col-span-3 border rounded-sm">
                    {value}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailModal;
