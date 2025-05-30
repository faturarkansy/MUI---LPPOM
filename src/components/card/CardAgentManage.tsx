import { useEffect, useState } from "react";
import axiosClient from "../../axios-client"; // Pastikan path ini benar
import { EyeIcon, PlusIcon } from "../../icons";

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
    <div className="my-6">
      {/* <h2 className="my-3 font-bold">Agent Applicants</h2> */}
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
                <div className="flex text-white">
                  {/* Deactivate button */}
                  <button
                    type="button"
                    className="mr-3 px-2 py-1 flex items-center border bg-black hover:bg-[#c4d0e2] rounded-lg"
                  >
                    {"Deactivate"}
                  </button>
                  {/* View */}
                  <button
                    type="button"
                    className="px-2 py-1 flex items-center border bg-black hover:bg-[#c4d0e2] rounded-lg"
                  >
                    <EyeIcon className="mr-1 w-6 h-6" />
                    {"View"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No agent found.</p>
      )}
      {/* Baris di bawah ini adalah dari kode asli Anda, bisa Anda sesuaikan */}
      {/* <div>CardAgentApplicant</div> */}
    </div>
  );
}

export default CardAgentApplicant;
