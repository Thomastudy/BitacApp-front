import { createContext, useContext, useEffect, useState } from "react";
import axios from "../config/axios";
import { alertIcon, alertSimple } from "../utils/alerts";
import { useNavigate } from "react-router-dom";

const VoyageContext = createContext();

const initialVoyageState = [];

const ERROR_MESSAGES = {
  AUTH_ERROR: "Error al autenticar usuario",
  FETCH_ERROR: "Error al obtener los viajes",
  NETWORK_ERROR: "Error de conexión",
};

export const VoyageProvider = ({ children, user }) => {
  const navigate = useNavigate();

  const [voyages, setVoyages] = useState(initialVoyageState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVoyages = async () => {
    if (!user?._id) {
      setError(ERROR_MESSAGES.AUTH_ERROR);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/voyages/${user._id}`);

      if (response.data?.data) {
        setVoyages(response.data.data);
      } else {
        setVoyages([]);
      }
    } catch (error) {
      console.error("Error fetching voyages:", error);
      setError(error.response?.data?.message || ERROR_MESSAGES.FETCH_ERROR);
      alertIcon(ERROR_MESSAGES.FETCH_ERROR, "error");
    } finally {
      setLoading(false);
    }
  };

  const addVoyage = async (user, newVoyageData) => {
    try {
      const response = await axios.post(`/api/voyages/create`, {
        user,
        newVoyageData,
      });

      fetchVoyages();
      if (response.status === 201) {
        alertIcon("Creado exitosamente", "success", 900);
      }
    } catch (error) {
      console.error("Error adding voyage:", error);
      alertIcon("Error al agregar el viaje", "error", 900);
    }
  };

  const loadVoyageDetails = async (voyageId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/voyages/detail/${voyageId}`);

      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error loading voyage details:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateVoyage = async (user, updatedData, voyageId) => {
    try {
      const response = await axios.put(`/api/voyages/${voyageId}`, {
        updatedData,
        user,
      });
      alert(response);

      if (response.data?.data) {
        setVoyages((prevVoyages) =>
          prevVoyages.map((voyage) =>
            voyage._id === voyageId ? response.data.data : voyage
          )
        );
        alertSimple("Viaje actualizado exitosamente", "success");
      }
    } catch (error) {
      alert("Error updating voyage: ", error);
      alertIcon("Error al actualizar el viaje", "error", 900);
    }
  };

  const deleteVoyage = async (voyageId) => {
    try {
      const response = await axios.delete(`/api/voyages/del/${voyageId}`);
      if (response.status === 200) {
        alertIcon("Viaje eliminado exitosamente", "success");
      }
      console.log(response);
    } catch (error) {
      console.error("Error deleting voyage:", error);
      alertIcon("Error al eliminar el viaje", "error");
    }
  };

  const resetVoyageState = () => {
    setVoyages(initialVoyageState);
    setError(null);
    navigate("/");
  };

  const countMiles = () => {
    return voyages.reduce((total, voyage) => {
      return total + (voyage.miles || 0);
    }, 0);
  };

  useEffect(() => {
    fetchVoyages();
  }, [user?._id]); // Re-fetch when user ID changes

  const contextValue = {
    voyages,
    loading,
    error,
    fetchVoyages,
    addVoyage,
    loadVoyageDetails,
    updateVoyage,
    deleteVoyage,
    resetVoyageState,
    countMiles,
  };

  return (
    <VoyageContext.Provider value={contextValue}>
      {children}
    </VoyageContext.Provider>
  );
};

export const useVoyages = () => {
  const context = useContext(VoyageContext);
  if (!context) {
    throw new Error("useVoyages debe ser usado dentro de un VoyageProvider");
  }
  return context;
};

export default VoyageContext;
