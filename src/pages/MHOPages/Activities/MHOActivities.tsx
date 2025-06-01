import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import axiosClient from "../../../axios-client";
import { useEffect, useState, useRef } from "react";
import { DotsIcon, PlusIcon } from "../../../icons";
// import { ref } from "process";
import ActivityAddModal from "../../../components/modal/ActivityAddModal";
import ActivityEditModal from "../../../components/modal/ActivityEditModal";
// import ActivityDetailModal from "../../../components/modal/ActivityDetailModal";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";

const MHOActivities = () => {
  const [submissionHistoriesData, setSubmissionHistoriesData] = useState<any[]>(
    []
  );
  const [usersData, setUsersData] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [selectedActivitiesId, setSelectedActivitiesId] = useState<
    number | null
  >(null);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Tambahkan ref untuk menu dropdown
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // --- toggle menu function ---
  const toggleMenu = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah event propagation
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosResponseSubmissionHistories = await axiosClient.get(
          "/ext/submission-histories"
        );
        setSubmissionHistoriesData(axiosResponseSubmissionHistories.data.data);

        const axiosResponseUsers = await axiosClient.get("/users");
        const responseUsers = axiosResponseUsers.data.data;
        setUsersData(responseUsers);

        // const agentUsers = responseUsers.filter(
        //   (user: any) =>
        //     user.roles &&
        //     Array.isArray(user.roles) &&
        //     user.roles.some((role: any) => role.name === "agent" || user.id === "1")
        // );
        // setUsersData(agentUsers);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenuId !== null &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId]?.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleOpenModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (submissionId: number) => {
    setSelectedActivitiesId(submissionId);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedActivitiesId(null);
  };

  // const handleOpenDetailModal = (submissionId: number) => {
  //   setSelectedActivitiesId(submissionId);
  //   setIsDetailModalOpen(true);
  //   setOpenMenuId(null);
  // };

  // const handleCloseDetailModal = () => {
  //   setIsDetailModalOpen(false);
  //   setSelectedActivitiesId(null);
  // };

  const handleOpenDeleteModal = (submissionId: number) => {
    setSelectedActivitiesId(submissionId);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedActivitiesId(null);
  };

  function formatDate(dateString: string) {
    // Pastikan input tidak kosong
    if (!dateString) return "";

    // Buat objek Date
    const date = new Date(dateString);

    // Array nama bulan dalam bahasa Indonesia
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    // Ambil komponen tanggal
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Format tanggal
    return `${day} ${month} ${year}`;
  }

  function getUserName(userId: string) {
    const user = usersData.find((user) => user.id === userId);
    console.log("agent name ", user?.name);
    return user ? user.name : "Unknown Agent";
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Pelaku Usaha" />
      <div className="py-3 flex justify-end lg:justify-between items-center">
        <div className="hidden lg:block">
          {/* <div className="relative">
                  <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                    <svg
                      className="fill-gray-500 dark:fill-gray-400"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                        fill=""
                      />
                    </svg>
                  </span>
                  <input
                    // ref={inputRef}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Search..."
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                  />
                </div> */}
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="m-3 sm:m-0 p-2 flex items-center border border-[#7EC34B] text-[#7EC34B] rounded-lg"
        >
          <PlusIcon className="mr-1 w-6 h-6" />
          <span>{"Add New"}</span>
        </button>
      </div>
      <div className="mt-6 rounded-lg shadow-sm overflow-hidden">
        <table className="mb-30 min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Agent
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal Pengajuan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status Pengajuan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aktivitas
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Response
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissionHistoriesData.length > 0 &&
              submissionHistoriesData.map((submissionHistory) => (
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getUserName(submissionHistory.user_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {/* {submissionHistory.date.substring(0, 10)}  */}
                      {formatDate(submissionHistory.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {submissionHistory.status ? (
                      <span className="text-sm text-gray-900">
                        {submissionHistory.status}
                      </span>
                    ) : (
                      <span className="text-gray-600">Tidak ada status</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-sm leading-5 text-gray-900">
                      {submissionHistory.activity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submissionHistory.response ? (
                      <span className="text-sm text-gray-900">
                        {submissionHistory.response}
                      </span>
                    ) : (
                      <span className="text-gray-600">Tidak ada response</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="relative">
                      <button
                        aria-label="company-menus"
                        onClick={(e) => toggleMenu(submissionHistory.id, e)}
                        className="p-2 bg-gray-400 rounded-lg"
                      >
                        <DotsIcon />
                      </button>
                      {/* Dropdown Menu */}
                      {openMenuId === submissionHistory.id && (
                        <div
                          ref={(el) =>
                            (menuRefs.current[submissionHistory.id] = el)
                          }
                          // className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                          className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                        >
                          <ul className="py-1 text-sm text-gray-700">
                            {/* <li>
                              <button
                                onClick={handleOpenDetailModal.bind(
                                  null,
                                  submissionHistory.id
                                )}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                Detail
                              </button>
                            </li> */}
                            <li>
                              <button
                                onClick={handleOpenEditModal.bind(
                                  null,
                                  submissionHistory.id
                                )}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={handleOpenDeleteModal.bind(
                                  null,
                                  submissionHistory.id
                                )}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ActivityAddModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
      />

      {/* <ActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        submissionId={selectedActivitiesId}
        activityId={selectedActivitiesId}
      /> */}

      <ActivityEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
        activityId={selectedActivitiesId}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
        url={`/ext/submission-histories/${selectedActivitiesId}`}
      />
    </div>
  );
};

export default MHOActivities;
