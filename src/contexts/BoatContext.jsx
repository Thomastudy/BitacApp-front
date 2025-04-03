import { createContext, useCallback, useContext, useState } from "react";
import axios from "../config/axios";
import { alertIcon } from "../utils/alerts";

const BoatContext = createContext();

const BoatProvider = ({ children }) => {
  const [boatList, setBoatList] = useState([]);

  const fetchBoats = useCallback(async (userID, query) => {
    try {
      const response = await axios.get(
        `/api/boats/${userID}?boatname=${query}`
      );

      if (response.status === 200) {
        setBoatList(response.data.data); // Agrega el nuevo barco al estado
      }
    } catch (error) {
      console.error("Error al agregar barco:", error);
      alertIcon("Error al agregar el barco", "error", 1000);
    }
  }, []);

  const addBoat = async (user, boatData) => {
    try {
      console.log("hola mi gente desde boat context");

      const response = await axios.post(
        `/api/boats/create`,
        { user, boatData },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        alertIcon("Barco agregado correctamente", "success", 1000);
        setBoatList((prevBoats) => [...prevBoats, response.data]); // Agrega el nuevo barco al estado
      }
    } catch (error) {
      console.error("Error al agregar barco:", error);
      alertIcon("Error al agregar el barco", "error", 1000);
    }
  };

  const updateBoat = async (boatId, updatedData) => {
    try {
      const response = await axios.put(`/api/boats/${boatId}`, updatedData);
      if (response.status === 200) {
        setBoatList((prevBoats) =>
          prevBoats.map((boat) => (boat.id === boatId ? response.data : boat))
        );
        alertIcon("Barco actualizado correctamente", "success", 1000);
      }
    } catch (error) {
      console.error("Error al actualizar barco:", error);
      alertIcon("Error al actualizar el barco", "error", 1000);
    }
  };

  const deleteBoat = async (boatId) => {
    try {
      await axios.delete(`/api/boats/${boatId}`);
      setBoatList((prevBoats) =>
        prevBoats.filter((boat) => boat.id !== boatId)
      );
      alertIcon("Barco eliminado correctamente", "success", 1000);
    } catch (error) {
      console.error("Error al eliminar barco:", error);
      alertIcon("Error al eliminar el barco", "error", 1000);
    }
  };

  return (
    <BoatContext.Provider
      value={{ boatList, fetchBoats, addBoat, updateBoat, deleteBoat }}
    >
      {children}
    </BoatContext.Provider>
  );
};

const useBoats = () => {
  const context = useContext(BoatContext);
  if (!context) {
    throw new Error("useBoats debe ser usado dentro de un BoatProvider");
  }
  return context;
};

export { BoatProvider, useBoats };
