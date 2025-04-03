import React, { useState, useEffect } from "react";
import { UseUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { useVoyages } from "../../contexts/VoyageContext";

function Home() {
  const navigate = useNavigate();
  const { voyages, loading } = useVoyages();
  const { user } = UseUser();
  const [displayedVoyages, setDisplayedVoyages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (voyages.length > 0) {
      setDisplayedVoyages(voyages.slice(0, itemsPerPage));
    }
  }, [voyages]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setDisplayedVoyages([
      ...displayedVoyages,
      ...voyages.slice(startIndex, endIndex),
    ]);

    setCurrentPage(nextPage);
  };

  const hasMoreVoyages = displayedVoyages.length < voyages.length;

  // Función para formatear la fecha
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
    return `${day}, ${month}`;
  };

  // voyage detail
  const handleVoyageClick = (voyageId) => {
    navigate(`/voyage/${voyageId}`); // Asumiendo que tienes una ruta para los detalles
  };

  return (
    <div className="home">
      <div className="widget mi-barco">
        {loading ? (
          <p>Cargando navegadas...</p>
        ) : (
          <>
            {displayedVoyages.length > 0 ? (
              <div className="voyages-container">
                {displayedVoyages.map((voyage, index) => (
                  <div
                    key={voyage._id || index}
                    className="voyage-item"
                    onClick={() => handleVoyageClick(voyage._id)}
                  >
                    {voyage.createdBy._id === user._id ? (
                      <span className="created-by">Creado por ti</span>
                    ) : (
                      <span className="created-by">
                        Creado por {voyage.createdBy.userName}
                      </span>
                    )}
                    {/* Renderiza aquí los detalles de cada navegada */}

                    <p>
                      {formatDate(voyage.departure)}, {voyage.boatId.boatName}
                    </p>
                    {/* Agrega más detalles según la estructura de tus datos */}
                    <p>{voyage.mode}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No se han encontrado navegadas.</p>
            )}

            {hasMoreVoyages && (
              <button onClick={loadMore} className="load-more-button">
                Cargar más navegadas
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
