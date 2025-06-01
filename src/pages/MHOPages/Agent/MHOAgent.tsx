import { useEffect, useState, useRef, useCallback } from "react";
import axiosClient from "../../../axios-client";
import { DotsIcon, PlusIcon } from "../../../icons";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import AgentAddModal from "../../../components/form/AgentAddModal";
import AgentDetailModal from "../../../components/modal/AgentDetailModal";
import AgentEditModal from "../../../components/modal/AgentEditModal";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";

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
  password_change_at: string | null;
  test_passed_at: string | null;
  tnc_accept_at: string | null;
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

interface UserData {
  id: number;
  name: string;
  email: string;
  test_passed_at: string | null;
  region: string;
  sub_region: string;
  gender: string;
  phone: string;
  type: string;
}

// Komponen React
function MHOAgent() {
  const [agentUsers, setAgentUsers] = useState<User[]>([]);
  // const [filteredAgents, setFilteredAgents] = useState<User[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  function filterUsersByAgentRole(users: User[]): User[] {
    if (users) {
      return users.filter((user) => {
        return (
          user.roles && user.roles.length > 0 && user.roles[0].name === "agent"
        );
      });
    }
    return [];
  }

  function changeAgentUserDataStructure(users: User[]): UserData[] {
    const usersDataStructureChanged = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        test_passed_at: user.test_passed_at,
        region: user.region.name,
        sub_region: user.sub_region.name,
        gender: user.attr.gender,
        phone: user.attr.phone,
        type: user.attr.type,
      };
    });
    return usersDataStructureChanged;
  }

  // --- end modal handlers ---

  // const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   console.log("Search query changed:", searchQuery);
  // }, [searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const responseFromAxios = await axiosClient.get<ApiResponse>("/users");
        const apiData: User[] = responseFromAxios.data.data;
        const filteredAgents = filterUsersByAgentRole(apiData);
        console.log("Filtered agents:", filteredAgents);
        setAgentUsers(filteredAgents);
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
    const restructuredUser = changeAgentUserDataStructure(agentUsers);
    // Jika searchQuery kosong, tampilkan semua data agent
    if (!searchQuery.trim()) {
      setFilteredAgents(restructuredUser);
      return;
    }
    const query = searchQuery.toLowerCase().trim();
    const searchNestedData = (item: any, query: string): boolean => {
      if (typeof item === "string") {
        return item.toLowerCase().includes(query);
      }
      if (item === null || item === undefined) {
        return false;
      }
      if (Array.isArray(item)) {
        return item.some((element) => searchNestedData(element, query));
      }
      if (typeof item === "object") {
        return Object.values(item).some((value) =>
          searchNestedData(value, query)
        );
      }
      // Untuk tipe data lain (number, boolean), konversi ke string dan periksa
      return String(item).toLowerCase().includes(query);
    };
    // Filter users berdasarkan query
    const filtered = restructuredUser.filter((user) => {
      return searchNestedData(user, query);
    });
    setFilteredAgents(filtered);
    console.log("Filtered agents after search:", filtered);
  }, [searchQuery, agentUsers]);

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
    <div>
      <PageBreadcrumb pageTitle="Agent Management" />
      <div className="py-3 flex justify-end lg:justify-between items-center">
        <div className="hidden lg:block">
          <div className="relative">
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
          </div>
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
      {agentUsers.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {filteredAgents.map((user) => (
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
                {user.test_passed_at ? (
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

export default MHOAgent;
