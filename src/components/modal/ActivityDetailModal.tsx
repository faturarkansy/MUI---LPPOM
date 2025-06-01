import React, { useState, useEffect } from "react";
import { XIcon } from "../../icons";
import axiosClient from "../../axios-client";

interface AddUserModalProps {
  submissionId: number | null;
  isOpen: boolean;
  onClose: () => void;
  activityId: number | null;
}

interface ActivityData {
  // submission_id: string;
  // user_id: string;
  date: string;
  status: string;
  activity: string;
  response: string;
}

const initialActivityState: ActivityData = {
  // submission_id: "",
  // user_id: "",
  date: "",
  status: "",
  activity: "",
  response: "",
};

const ActivityDetailModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  activityId,
}) => {
  const [activityData, setActivityData] =
    useState<ActivityData>(initialActivityState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosResponse = await axiosClient.get(
          `/ext/submission-histories/${activityId}`
        );
        const responseData = axiosResponse.data.data;
        setActivityData({
          // submission_id: String(responseData.submission_id),
          // user_id: String(responseData.user_id),
          date: responseData.date || "",
          status: responseData.status || "",
          activity: responseData.activity || "",
          response: responseData.response || "",
        });
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, activityId]);

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
            {Object.entries(activityData).map(([key, value]) => {
              const formattedKey =
                key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
              return (
                <li key={key} className="grid grid-cols-4 mb-2">
                  <div>{formattedKey}</div>
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

export default ActivityDetailModal;
