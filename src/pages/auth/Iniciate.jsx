import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import "./session.css";
import { useNavigate } from "react-router-dom";

function Iniciate() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer); // Limpia el temporizador cuando el componente se desmonte
  }, []);

  if (loading) {
    return (
      <div className="iniciate-container">
        <div className="container sessions">
          <img className="loading--logo" src={Logo} alt="Logo BitacorApp" />
        </div>
      </div>
    );
  }

  return (
    <div className="iniciate-container">
      <div className="iniciate-content">
        <div className="logo-wrapper">
          <img src={Logo} alt="Logo BitacorApp" className="main-logo" />
        </div>

        <div className="welcome-text">
          <h1>Bienvenido a BitacorApp</h1>
          <p>Tu bitácora online personal</p>
        </div>

        <div className="actions-container">
          <button className="primary-button" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </button>

          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">o</span>
            <span className="divider-line"></span>
          </div>

          <a href="/register" className="register-link">
            Crear una cuenta nueva
          </a>
        </div>
      </div>
    </div>
  );
}

export default Iniciate;
