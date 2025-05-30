import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { PlusIcon } from "../../icons";
import AddUserModal from "../form/AgentAddModal";

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

interface Meta {
  gender: string;
  phone: string;
  type: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  parent_id: string;
  region_id: string;
  sub_region_id: string;
  meta: Meta[];
}

interface ApiResponse {
  code: number;
  status: string;
  data: User[];
}

// Komponen React
function CardAgentApplicant() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentUsers, setAgentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    console.log("Modal Opened: ", isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    console.log("Modal Opened: ", isModalOpen);
  };

  const handleFormSubmit = (formData: UserFormData) => {
    console.log("Form Data yang Diterima dari Modal: ", formData);
  };

  // Fungsi filter bisa tetap di dalam atau dipindahkan ke luar jika reusable
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        // axiosClient.get diharapkan mengembalikan struktur AxiosResponse
        // di mana data sebenarnya ada di properti `data` dari response axios
        const responseFromAxios = await axiosClient.get<ApiResponse>("/users");

        // responseFromAxios.data adalah objek ApiResponse Anda
        const apiData: ApiResponse = responseFromAxios.data;

        if (apiData && apiData.status === "success") {
          const filteredAgents = filterUsersByAgentRole(apiData);
          setAgentUsers(filteredAgents);
        } else {
          // Jika status dari API bukan "success" atau format tidak sesuai
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
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat komponen mount

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div>
      {/* <h2 className="my-3 font-bold">Agent Applicants</h2> */}
      <div className="my-3 flex justify-end items-center">
        <button
          type="button"
          onClick={handleOpenModal}
          className="p-2 flex items-center border border-[#7EC34B] text-[#7EC34B] rounded-lg"
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
              className="p-3 flex justify-between items-center border border-[#333333] rounded-lg"
            >
              <div className="">
                <p className="font-bold">{user.name}</p>
                <p className="">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No agent found.</p>
      )}

      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        // Anda juga bisa memberikan nilai awal untuk field hidden jika perlu:
        initialParentId="4"
        initialRegionId="1"
        initialSubRegionId="1"
      />
    </div>
  );
}

export default CardAgentApplicant;
