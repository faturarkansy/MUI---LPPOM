import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Interfaces
interface User {
  id: string | null;
  role: string | null;
}

interface StateContextType {
  user: User | null;
  token: string | null;
  notification: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setNotification: (notification: string | null) => void;
}

// Storage keys sebagai constants
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

// Helper functions untuk localStorage
// const getStorageItem = <T>(key: string): T | null => {
//   try {
//     const item = localStorage.getItem(key);
//     return item ? JSON.parse(item) : null;
//   } catch (e) {
//     console.error(`Error reading ${key} from localStorage:`, e);
//     return null;
//   }
// };

// const setStorageItem = <T>(key: string, value: T | null): void => {
//   try {
//     if (value) {
//       localStorage.setItem(key, JSON.stringify(value));
//     } else {
//       localStorage.removeItem(key);
//     }
//   } catch (e) {
//     console.error(`Error writing ${key} to localStorage:`, e);
//   }
// };

interface ContextProviderProps {
  children: ReactNode;
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
  // Initialize states
  const [user, _setUser] = useState<any | null>(() => {
    const storedUser = localStorage.getItem("USER");
    // return storedUser ? JSON.parse(storedUser) : null;
    return storedUser;
  });
  const [token, _setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");
    return storedToken;
  });
  const [notification, _setNotification] = useState<string | null>(null);

  // Initialize states with proper typing
  // const [user, _setUser] = useState<User | null>(() =>
  //   getStorageItem<User>(STORAGE_KEYS.USER)
  // );

  // const [token, _setToken] = useState<string | null>(() =>
  //   localStorage.getItem(STORAGE_KEYS.TOKEN)
  // );

  // const [notification, _setNotification] = useState<string | null>(null);

  // State setters
  const setToken = (token: string | null) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setUser = (user: any | null) => {
    _setUser(user);
    if (user) {
      localStorage.setItem("USER", user);
    } else {
      localStorage.removeItem("USER");
    }
  };

  const setNotification = (notification: string | null) => {
    _setNotification(notification);
    setTimeout(() => {
      _setNotification(null);
    }, 5000);
  };

  // Debug tools
  useEffect(() => {
    const debugTools = {
      get: () => {
        console.log("Current token in localStorage:", token);
        console.log("Current user in localStorage:", user);
        console.log("Current company submission in localStorage:", companySub);
      },
      getCurrentState: () => {
        console.log({
          token,
          user,
          notification,
          companySub,
        });
      },
      clear: () => {
        localStorage.removeItem("ACCESS_TOKEN");
        _setToken(null);
        localStorage.removeItem("USER");
        _setUser(null);
        localStorage.removeItem("COMPANY_SUB");
        _setCompanySub(null);
        console.log("Token, User & Company Submission cleared");
      },
    };

    (window as any).authDebug = debugTools;

    console.log("Debug tools available in console as 'authDebug'");
    console.log(
      "Try: authDebug.get(), authDebug.getCurrentState(), authDebug.clear()"
    );
  }, [user, token, notification]);

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

// Enhanced useStateContext hook with logging
export const useStateContext = () => {
  const context = useContext(StateContext);

  // Log whenever the context is accessed
  console.log("Context accessed with values:", {
    hasToken: !!context.token,
    hasUser: !!context.user,
    hasNotification: !!context.notification,
  });

  return context;
};
