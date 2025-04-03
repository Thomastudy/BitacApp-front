import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UseUser } from "../../contexts/UserContext";
import axios from "../../config/axios";
import "./voyageDetail.css";
import arrowBack from "../../assets/arrow-back.svg";
import voyageDefPhoto from "../../assets/voyagePhotos/voyageDefaultPhoto.jpg";
import { alertButton } from "../../utils/alerts";
import { useVoyages } from "../../contexts/VoyageContext";

function VoyageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = UseUser();
  const { deleteVoyage, loadVoyageDetails } = useVoyages();
  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (user?._id && id) {
      dataAccess();
      setLoading(false);
    }
  }, [id, user]);

  const dataAccess = async () => {
    const data = await loadVoyageDetails(id);
    setVoyage(data);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    // Formatear la hora
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    return `${day} ${month} ${year}, ${time}`;
  };

  const handleBack = () => {
    navigate(-1);
  };
  const handleDelete = async (id) => {
    const response = await alertButton(
      "Seguro que quiere eliminar navegada?",
      true,
      true,
      "<p>Si elimina la navegada no podra recuperarla</p>",
      "warning"
    );
    if (response) {
      deleteVoyage(id);
      console.log("excelenteeeeeee ");
    }
  };

  if (loading) {
    return (
      <div className="voyage-detail-container">
        <p>Cargando detalles...</p>
      </div>
    );
  }

  if (!voyage) {
    return (
      <div className="voyage-detail-container">
        <p>No se encontró la navegada</p>
        <button onClick={handleBack} className="back-button">
          Volver
        </button>
      </div>
    );
  }

  const hasCrewMembers = voyage.crewMembers?.length > 0;
  const hasGuestCrew = voyage.guestCrew?.length > 0;

  return (
    <div className="voyage-detail-container">
      <div className="voyage-detail-header">
        <button onClick={handleBack} className="back-button">
          <img src={arrowBack} alt="Back" />
        </button>
        <h1>{voyage.boatId.boatName}</h1>
        {voyage.createdBy._id === user._id ? (
          <span className="created-by">Creado por ti</span>
        ) : (
          <span className="created-by">
            Creado por {voyage.createdBy.userName}
          </span>
        )}
      </div>
      {(!voyage.img && (
        <div className="voyage-detail-photo">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="polaroid"
              style={{ "--random-rotate": `${Math.random() * 6 - 3}deg` }}
            >
              <img src={voyageDefPhoto} alt={`Photo ${index + 1}`} />
              <p>photo {index + 1}</p>
            </div>
          ))}
        </div>
      )) || <div className="voyage-detail-photo"></div>}

      <div className="voyage-detail-content">
        <div className="voyage-detail-section">
          <h2>Detalles de la Navegación</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Fecha de Salida:</span>
              <span className="detail-value">
                {formatDate(voyage.departure)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Fecha de Llegada:</span>
              <span className="detail-value">{formatDate(voyage.arrival)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Modo:</span>
              <span className="detail-value">{voyage.mode}</span>
            </div>
            {voyage.miles && (
              <div className="detail-item">
                <span className="detail-label">Recorrido:</span>
                <span className="detail-value">{voyage.miles} NM</span>
              </div>
            )}
          </div>
        </div>

        {voyage.fact && (
          <div className="voyage-detail-section">
            <h2>Notas</h2>
            <p className="voyage-notes">{voyage.fact}</p>
          </div>
        )}

        <div className="voyage-detail-section">
          <h2>Skipper</h2>
          <div className="crew-list">
            <p className="voyage-notes">{voyage.skipper.userName}</p>
          </div>
        </div>
        {(hasCrewMembers || hasGuestCrew) && (
          <div className="voyage-detail-section">
            <h2>Tripulación</h2>
            <div className="crew-list">
              {hasCrewMembers &&
                voyage.crewMembers.map((member, index) => (
                  <div key={index} className="crew-member">
                    <Link to={`/profile/${member._id}`}>{member.userName}</Link>
                  </div>
                ))}
              {hasGuestCrew &&
                voyage.guestCrew.map((member, index) => (
                  <div key={index} className="crew-guests">
                    + {member}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {voyage.createdBy._id === user._id && (
        <div className="handler-voyages">
          <button
            className="update"
            onClick={() => navigate(`/editvoyage/${id}`)}
          >
            ✏️
          </button>
          <button className="delete" onClick={() => handleDelete(voyage._id)}>
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}

export default VoyageDetail;
