import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface StateContextType {
  currentUser: any;
  token: string | null;
  notification: string | null;

  setUser: (user: any) => void;
  setToken: (token: string | null) => void;
  setNotification: (message: string) => void;
}

const StateContext = createContext<StateContextType>({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
});

interface ContextProviderProps {
  children: ReactNode;
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [token, _setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");
    console.log("Initial token from localStorage:", storedToken);
    return storedToken;
  });
  const [notification, _setNotification] = useState<string | null>(null);

  // Monitor token changes
  useEffect(() => {
    console.log("Token state changed:", token);
  }, [token]);

  // Monitor user changes
  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  const setToken = (token: string | null) => {
    console.log("setToken called with:", token);
    _setToken(token);
    if (token) {
      console.log("Storing token in localStorage");
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      console.log("Removing token from localStorage");
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setNotification = (message: string) => {
    console.log("New notification:", message);
    _setNotification(message);
    setTimeout(() => {
      _setNotification(null);
    }, 5000);
  };

  // Add debug functions to window object
  useEffect(() => {
    const debugTools = {
      getToken: () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        console.log("Current token in localStorage:", token);
        return token;
      },
      getCurrentState: () => {
        console.log({
          token: localStorage.getItem("ACCESS_TOKEN"),
          user,
          notification,
        });
      },
      clearToken: () => {
        localStorage.removeItem("ACCESS_TOKEN");
        _setToken(null);
        console.log("Token cleared");
      },
    };

    (window as any).authDebug = debugTools;

    console.log("Debug tools available in console as 'authDebug'");
    console.log(
      "Try: authDebug.getToken(), authDebug.getCurrentState(), authDebug.clearToken()"
    );
  }, [user, notification]);

  return (
    <StateContext.Provider
      value={{
        currentUser: user,
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
    hasUser: !!context.currentUser,
    hasNotification: !!context.notification,
  });

  return context;
};
