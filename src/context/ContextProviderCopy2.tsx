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

  setUser: (user: any | null) => void;
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
  const [user, _setUser] = useState<any | null>(() => {
    const storedUser = localStorage.getItem("USER");
    console.log("Initial user from localStorage:", storedUser);
    // return storedUser ? JSON.parse(storedUser) : null;
    return storedUser;
  });
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

  const setUser = (user: any | null) => {
    console.log("setUser called with:", user);
    _setUser(user);
    if (user) {
      console.log("Storing user in localStorage");
      localStorage.setItem("USER", user);
    } else {
      console.log("Removing user from localStorage");
      localStorage.removeItem("USER");
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
        console.log("Current token in localStorage:", token);
        console.log("Current user in localStorage:", user);
        // return token;
      },
      getCurrentState: () => {
        console.log({
          token,
          user,
          notification,
        });
      },
      clearToken: () => {
        localStorage.removeItem("ACCESS_TOKEN");
        _setToken(null);
        localStorage.removeItem("USER");
        _setUser(null);
        console.log("Token & User cleared");
      },
    };

    (window as any).authDebug = debugTools;

    console.log("Debug tools available in console as 'authDebug'");
    console.log(
      "Try: authDebug.getToken(), authDebug.getCurrentState(), authDebug.clearToken()"
    );
  }, [user, token, notification]);

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
