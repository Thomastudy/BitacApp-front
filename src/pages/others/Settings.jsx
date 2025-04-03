import { useNavigate } from "react-router-dom";
import { LogOut } from "../../utils/LogOut";
import "./settings.css";
import { UseUser } from "../../contexts/UserContext";

function Settings() {
  const { logOut: logOutContext } = UseUser();

  const navigate = useNavigate();
  const handleLogoutClick = () => {
    logOutContext();
    navigate("/");
  };

  return (
    <>
      <div className="section">
        <h3 onClick={() => handleLogoutClick()}>Cerrar sesion</h3>
      </div>
      <div className="section">
        <a href="#">
          <h3></h3>
        </a>
      </div>
      <div className="section">
        <a href="#">
          <h3></h3>
        </a>
      </div>
    </>
  );
}

export default Settings;
