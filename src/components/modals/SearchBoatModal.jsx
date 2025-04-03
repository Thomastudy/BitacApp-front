import { useState } from "react";
import { useBoats } from "../../contexts/BoatContext";
import { UseUser } from "../../contexts/UserContext";
import { translateBoatType } from "../../utils/boatTypes"; // Función para traducir el tipo de barco

const SearchBoatModal = ({ onSelectBoat, defaultBoatValue = "" }) => {
  const { user } = UseUser();
  const { fetchBoats, boatList } = useBoats();
  const [error, setError] = useState(null);

  const handleFetchOnFocus = async () => {
    if (!boatList) {
      // Solo lo carga si aún no hay barcos
      try {
        await fetchBoats(user._id);
      } catch (err) {
        setError("Error al cargar los barcos");
      }
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <select
      name="boat"
      id="boatSelect"
      className="filter-select"
      onFocus={handleFetchOnFocus}
      onChange={(e) => {
        const selectedBoatId = e.target.value;
        if (selectedBoatId === "default") {
          onSelectBoat(defaultBoatValue);
        } else {
          const selectedBoat = boatList.find(
            (boat) => boat._id === selectedBoatId
          );
          onSelectBoat(selectedBoat);
        }
      }}
    >
      <option value="default">{defaultBoatValue}</option>
      {!boatList || boatList.length === 0 ? (
        <option disabled>No hay barcos disponibles</option>
      ) : (
        boatList.map((boat) => (
          <option key={boat._id} value={boat._id}>
            {boat.boatName} - {translateBoatType(boat.boatType)}
          </option>
        ))
      )}
    </select>
  );
};

export default SearchBoatModal;
