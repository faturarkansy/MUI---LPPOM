import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";

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

function CardAgentApplicant() {
  const [agentUsers, setAgentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        const responseFromAxios = await axiosClient.get<ApiResponse>("/users");
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
          setAgentUsers([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch users:", err);
        setError(err.message || "An unknown error occurred");
        setAgentUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div>
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
    </div>
  );
}

export default CardAgentApplicant;
