import { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError, AxiosInstance } from "axios";

import { User, decodeUserJWT } from "../types/UserTypes";
import { isJwtExpired } from "../utils";
import LoadingScreen from "../components/LoadingScreen";
import { BASE_API_URL } from "../constants/urls";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  userApi: AxiosInstance;
  login: (username: string, password: string) => void;
  logout: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const userApi = axios.create({
    baseURL: "http://" + BASE_API_URL,
  });

  userApi.interceptors.request.use(
    async (config) => {
      if (!user) {
        setError("You are no longer authenticated. Login again.");
        throw new Error("You are no longer authenticated. Login again.");
      }
      config.headers.Authorization = `Bearer ${user.token}`;

      if (isJwtExpired(user.token)) {
        config.headers.Authorization = `Bearer ${await refreshToken()}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshToken = async () => {
    setError(null);

    try {
      const response = await axios.post<{ access: string }>(
        "http://" + BASE_API_URL + "/auth/v1/token/refresh/",
        {},
        { withCredentials: true }
      );

      setUser(decodeUserJWT(response.data.access));
      return response.data.access;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.response.includes("expired")) {
          setError("Session expired. Login again.");
          setUser(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<{ access: string }>(
        "http://" + BASE_API_URL + "/auth/v1/token/",
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
          "http://" + BASE_API_URL + "/auth/v1/token/refresh/delete",
          {},
          { withCredentials: true }
        );
        setError(null);
        setUser(null);
      } catch (error) {}
    };

    startLogout();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, userApi, logout }}
    >
      {isLoading ? (
        <div>
          <LoadingScreen>Loading dashboard...</LoadingScreen>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be within the Auth Provider");

  return context;
};
