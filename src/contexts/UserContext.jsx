import { createContext, useContext, useEffect, useState } from "react";
import axios from "../config/axios";
import { alertIcon, alertSimple } from "../utils/alerts";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const initialUserState = {
  userID: "",
  userName: "",
  first_name: "",
  email: "",
  role: "",
};

const ERROR_MESSAGES = {
  AUTH_ERROR: "Error al autenticar usuario",
  LOGOUT_ERROR: "No se pudo cerrar sesión",
  NETWORK_ERROR: "Error de conexión",
};

export function UserProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(initialUserState);
  const [isAuth, setIsAuth] = useState(null);
  const [theError, setTheError] = useState(null);
  const [loading, setLoading] = useState(true);

  const resetUserState = () => {
    setUser(initialUserState);
    setIsAuth(false);
  };

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`/api/sessions/current`);
      const userData = response.data;

      if (userData) {
        setUser(userData.data);
        setIsAuth(true);
      } else {
        resetUserState();
      }
    } catch (error) {
      resetUserState();
      setTheError(
        error.response?.data?.message ||
          ERROR_MESSAGES[error.code] ||
          ERROR_MESSAGES.AUTH_ERROR
      );
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      const response = await axios.post("/api/sessions/logout");

      if (response) {
        resetUserState();
        alertSimple("Sesion cerrada exitosamente");
      }
    } catch (error) {
      alertIcon(ERROR_MESSAGES.LOGOUT_ERROR, "error", 1200);
    } finally {
      checkAuthStatus();
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/sessions/login`, credentials);

      if (response.status === 200) {
        await checkAuthStatus();

        navigate("/home");
        return { success: true };
      }
    } catch (error) {
      let responseError = error.response.data.message;

      setTheError(responseError);
      return { success: false, error: responseError };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/sessions/register", userData);
      if (response.data.status === "Success") {
        await checkAuthStatus();
        navigate("/home");
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || ERROR_MESSAGES.REGISTRATION_ERROR;
      setTheError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (userId) => {
    try {
      const response = await axios.get(`/api/sessions/search/${userId}`);

      if (!response.data) {
        throw new Error("User not found");
      }

      // Asumiendo que la respuesta tiene la misma estructura que checkAuthStatus
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      alertIcon("Error al cargar el usuario", "error", 1200);
      throw error;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuth,
        loading,
        theError,
        checkAuthStatus,
        logOut,
        getUserById,
        login,
        register,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export function UseUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
}
