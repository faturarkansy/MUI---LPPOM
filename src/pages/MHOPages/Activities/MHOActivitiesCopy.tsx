import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import axiosClient from "../../../axios-client";
import { useEffect, useState, useRef } from "react";
import { DotsIcon } from "../../../icons";

const MHOActivities = () => {
  const [submissionHistoriesData, setSubmissionHistoriesData] = useState<any[]>(
    []
  );
  const [usersData, setUsersData] = useState<any[]>([]);
  // const [selectedActivitiesId, setSelectedActivitiesId] = useState<
  //   number | null
  // >(null);

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
        //     user.roles.some((role: any) => role.name === "agent")
        // );
        // setUsersData(agentUsers);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    fetchData();
  }, []);

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

  function getAgentName(userId: string) {
    const user = usersData.find((user) => user.id === userId);
    return user ? user.name : "Unknown Agent";
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Pelaku Usaha" />
      <div className="mt-6 rounded-lg shadow-sm overflow-hidden">
        {/* <p>This is the MHO Company page.</p> */}

        {/* <table className="min-w-full divide-y divide-gray-200">
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
          <tbody className="bg-white divide-y divide-gray-200"> */}
        {submissionHistoriesData.length > 0 &&
          submissionHistoriesData.map((submissionHistory) => (
            // <tr className="hover:bg-gray-50">
            //   <td className="px-6 py-4 whitespace-nowrap">
            //     <div className="text-sm font-medium text-gray-900">
            //       {getAgentName(submissionHistory.user_id)}
            //     </div>
            //   </td>
            //   <td className="px-6 py-4 whitespace-nowrap">
            //     <div className="text-sm text-gray-900">
            //       {/* {submissionHistory.date.substring(0, 10)}  */}
            //       {formatDate(submissionHistory.date)}
            //     </div>
            //   </td>
            //   <td className="px-6 py-4">
            //     {submissionHistory.status ? (
            //       <span className="text-sm text-gray-900">
            //         {submissionHistory.status}
            //       </span>
            //     ) : (
            //       <span className="text-gray-600">Tidak ada status</span>
            //     )}
            //   </td>
            //   <td className="px-6 py-4 whitespace-nowrap">
            //     <span className="px-2 inline-flex text-sm leading-5 text-gray-900">
            //       {submissionHistory.activity}
            //     </span>
            //   </td>
            //   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            //     {submissionHistory.response ? (
            //       <span className="text-sm text-gray-900">
            //         {submissionHistory.response}
            //       </span>
            //     ) : (
            //       <span className="text-gray-600">Tidak ada response</span>
            //     )}
            //   </td>
            //   <td className="px-6 py-4 whitespace-nowrap text-sm relative">
            //     <button
            //       aria-label="company-menus"
            //       onClick={(e) => toggleMenu(submissionHistory.id, e)}
            //       className="p-2 bg-gray-400 rounded-lg"
            //     >
            //       <DotsIcon />
            //     </button>
            //     {/* Dropdown Menu */}
            //     {openMenuId === submissionHistory.id && (
            //       <div
            //         ref={(el) =>
            //           (menuRefs.current[submissionHistory.id] = el)
            //         }
            //         // className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
            //         className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
            //       >
            //         <ul className="py-1 text-sm text-gray-700">
            //           <li>
            //             <button
            //               // onClick={handleOpenDetailModal.bind(
            //               //   null,
            //               //   submissionHistory.id
            //               // )}
            //               className="w-full text-left px-4 py-2 hover:bg-gray-100"
            //             >
            //               Detail
            //             </button>
            //           </li>
            //           <li>
            //             <button
            //               // onClick={handleOpenEditModal.bind(
            //               //   null,
            //               //   submissionHistory.id
            //               // )}
            //               className="w-full text-left px-4 py-2 hover:bg-gray-100"
            //             >
            //               Edit
            //             </button>
            //           </li>
            //           <li>
            //             <button
            //               // onClick={handleOpenDeleteModal.bind(
            //               //   null,
            //               //   submissionHistory.id
            //               // )}
            //               className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            //             >
            //               Delete
            //             </button>
            //           </li>
            //         </ul>
            //       </div>
            //     )}
            //   </td>
            // </tr>
            <div>
              <div className="flex items-center justify-between p-4 border-b">
                <div className="text-sm font-medium text-gray-900">
                  {getAgentName(submissionHistory.user_id)}
                </div>
                <button
                  aria-label="company-menus"
                  onClick={(e) => toggleMenu(submissionHistory.id, e)}
                  className="p-2 bg-gray-400 rounded-lg"
                >
                  <DotsIcon />
                </button>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-900">
                  {formatDate(submissionHistory.date)}
                </div>
                <div className="text-sm text-gray-900">
                  {submissionHistory.status || "Tidak ada status"}
                </div>
                <div className="text-sm text-gray-900">
                  {submissionHistory.activity}
                </div>
                <div className="text-sm text-gray-900">
                  {submissionHistory.response || "Tidak ada response"}
                </div>
              </div>
              {/* Dropdown Menu */}
              {openMenuId === submissionHistory.id && (
                <div
                  ref={(el) => (menuRefs.current[submissionHistory.id] = el)}
                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                >
                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <button
                        // onClick={handleOpenDetailModal.bind(
                        //   null,
                        //   submissionHistory.id
                        // )}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Detail
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        {/* </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default MHOActivities;
