import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import "./session.css";
import { UseUser } from "../../contexts/UserContext";

import { alertIcon } from "../../utils/alerts";
import Loading from "../../utils/loader/caca";



function LogIn() {
  const { isAuth, login, loading } = UseUser();
  const navigate = useNavigate();

  const [activeField, setActiveField] = useState("userName");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (!result.success) {
      alertIcon(result.error || "Error en el usuario", "error", 1000);
    }
  };

  const viewPass = false;

  useEffect(() => {
    if (isAuth) {
      return navigate("/home");
    }
  }, [isAuth, navigate]);
  if (loading) {
    return Loading;
  }

  return (
    <div className="iniciate-container">
      <div className="container sessions">
        <img src={Logo} alt="Logo BitacorApp" width="150px" />
        <div className="sessions--selection">
          <p>Iniciar sesion con:</p>
          {activeField !== "userName" && (
            <>
              <a
                className="link-sessions pointer"
                onClick={() => setActiveField("userName")}
              >
                Usuario
              </a>
            </>
          )}

          {activeField !== "phone" && (
            <>
              <a
                className="link-sessions pointer"
                onClick={() => setActiveField("phone")}
              >
                Telefono
              </a>
            </>
          )}
          {activeField !== "email" && (
            <>
              <a
                className="link-sessions pointer"
                onClick={() => setActiveField("email")}
              >
                E-Mail
              </a>
            </>
          )}
        </div>
        <form action="" onSubmit={handleSubmit} method="post">
          {activeField === "userName" && (
            <div className="form-div">
              <label className="form--label " htmlFor="userName">
                Usuario{" "}
              </label>
              <input
                className="form--input"
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
          )}
          {activeField === "email" && (
            <div className="form-div">
              <label className="form--label " htmlFor="email">
                E-Mail{" "}
              </label>
              <input
                className="form--input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          )}
          {activeField === "phone" && (
            <div className="form-div">
              <label className="form--label " htmlFor="phone">
                Telefono{" "}
              </label>
              <input
                className="form--input"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          )}
          <br />
          <br />
          <div className="form--div">
            <label className="form--label " htmlFor="password">
              Contraseña{" "}
            </label>
            <input
              className="form--input"
              type={viewPass ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Ingresar</button>
        </form>
        <a className="link-sessions pointer" href="/register">
          Crear usuario
        </a>
      </div>
    </div>
  );
}

export default LogIn;
