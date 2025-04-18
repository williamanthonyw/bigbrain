import brainImg from './assets/brain.png';
import { Button } from "react-bootstrap";

function Dashboard({ logout }){

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(145deg, #2c2f33, #23272a" }}>
        <img src={brainImg} alt="Brain Logo" className="mb-3" style={{ width: "80px", height: "80px" }} />
        <h1 className="mb-4 text-white">Dashboard</h1>
        <Button variant='danger' onClick={logout} style={{ position: "absolute", top: "20px", right: "20px" }}>Logout</Button>
      </div>
    </>
  );
}

export default Dashboard