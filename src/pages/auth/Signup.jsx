import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import Logo from "../../assets/logo.png";
import "./session.css";
import { UseUser } from "../../contexts/UserContext";

const Signup = () => {
  const initialFormState = {
    first_name: "",
    last_name: "",
    userName: "",
    email: "",
    phone: "",
    birth: "",
    fact: "",
    password: "",
    password2: "",
  };

  const { isAuth, register } = UseUser();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name) newErrors.first_name = "El nombre es requerido";
    if (!formData.last_name) newErrors.last_name = "El apellido es requerido";
    if (!formData.userName) newErrors.userName = "El usuario es requerido";
    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.phone) newErrors.phone = "El teléfono es requerido";
    if (!formData.birth)
      newErrors.birth = "La fecha de nacimiento es requerida";
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (formData.password !== formData.password2) {
      newErrors.password2 = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await register(formData);
    if (!result.success) {
      // Manejar error si es necesario
    }
  };

  const renderFormField = (name, label, type = "text") => (
    <div className="form--div">
      <label className="form--label" htmlFor={name}>
        {label}
      </label>
      <input
        className={`form--input ${errors[name] ? "form-input--error" : ""}`}
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        disabled={isLoading}
      />
      {errors[name] && <span className="error-message">{errors[name]}</span>}
    </div>
  );

  useEffect(() => {
    if (isAuth === true) {
      return navigate("/home");
    }
  }, [isAuth, navigate]);

  return (
    <div className="iniciate-container">
      <div className=" container sessions">
        <div className="sessions__header">
          <img src={Logo} alt="Logo BitacorApp" width="150px" />
          <h1>BitacorApp</h1>
        </div>

        <form onSubmit={handleSubmit} className="signup-form" method="post">
          {renderFormField("first_name", "Nombre")}
          {renderFormField("last_name", "Apellido")}
          {renderFormField("userName", "Usuario")}
          {renderFormField("email", "Email", "email")}
          {renderFormField("phone", "Teléfono", "tel")}
          {renderFormField("birth", "Fecha de nacimiento", "date")}
          {renderFormField("fact", "Dato importante")}
          {renderFormField("password", "Contraseña", "password")}
          {renderFormField("password2", "Repita su Contraseña", "password")}

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}
          <button
            type="submit"
            className={` ${isLoading ? "submit-button--loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Creando..." : "Crear usuario"}
          </button>
        </form>

        <a className="link-sessions" href="/login">
          Iniciar con usuario existente
        </a>
        <br />
        <br />
      </div>
    </div>
  );
};

export default Signup;
