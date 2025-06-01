import { useEffect, useState, useRef, useCallback } from "react";
import axiosClient from "../../axios-client"; // Pastikan path ini benar
import { DotsIcon } from "../../icons";
import AgentAddModal from "../form/AgentAddModal";
import AgentDetailModal from "../modal/AgentDetailModal";
import AgentEditModal from "../modal/AgentEditModal";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
import { PlusIcon } from "../../icons";

// --- Interface Definitions (sudah benar) ---
interface Role {
  id: number;
  name: string;
  guard_name: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  attr: any;
  parent: User | null;
  region: any | null;
  sub_region: any | null;
  meta: any[];
  roles: Role[];
}

interface ApiResponse {
  code: number;
  status: string;
  data: User[];
}

// Komponen React
function CardAgentApplicant() {
  const [agentUsers, setAgentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  // Tambahkan state baru ini di bagian state declarations
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Tambahkan ref untuk menu dropdown
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // --- toggle menu function ---
  const toggleMenu = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah event propagation
    setOpenMenuId(openMenuId === userId ? null : userId);
  };
  // --- close toggle menu function ---

  // --- Modal Handlers ---
  const handleOpenModal = () => {
    setIsAddModalOpen(true);
  };

  const handleOpenDetailModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsDetailModalOpen(true);
    setOpenMenuId(null);
  };

  const handleOpenEditModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleOpenDeleteModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUserId(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUserId(null);
  };

  function filterUsersByAgentRole(apiResponse: ApiResponse): User[] {
    if (apiResponse && apiResponse.data) {
      return apiResponse.data.filter((user) => {
        return (
          user.roles && user.roles.length > 0 && user.roles[0].name === "agent"
        );
      });
    }
    return [];
  }
  // --- end modal handlers ---

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const responseFromAxios = await axiosClient.get<ApiResponse>("/users");
        const apiData: ApiResponse = responseFromAxios.data;

        if (apiData && apiData.status === "success") {
          const filteredAgents = filterUsersByAgentRole(apiData);
          setAgentUsers(filteredAgents);
        } else {
          setError(
            apiData?.status !== "success"
              ? `API Error: ${apiData?.status}`
              : "Invalid API response format"
          );
          setAgentUsers([]); // Kosongkan data jika ada error dari API
        }
      } catch (err: any) {
        console.error("Failed to fetch users:", err);
        setError(err.message || "An unknown error occurred");
        setAgentUsers([]); // Kosongkan data jika ada error saat fetching
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
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

  const setMenuRef = useCallback(
    (el: HTMLDivElement | null, userId: number) => {
      menuRefs.current[userId] = el;
    },
    []
  );

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div className="my-6">
      <div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="m-3 sm:m-0 p-2 flex items-center border border-[#7EC34B] text-[#7EC34B] rounded-lg"
        >
          <PlusIcon className="mr-1 w-6 h-6" />
          <span>{"Add New"}</span>
        </button>
      </div>
      {agentUsers.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {agentUsers.map((user) => (
            <li
              key={user.id}
              className="p-2 border border-[#333333] rounded-lg"
            >
              <div className="">
                <p className="font-bold">{user.name}</p>
                <p className="font-light">{user.email}</p>
              </div>
              <div className="mt-3 flex justify-between items-center">
                {/* Status */}
                {user.email_verified_at ? (
                  <div className="p-1 flex items-center border text-[#7EC34B] bg-[#F0F9E8] rounded-lg">
                    <span>{"Active"}</span>
                  </div>
                ) : (
                  <div className="p-1 flex items-center border text-[#c34b4b] bg-[#f9e8e8] rounded-lg">
                    <span>{"Non Active"}</span>
                  </div>
                )}
                <div className="flex text-white relative">
                  <button
                    type="button"
                    aria-label="agent-menus"
                    onClick={(e) => toggleMenu(user.id, e)}
                    className={`px-2 py-1 flex items-center border ${
                      openMenuId === user.id ? "bg-[#c4d0e2]" : "bg-black"
                    } hover:bg-[#c4d0e2] rounded-lg`}
                  >
                    <DotsIcon className="mr-1 w-6 h-6" />
                  </button>
                  {/* Dropdown Menu - tambahkan ini */}
                  {openMenuId === user.id && (
                    <div
                      // ref={(el) => (menuRefs.current[user.id] = el)}
                      ref={(el) => setMenuRef(el, user.id)}
                      // className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                      className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                    >
                      <ul className="py-1 text-sm text-gray-700">
                        <li>
                          <button
                            onClick={handleOpenDetailModal.bind(null, user.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Detail Agent
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={handleOpenEditModal.bind(null, user.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Edit Agent
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={handleOpenDeleteModal.bind(null, user.id)}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                          >
                            Delete Agent
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>User data tidak ditemukan.</p>
      )}

      <AgentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        userId={selectedUserId}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
      />
      <AgentEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        userId={selectedUserId}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        // userId={selectedUserId}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
        url={`/users/${selectedUserId}`}
      />

      <AgentAddModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
      />
    </div>
  );
}

export default CardAgentApplicant;
