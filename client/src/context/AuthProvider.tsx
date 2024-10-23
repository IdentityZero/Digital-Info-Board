import { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import { User, decodeUserJWT } from "../types/UserTypes";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) return;

    const refreshToken = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post<{ access: string }>(
          "http://127.0.0.1:8000/auth/v1/token/refresh/",
          {},
          { withCredentials: true }
        );

        setUser(decodeUserJWT(response.data.access));
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.request.response.includes("expired")) {
            setError("Session expired. Login again.");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    refreshToken();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<{ access: string }>(
        "http://127.0.0.1:8000/auth/v1/token/",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      setUser(decodeUserJWT(response.data.access));
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.response) {
          const msg = JSON.parse(error.request.response);
          setError(
            msg.detail
              ? msg.detail
              : "Unexpected problem occured. Please try again."
          );
        } else {
          setError("Unexpected problem occured. Please try again.");
        }
      } else {
        setError("Unexpected problem occured. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setError(null);
    setUser(null);

    const startLogout = async () => {
      try {
        await axios.post(
          "http://127.0.0.1:8000/auth/v1/token/refresh/delete",
          {},
          { withCredentials: true }
        );
        setError(null);
        setUser(null);
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    startLogout();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {isLoading ? <div>Loading...</div> : <div>{children}</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be within the Auth Provider");

  return context;
};
