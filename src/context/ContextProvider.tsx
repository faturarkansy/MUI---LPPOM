import {
  createContext,
  useContext,
  useState,
  ReactNode,
  // useEffect,
} from "react";

// Interfaces
interface User {
  id: string;
  role: string;
  name: string; // Properti name ditambahkan
  email: string; // Properti email ditambahkan
  // Tambahkan properti user lainnya jika ada
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

// Context creation dengan initial value
const StateContext = createContext<StateContextType>({
  user: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
});

// Provider Props Interface
interface ContextProviderProps {
  children: ReactNode;
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
  // Initialize states
  const [user, _setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, _setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return storedToken;
  });
  const [notification, _setNotification] = useState<string | null>(null);

  // State setters
  const setToken = (newToken: string | null) => {
    _setToken(newToken);
    // console.log("token: ", newToken);
    if (newToken) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  };

  const setUser = (newUser: User | null) => {
    _setUser(newUser);
    // console.log("user: ", newUser);
    try {
      if (newUser) {
        // Pastikan name dan email ada sebelum menyimpan ke localStorage
        if (!newUser.name) {
          console.warn("User name is missing when setting user");
        }
        if (!newUser.email) {
          console.warn("User email is missing when setting user");
        }

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

// Enhanced useStateContext hook
export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Context accessed with values:", {
  //     hasToken: !!context.token,
  //     hasUser: !!context.user,
  //     hasNotification: !!context.notification,
  //   });
  // }
  return context;
};
