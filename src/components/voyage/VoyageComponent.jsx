// VoyageComponent.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./VoyageComponent.css";
import arrowBack from "../../assets/arrow-back.svg";
import { UseUser } from "../../contexts/UserContext";
import { alertIcon } from "../../utils/alerts";
import SearchCrewModal from "../modals/SearchCrewModal";
import SearchBoatModal from "../modals/SearchBoatModal";
import { useBoats } from "../../contexts/BoatContext";

const KM_TO_NM = 0.539957;

const defaultTripData = {
  boatName: "",
  boatId: "",
  mode: "Paseo",
  skipperID: "",
  crewMembers: [],
  guestCrew: [],
  crewDisplay: [],
  departureDate: "",
  departureTime: "",
  arrivalDate: "",
  arrivalTime: "",
  miles: "",
  comments: "",
  distance: "",
  distanceUnit: "NM",
};

const VoyageComponent = ({ action, handleData, preloadTripData }) => {
  const navigate = useNavigate();
  const { user } = UseUser();
  const { fetchBoats, listBoats } = useBoats();

  const [tripData, setTripData] = useState({
    ...defaultTripData,
    ...preloadTripData,
  });

  // Añadido: Estado para controlar la visibilidad del menú de opciones
  // const [showOptions, setShowOptions] = useState(false);

  const [isSearchingCrew, setIsSearchingCrew] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  // Funcion para seleccionar barco desde el modal
  const handleSelectBoat = (boat) => {
    setTripData((prev) => ({
      ...prev,
      boatName: boat.boatName,
      boatId: boat._id,
    }));
  };

  const addNewBoat = () => {
    navigate("/addboat");
  };

  const handleSelectCrewMember = (member) => {
    const isAlreadyInCrew = tripData.crewDisplay.some(
      (crewMember) => crewMember._id === member._id
    );

    if (isAlreadyInCrew) {
      alertIcon("Este usuario ya es parte de la tripulación", "error", 1100);
      setIsSearchingCrew(false);
      return;
    }

    setTripData((prev) => ({
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

  const handleSelectGuestCrew = (guestName) => {
    const isAlreadyInCrew = tripData.crewDisplay.some(
      (member) => member.userName === guestName
    );

    if (isAlreadyInCrew) {
      alertIcon("Este usuario ya es parte de la tripulación", "error", 1100);
      setIsSearchingCrew(false);
      return;
    }

    setTripData((prev) => ({
      ...prev,
      guestCrew: [...prev.guestCrew, guestName],
      crewDisplay: [
        ...prev.crewDisplay,
        {
          userName: guestName,
          type: "guest",
        },
      ],
    }));
    setIsSearchingCrew(false);
  };

  const handleRemoveCrewMember = (index) => {
    setTripData((prev) => {
      const newCrewDisplay = [...prev.crewDisplay];
      const removedMember = newCrewDisplay[index];
      newCrewDisplay.splice(index, 1);

      let newCrewMembers = [...prev.crewMembers];
      let newGuestCrew = [...prev.guestCrew];

      if (removedMember.type === "crew") {
        newCrewMembers = newCrewMembers.filter(
          (id) => id !== removedMember._id
        );
      } else {
        newGuestCrew = newGuestCrew.filter(
          (guest) => guest.userName !== removedMember.userName
        );
      }

      return {
        ...prev,
        crewMembers: newCrewMembers,
        guestCrew: newGuestCrew,
        crewDisplay: newCrewDisplay,
      };
    });
  };
  // const handleRemoveGuestCrew = (index) => {
  //   setTripData((prev) => {
  //     const newCrewDisplay = [...prev.crewDisplay];
  //     const removedGuest = newCrewDisplay[index];
  //     newCrewDisplay.splice(index, 1);

  //     // Filtrar el guest removido del array guestCrew
  //     const newGuestCrew = prev.guestCrew.filter(
  //       (guest) => guest !== removedGuest.userName
  //     );

  //     return {
  //       ...prev,
  //       guestCrew: newGuestCrew,
  //       crewDisplay: newCrewDisplay,
  //     };
  //   });
  // };

  // otro

  /////////////
  //   DEPARTURE / ARRIVAL
  /////////////
  // Función que combina la fecha y la hora para crear un objeto Date
  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    return new Date(`${dateStr}T${timeStr}:00`);
  };

  /** Formatear distancia  */

  const handleDistanceChange = (value, unit) => {
    if (!value) {
      console.error("Falta el valor de distancia");
    }

    const numericValue = parseFloat(value);
    const nauticalMiles =
      unit === "KM" ? numericValue * KM_TO_NM : numericValue;
    setTripData((prev) => ({
      ...prev,
      miles: nauticalMiles,
      distanceInput: value,
      distanceUnit: unit,
    }));
  };
  const getDisplayDistance = () => {
    if (!tripData.miles) return "";

    const miles = parseFloat(tripData.miles);
    return tripData.distanceUnit === "KM" ? miles / KM_TO_NM : miles;
  };

  /////////////
  //   Photo
  /////////////
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setTripData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  ///////////////
  //   Submit
  ///////////////

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      // Crear el objeto de datos para enviar

      const submitData = {
        skipperID: user.userID,
        boatId: tripData.boatId,
        mode: tripData.mode,
        crewMembers: tripData.crewMembers,
        guestCrew: tripData.guestCrew,
        departure: combineDateTime(
          tripData.departureDate,
          tripData.departureTime
        ),
        arrival: combineDateTime(tripData.arrivalDate, tripData.arrivalTime),
        miles: parseFloat(tripData.miles),
        fact: tripData.comments || "S/N.",
      };

      await handleData(user, submitData);
      setTimeout(() => {
        handleBack();
      }, 500);
    } catch (error) {
      console.error("Error al crear el viaje:", error);
    }
  };

  useEffect(() => {
    if (user?._id && user?.userName) {
      setTripData((prev) => {
        // Si ya hay miembros en crewDisplay, no lo sobrescribas
        if (prev.crewDisplay && prev.crewDisplay.length > 0) {
          return prev;
        }
        return {
          ...prev,
          crewMembers: [user._id],
          crewDisplay: [
            {
              _id: user._id,
              userName: user.userName,
              isCurrentUser: true,
            },
          ],
        };
      });
    }
  }, [user]);

  useEffect(() => {
    fetchBoats(user._id);
  }, [listBoats]);

  // useEffect(() => {
  //   console.log(tripData);
  // }, [tripData]);

  return (
    <div className="add-voyage-container">
      <div className="header-container">
        <button className="back-button" onClick={handleBack}>
          <img src={arrowBack} alt="Back" />
        </button>
        <h1> {action === "add" ? `Nueva` : "Editando"} navegada</h1>
      </div>

      <form className="voyage-form" onSubmit={handleSubmit}>
        {/* SECCIÓN DE BARCOS */}
        <div className="form-group">
          <label>Barco</label>
          <div className="boat-select">
            <SearchBoatModal
              onSelectBoat={handleSelectBoat}
              defaultBoatValue={tripData.boatName || "Seleccionar barco..."}
            />

            {/* si no hay barco lo agrega */}
            <button type="button" onClick={() => addNewBoat()}>
              +
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Modo</label>
          <select
            value={tripData.mode}
            onChange={(e) =>
              setTripData((prev) => ({ ...prev, mode: e.target.value }))
            }
          >
            <option value="Comercial">Comercial</option>
            <option value="Entrenamiento">Entrenamiento</option>
            <option value="Escuela">Escuela</option>
            <option value="Paseo">Paseo</option>
            <option value="Regata">Regata</option>
            <option value="Otro">Otro</option>
            {/* Más opciones de modo */}
          </select>
        </div>

        <div className="crew-container">
          <div className="crew-container">
            {tripData.crewDisplay.map((member, index) => (
              <div key={member._id} className="crew-member">
                <span>
                  {member.type === "guest"
                    ? `+ ${member.userName}`
                    : member.userName}
                </span>
                {member._id !== user._id && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCrewMember(index)}
                    className="remove-crew"
                  >
                    ×
                  </button>
                )}
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
          {/* // Update the SearchCrewModal implementation */}
          {isSearchingCrew && (
            <SearchCrewModal
              onClose={() => setIsSearchingCrew(false)}
              onSelectCrewMember={handleSelectCrewMember}
              onSelectGuestCrew={handleSelectGuestCrew}
            />
          )}
        </div>

        <div className="form-group">
          <label>Salida</label>
          <div className="datetime-inputs">
            <input
              type="date"
              value={tripData.departureDate}
              onChange={(e) =>
                setTripData((prev) => ({
                  ...prev,
                  departureDate: e.target.value,
                }))
              }
            />
            <input
              type="time"
              value={tripData.departureTime}
              onChange={(e) =>
                setTripData((prev) => ({
                  ...prev,
                  departureTime: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Llegada</label>
          <div className="datetime-inputs">
            <input
              type="date"
              value={tripData.arrivalDate}
              onChange={(e) =>
                setTripData((prev) => ({
                  ...prev,
                  arrivalDate: e.target.value,
                }))
              }
            />
            <input
              type="time"
              value={tripData.arrivalTime}
              onChange={(e) =>
                setTripData((prev) => ({
                  ...prev,
                  arrivalTime: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Recorrido</label>
          <div className="distance-input">
            <input
              type="number"
              value={getDisplayDistance()}
              onChange={(e) =>
                handleDistanceChange(e.target.value, tripData.distanceUnit)
              }
              placeholder="Distancia..."
            />
            <select
              value={tripData.distanceUnit}
              onChange={(e) =>
                handleDistanceChange(tripData.distance, e.target.value)
              }
            >
              <option value="NM">NM</option>
              <option value="KM">KM</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Comentario</label>
          <textarea
            placeholder="¿Algo para contar...?"
            value={tripData.comments}
            onChange={(e) =>
              setTripData((prev) => ({ ...prev, comments: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label>Fotos</label>
          <div className="photo-upload">
            <label htmlFor="photo-input" className="upload-button">
              <span>&#8593;</span>
              Subir fotos
            </label>
            <input
              id="photo-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              hidden
            />
          </div>
        </div>

        <button type="" className="submit-button">
          Subir
        </button>
      </form>
    </div>
  );
};

export default VoyageComponent;
