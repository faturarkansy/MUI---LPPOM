import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

// Interfaces
interface User {
  id: string;
  role: string;
  name: string;
  email: string;
  password_change_at?: string;
  status?: string;
  tnc_accept_at?: string;
  test_passed_at?: string;
}

interface StateContextType {
  user: User | null;
  token: string | null;
  notification: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setNotification: (notification: string | null) => void;
}

// Storage keys
const STORAGE_KEYS = {
  USER: "USER",
  TOKEN: "ACCESS_TOKEN",
} as const;

// Context creation
const StateContext = createContext<StateContextType>({
  user: null,
  token: null,
  notification: null,
  setUser: () => { },
  setToken: () => { },
  setNotification: () => { },
});

// Provider Props
interface ContextProviderProps {
  children: ReactNode;
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [user, _setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, _setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return storedToken;
  });

  const [notification, _setNotification] = useState<string | null>(null);

  const setToken = (newToken: string | null) => {
    _setToken(newToken);
    if (newToken) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  };

  const setUser = (newUser: User | null) => {
    _setUser(newUser);

    try {
      if (newUser) {
        // Logging semua data yang masuk (opsional untuk debug)
        console.log("Setting user with full object:", newUser);

        // Validasi wajib
        if (!newUser.name) {
          console.warn("User name is missing");
        }
        if (!newUser.email) {
          console.warn("User email is missing");
        }

        // Semua properti, termasuk optional, disimpan
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error("Error saving user to localStorage:", e);
    }
  };

  const setNotification = (message: string | null) => {
    _setNotification(message);
    if (message) {
      setTimeout(() => {
        _setNotification(null);
      }, 5000);
    }
  };

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        notification,
        setNotification,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Hook untuk mengakses context
export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  return context;
};
