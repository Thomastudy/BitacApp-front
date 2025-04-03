// Footer.jsx
import React from "react";
import "./footer.css";
import {
  BellIcon,
  HomeIcon,
  SettingsIcon,
  ChartIcon,
} from "../../assets/FooterIcons/footerIcons";
import { Link, useLocation } from "react-router-dom";


const Footer = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <footer className="footer">
      <nav className="nav-container">
        <Link
          to="/home"
          className={`nav-item ${isActive("/home") ? "active" : ""}`}
        >
          <span className="icon">
            <img src={HomeIcon()} alt="" />
          </span>
        </Link>

        <Link
          to="/stats"
          className={`nav-item ${isActive("/stats") ? "active" : ""}`}
        >
          <span className="icon">
            <img src={ChartIcon()} alt="" />
          </span>
        </Link>
        {location.pathname !== "/addvoyage" && location.pathname !== "/addboat" && (
          <Link to="/addvoyage" className="add-button-container">
            <div className="add-button-container">
              <button className="add-button">
                <span className="plus-icon">+</span>
              </button>
            </div>
          </Link>
        )}
        <Link
          to="/notifications"
          className={`nav-item ${isActive("/notifications") ? "active" : ""}`}
        >
          <span className="icon">
            <img src={BellIcon()} alt="" />
          </span>
        </Link>

        <Link
          to="/settings"
          className={`nav-item ${isActive("/settings") ? "active" : ""}`}
        >
          <span className="icon">
            <img src={SettingsIcon()} alt="" />
          </span>
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
