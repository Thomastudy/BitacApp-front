import React, { useState } from "react";
import { UseUser } from "../../contexts/UserContext";
import noProfileImg from "../../assets/profile/noProfileImg.png";
import "./header.css";
import { Link } from "react-router-dom";

function Header() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = UseUser();

  const getProfileImg = () => {
    return user.img || noProfileImg;
  };
  // if (loading) {
  //   return <div>Cargando...</div>; // O tu componente de loading
  // }

  return (
    <>
      <header className="header">
        <Link to="/home">
          <h3>Hola, {user.first_name}</h3>
        </Link>
        <Link to="/profile">
          <div className="profile">
            <img src={getProfileImg()} alt="Profile pic" />
          </div>
        </Link>
      </header>
    </>
  );
}

export default Header;
