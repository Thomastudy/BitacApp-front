// AddNewBoat.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBoats } from "../../contexts/BoatContext";
import arrowBack from "../../assets/arrow-back.svg";
import { alertIcon } from "../../utils/alerts";
import { boatTypesFrontend, boatTypesMap } from "../../utils/boatTypes";
import { UseUser } from "../../contexts/UserContext";
import SearchCrewModal from "../../components/modals/SearchCrewModal";

function AddNewBoat() {
  const navigate = useNavigate();
  const { addBoat } = useBoats();
  const { user } = UseUser();

  const [isSearchingCrew, setIsSearchingCrew] = useState(false);
  const [isSearchingOwner, setIsSearchingOwner] = useState(false);

  const [boatData, setBoatData] = useState({
    boatName: "",
    boatType: "",
    owners: [],
    ownersDisplay: [],
    authorizedUsers: [],
    brand: "",
    model: "",
    length: "",
    flag: "",
    photo: "",
    comments: "",
    // Agregamos propiedades para la tripulación
    crewMembers: [],
    crewDisplay: [],
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!boatData.boatName || !boatData.boatType) {
      alertIcon(
        "El nombre del barco y el tipo son obligatorios.",
        "error",
        1200
      );
      return;
    }

    // Convertir a inglés antes de enviar al backend
    const formattedBoatData = {
      ...boatData,
      boatType: boatTypesMap[boatData.boatType],
    };
    try {
      await addBoat(user, formattedBoatData);
      navigate(-1);
    } catch (error) {
      console.error("Error al agregar barco:", error);
    }
  };

  // OWNER SETTINGS

  const handleSelectOwner = (owner) => {
    const isAlreadyOwner = boatData.ownersDisplay.some(
      (owners) => owners.id === owner._id
    );

    if (isAlreadyOwner) {
      alertIcon("Este usuario ya es propietario", "error", 1100);
      setIsSearchingOwner(false);
      return;
    }

    const isAlreadyInCrew = boatData.crewDisplay.some(
      (crewMember) => crewMember._id === owner._id
    );
    if (isAlreadyInCrew) {
      handleRemoveCrewMember(owner._id);
    }

    setBoatData((prev) => ({
      ...prev,
      owners: [...prev.owners, owner._id],
      ownersDisplay: [
        ...prev.ownersDisplay,
        {
          _id: owner._id,
          userName: owner.userName,
        },
      ],
    }));
    setIsSearchingOwner(false);
  };

  const handleRemoveOwner = (_id) => {
    setBoatData((prev) => {
      const newOwnerDisplay = prev.ownersDisplay.filter(
        (owner) => owner._id !== _id
      );
      const newOwners = newOwnerDisplay.map((owner) => owner._id);
      return {
        ...prev,
        ownersDisplay: newOwnerDisplay,
        owners: newOwners,
      };
    });
  };

  // CREW SETTINGS

  const handleSelectCrewMember = (member) => {
    const isAlreadyInCrew = boatData.crewDisplay.some(
      (crewMember) => crewMember._id === member._id
    );

    if (isAlreadyInCrew) {
      alertIcon("Este usuario ya es parte de la tripulación", "error", 1100);
      setIsSearchingCrew(false);
      return;
    }

    const isAlreadyOwner = boatData.ownersDisplay.some(
      (owners) => owners._id === member._id
    );
    if (isAlreadyOwner) {
      handleRemoveOwner(member._id);
    }

    setBoatData((prev) => ({
      ...prev,
      crewMembers: [...prev.crewMembers, member._id],
      crewDisplay: [
        ...prev.crewDisplay,
        {
          _id: member._id,
          userName: member.userName,
          type: "crew",
        },
      ],
    }));
    setIsSearchingCrew(false);
  };

  const handleRemoveCrewMember = (_id) => {
    setBoatData((prev) => {
      const newCrewDisplay = prev.crewDisplay.filter(
        (member) => member._id !== _id
      );
      const newCrewMembers = newCrewDisplay.map((member) => member._id);
      return {
        ...prev,
        crewDisplay: newCrewDisplay,
        crewMembers: newCrewMembers,
      };
    });
  };

  return (
    <div className="add-voyage-container">
      <div className="header-container">
        <button className="back-button" onClick={handleBack}>
          <img src={arrowBack} alt="Back" />
        </button>
        <h1>Nuevo Barco</h1>
      </div>

      <form className="voyage-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del barco</label>
          <div className="boat-input">
            <input
              type="text"
              placeholder="Nombre del Barco..."
              value={boatData.boatName}
              onChange={(e) =>
                setBoatData((prev) => ({ ...prev, boatName: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <select
            value={boatData.boatType}
            onChange={(e) =>
              setBoatData((prev) => ({ ...prev, boatType: e.target.value }))
            }
          >
            <option value="">Selecciona el tipo de barco...</option>
            {boatTypesFrontend.map((boat) => (
              <option key={boat} value={boat}>
                {boat}
              </option>
            ))}
          </select>
        </div>

        {/* Sección de Tripulación (solo miembros, sin invitado) */}
        <div className="crew-container">
          <div className="form-group">
            <label>Propietarios</label>
          </div>
          <div className="crew-container">
            {boatData.ownersDisplay.map((owner, index) => (
              <div key={index} className="crew-member">
                <span>{owner.userName}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOwner(owner._id)}
                  className="remove-crew"
                >
                  ×
                </button>
              </div>
            ))}

            <div className="crew-add-section">
              <button
                type="button"
                className="add-crew"
                onClick={() => setIsSearchingOwner(true)}
              >
                +
              </button>
            </div>
          </div>
          {isSearchingOwner && (
            <SearchCrewModal
              onClose={() => setIsSearchingOwner(false)}
              onSelectCrewMember={handleSelectOwner}
              guestNedded={false}
            />
          )}
        </div>

        <div className="crew-container">
          <div className="form-group">
            <label>Autorizados para registros</label>
          </div>
          <div className="crew-container">
            {boatData.crewDisplay.map((member, index) => (
              <div key={index} className="crew-member">
                <span>{member.userName}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCrewMember(member._id)}
                  className="remove-crew"
                >
                  ×
                </button>
              </div>
            ))}

            <div className="crew-add-section">
              <button
                type="button"
                className="add-crew"
                onClick={() => setIsSearchingCrew(true)}
              >
                +
              </button>
            </div>
          </div>
          {isSearchingCrew && (
            <SearchCrewModal
              onClose={() => setIsSearchingCrew(false)}
              onSelectCrewMember={handleSelectCrewMember}
              guestNedded={false}
            />
          )}
        </div>

        <div className="form-group">
          <label>Marca</label>
          <div className="boat-input">
            <input
              type="text"
              placeholder="Marca..."
              value={boatData.brand}
              onChange={(e) =>
                setBoatData((prev) => ({ ...prev, brand: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Modelo</label>
          <div className="boat-input">
            <input
              type="text"
              placeholder="Modelo..."
              value={boatData.model}
              onChange={(e) =>
                setBoatData((prev) => ({ ...prev, model: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Eslora</label>
          <div className="boat-input">
            <input
              type="text"
              placeholder="Eslora..."
              value={boatData.length}
              onChange={(e) =>
                setBoatData((prev) => ({ ...prev, length: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Bandera</label>
          <div className="boat-input">
            <input
              type="text"
              placeholder="Bandera..."
              value={boatData.flag}
              onChange={(e) =>
                setBoatData((prev) => ({ ...prev, flag: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Comentario</label>
          <textarea
            placeholder="¿Algo para contar...?"
            value={boatData.comments}
            onChange={(e) =>
              setBoatData((prev) => ({ ...prev, comments: e.target.value }))
            }
          />
        </div>

        <button type="submit" className="submit-button">
          Subir
        </button>
      </form>
    </div>
  );
}

export default AddNewBoat;
