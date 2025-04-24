import brainImg from "./assets/brain.png";

const BackgroundWrapper = ({ children }) => {
  return (
    <div
      className="d-flex flex-column align-items-center vh-100"
      style={{ background: "linear-gradient(145deg, #2c2f33, #23272a)" }}
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

export { BackgroundWrapper, SiteLogo };