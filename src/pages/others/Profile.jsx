import "./profile.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import cover from "../../assets/profile/coverPhoto.jpg";
import profile from "../../assets/profile/noProfileImg.png";
import { UseUser } from "../../contexts/UserContext";
import { useVoyages } from "../../contexts/VoyageContext";

const Profile = () => {
  const { userId } = useParams(); // Obtener el ID del usuario de la URL
  const { user: currentUser, getUserById } = UseUser();
  const { voyages } = useVoyages();
  const [profileUser, setProfileUser] = useState(null);
  const [userVoyages, setUserVoyages] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      // Si no hay userId en la URL, mostrar el perfil del usuario actual
      if (!userId) {
        setProfileUser(currentUser);
        setUserVoyages(
          voyages.filter(
            (voyage) =>
              voyage.createdBy._id === currentUser._id ||
              voyage.skipper._id === currentUser._id ||
              voyage.crewMembers.some(
                (member) => member._id === currentUser._id
              )
          )
        );
        return;
      }

      // Cargar datos del usuario específico
      try {
        const userData = await getUserById(userId);
        setProfileUser(userData);

        // Filtrar navegadas relacionadas con este usuario
        const userRelatedVoyages = voyages.filter(
          (voyage) =>
            voyage.createdBy._id === userId ||
            voyage.skipper._id === userId ||
            voyage.crewMembers.some((member) => member._id === userId)
        );
        setUserVoyages(userRelatedVoyages);
      } catch (error) {
        console.error("Error loading user data: ", error);
      }
    };

    loadUserData();
  }, [userId, currentUser, voyages, getUserById]);

  const countUserMiles = () => {
    return userVoyages.reduce(
      (total, voyage) => total + (voyage.miles || 0),
      0
    );
  };

  // Si el perfil está cargando
  if (!profileUser) {
    return <div className="loading">Cargando perfil...</div>;
  }

  const isOwnProfile = !userId || userId === currentUser._id;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="cover-photo">
          <img src={cover} alt="Cover" className="cover-img" />
          {isOwnProfile && (
            <button className="edit-cover-btn" title="Editar foto de portada">
              📷
            </button>
          )}
        </div>

        <div className="profile-main">
          <div className="profile-photo-container">
            <img src={profile} alt="Profile" className="profile-photo" />
            {isOwnProfile && (
              <button
                className="edit-profile-btn"
                title="Editar foto de perfil"
              >
                📷
              </button>
            )}
          </div>

          <div className="profile-info">
            <h1>{profileUser.userName}</h1>
            <h2>{profileUser.fact}</h2>

            <div className="profile-details">
              {profileUser.email && isOwnProfile && (
                <span className="detail-item">✉️ {profileUser.email}</span>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <button className="edit-profile-info-btn">Editar Perfil</button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <p>Registros:</p>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{userVoyages.length}</span>
            <span className="stat-label">Navegadas</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{countUserMiles()}</span>
            <span className="stat-label">Millas</span>
          </div>
        </div>

        <div className="profile-bio">
          <h3>Sobre mí</h3>
          <p>{profileUser.bio}</p>
        </div>

        <div className="profile-actions"></div>
      </div>
    </div>
  );
};

export default Profile;
