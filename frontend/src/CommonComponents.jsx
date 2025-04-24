import brainImg from "./assets/brain.png";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const BackgroundWrapper = ({ children }) => {
  return (
    <div
      className="text-white text-center d-flex flex-column align-items-center vh-100"
      style={{
        background: "linear-gradient(145deg, #2c2f33, #23272a)",
      }}
    >
      {children}
    </div>
  );
};

const SiteLogo = () => {
  return (
    <img
      src={brainImg}
      alt="Brain Logo"
      style={{ width: "80px", height: "80px" }}
    />
  );
};

const LogoutButton = ({ onClick }) => {
  return (
    <Button
      variant="danger"
      onClick={onClick}
      style={{ position: "absolute", top: "20px", right: "20px" }}
    >
      Logout
    </Button>
  );
};

const DashboardButton = () => {
  return (
    <Link to="/dashboard">
      <Button
        variant="light"
        style={{ position: "absolute", top: "20px", left: "20px" }}
      >
        {" "}
        ← Dashboard
      </Button>
    </Link>
  );
};

export { BackgroundWrapper, SiteLogo, LogoutButton, DashboardButton };
