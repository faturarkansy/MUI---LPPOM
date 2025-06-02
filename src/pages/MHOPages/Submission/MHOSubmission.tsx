import { useEffect, useState, useRef, useCallback } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import axiosClient from "../../../axios-client";
import { PlusIcon, ChevronDownIcon } from "../../../icons";
import SubmissionAddModal from "../../../components/modal/SubmissionAddModal";
import SubmissionDetailModal from "../../../components/modal/SubmissionDetailModal";
import SubmissionEditModal from "../../../components/modal/SubmissionEditModal";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";

export default function MHOSubmission() {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<any>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    number | null
  >(null);

  //   const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Tambahkan ref untuk menu dropdown
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // --- toggle menu function ---
  const toggleMenu = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah event propagation
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axiosClient.get("/ext/submissions");
        setSubmissions(response.data.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchSubmissions();
  }, [refreshTrigger]);

  const handleOpenModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (submissionId: number) => {
    setSelectedSubmissionId(submissionId);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSubmissionId(null);
  };

  const handleOpenDetailModal = (submissionId: number) => {
    setSelectedSubmissionId(submissionId);
    setIsDetailModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSubmissionId(null);
  };

  const handleOpenDeleteModal = (submissionId: number) => {
    setSelectedSubmissionId(submissionId);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSubmissionId(null);
  };

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

  const setMenuRef = useCallback(
    (el: HTMLDivElement | null, userId: number) => {
      menuRefs.current[userId] = el;
    },
    []
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Submission" />
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
      <div className="">
        {submissions.map((submission: any) => (
          <div key={submission.id} className="border rounded-lg">
            <div className="flex justify-between items-center border-b">
              <div className="p-3 flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                <div className="ml-3">
                  <p className="font-bold">
                    {submission.company?.name ? submission.company.name : "-"}
                  </p>
                  <p className="text-xs text-gray-600">{submission.date}</p>
                </div>
              </div>
              <div className="p-3 relative">
                <button
                  aria-label="more_submission_data"
                  onClick={(e) => toggleMenu(submission.id, e)}
                  className={`p-2 bg-gray-400 rounded-lg ${
                    openMenuId === submission.id ? "rotate-90" : null
                  }`}
                >
                  <ChevronDownIcon />
                </button>
                {/* Dropdown Menu */}
                {openMenuId === submission.id && (
                  <div
                    // ref={(el) => (menuRefs.current[submission.id] = el)}
                    ref={(el) => setMenuRef(el, submission.id)}
                    // className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                    className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                  >
                    <ul className="py-1 text-sm text-gray-700">
                      <li>
                        <button
                          onClick={handleOpenDetailModal.bind(
                            null,
                            submission.id
                          )}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Detail
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={handleOpenEditModal.bind(
                            null,
                            submission.id
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
                            submission.id
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
            </div>
            <div className="p-3 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-600">Certification Target</p>
                <p className="text-sm font-bold">
                  {submission.due ? submission.due : "-"}
                </p>
              </div>
              <p className="ml-2 p-2 text-xs bg-gray-400 text-white rounded-lg">
                Submitted
              </p>
            </div>
          </div>
        ))}
      </div>

      <SubmissionAddModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
      />

      <SubmissionDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        submissionId={selectedSubmissionId}
      />

      <SubmissionEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
        submissionId={selectedSubmissionId}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
        url={`/ext/submissions/${selectedSubmissionId}`}
      />
    </div>
  );
}
