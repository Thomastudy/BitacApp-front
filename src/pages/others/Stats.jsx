import React, { useEffect, useMemo, useState } from "react";
import { useVoyages } from "../../contexts/VoyageContext";
import { UseUser } from "../../contexts/UserContext";
import "./stats.css";
import { Link } from "react-router-dom";
import SearchBoatModal from "../../components/modals/SearchBoatModal";
import { useBoats } from "../../contexts/BoatContext";

function Stats() {
  const { voyages } = useVoyages();
  const { user } = UseUser();
  const [selectedBoat, setSelectedBoat] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const { fetchBoats, listBoats } = useBoats();

  const handleSelectBoat = (boat) => {
    if (!boat._id) {
      setSelectedBoat("all");
    } else {
      setSelectedBoat(boat._id);
    }
  };

  // obtener lista unica de modos
  const modes = useMemo(() => {
    const uniqueModes = [...new Set(voyages.map((voyage) => voyage.mode))];
    return ["all", ...uniqueModes];
  }, [voyages]);

  // Filtrar viajes por barco seleccionado
  const filteredVoyages = useMemo(() => {
    return voyages.filter((voyage) => {
      const matchBoat =
        selectedBoat === "all" || voyage.boatId === selectedBoat;
      const matchMode = selectedMode === "all" || voyage.mode === selectedMode;
      return matchBoat && matchMode;
    });
  }, [voyages, selectedBoat, selectedMode]);

  const countMiles = () => {
    return filteredVoyages.reduce((total, voyage) => {
      return total + (voyage.miles || 0);
    }, 0);
  };

  // Calcular top 10 tripulantes
  const topCrewMembers = useMemo(() => {
    const crewCount = {};

    filteredVoyages.forEach((voyage) => {
      // Contar tripulación regular con ID y userName
      voyage.crewMembers?.forEach((member) => {
        if (member._id !== user._id) {
          const memberId = member._id;
          if (!crewCount[memberId]) {
            crewCount[memberId] = {
              id: memberId,
              userName: member.userName,
              count: 0,
            };
          }
          crewCount[memberId].count += 1;
        }
      });

      // Para invitados que no tienen ID, los mantenemos separados
      voyage.guestCrew?.forEach((guest) => {
        if (!crewCount[guest]) {
          crewCount[guest] = {
            isGuest: true,
            userName: guest,
            count: 0,
          };
        }
        crewCount[guest].count += 1;
      });
    });
    return Object.values(crewCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredVoyages]);

  const getModeStats = () => {
    // Objeto para almacenar las estadísticas por modo
    const modeStats = voyages.reduce((stats, voyage) => {
      const mode = voyage.mode || "undefined";

      // Si es la primera vez que vemos este modo, inicializamos sus stats
      if (!stats[mode]) {
        stats[mode] = {
          count: 0,
          totalMiles: 0,
          averageMiles: 0,
        };
      }

      // Actualizamos las estadísticas para este modo
      stats[mode].count += 1;
      stats[mode].totalMiles += voyage.miles || 0;
      stats[mode].averageMiles = stats[mode].totalMiles / stats[mode].count;

      return stats;
    }, {});

    return modeStats;
  };

  const renderModeStats = () => {
    const stats = getModeStats();

    if (selectedMode !== "all") {
      const modeData = stats[selectedMode];
      if (!modeData) return null;

      return (
        <div className="mode-stat-card">
          <h3 className="mode-stat-title">Modo: {selectedMode}</h3>
          <div className="mode-stat-content">
            <p>Cantidad de navegadas: {modeData.count}</p>
            <p>Millas totales: {modeData.totalMiles}</p>
            <p>Promedio de millas: {modeData.averageMiles.toFixed(2)}</p>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    fetchBoats(user._id);
  }, [listBoats]);

  return (
    <div className="padding-bottom stats-container">
      <h1 className="stats-title">Estadisticas</h1>

      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="mode-select" className="filter-label">
            Seleccionar Barco:
          </label>
          <SearchBoatModal
            onSelectBoat={handleSelectBoat}
            defaultBoatValue={"Todos los barcos"}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="mode-select" className="filter-label">
            Seleccionar Modo:
          </label>
          <select
            id="mode-select"
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="filter-select"
          >
            {modes.map((mode) => (
              <option key={mode} value={mode}>
                {mode === "all" ? "Todos los modos" : mode}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats generales */}
      <div className="general-stats">
        <p className="stat-text">
          Navegadas:{"   "}
          <span className="stat-value">{filteredVoyages.length}</span>
        </p>
        <p className="stat-text">
          Millas registradas:{" "}
          <span className="stat-value">{countMiles()} nm</span>
        </p>
      </div>

      {/* Stats por modo */}
      <div className="mode-stats-grid">{renderModeStats()}</div>

      {/* Top 10 tripulantes */}
      <div className="top-crew-container">
        <h2 className="section-title">Top 10 Tripulantes</h2>
        <div className="crew-list">
          {topCrewMembers.map((member, index) => (
            <div key={member.id || member.userName} className="crew-item">
              {member.isGuest ? (
                // Si es invitado, solo mostramos el nombre sin link
                <span className="crew-name">
                  {index + 1}. {member.userName} (Invitado)
                </span>
              ) : (
                // Si es tripulante regular, agregamos el link
                <Link to={`/profile/${member.id}`} className="crew-name">
                  <span className="crew-name">
                    {index + 1}. {member.userName}
                  </span>
                </Link>
              )}
              <span className="crew-count">{member.count} navegadas</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Stats;
