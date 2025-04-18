import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register(props) {
  const success = props.setfunction;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  if (props.token){
    navigate('/dashboard');
  }

  const register = async () => {
    console.log(email, password);

    try{
      const response = await axios.post('http://localhost:5005/admin/auth/register', {
        name: username,
        email: email,
        password: password,
      });
        
      const token = response.data.token;
      success(token);

    }
    catch(err){
      alert(err.response.data.error);
    }

  };

  return (
    <>
      <div>
        <h1>Register</h1>
        Username: <input value={username} onChange={(e) => setUsername(e.target.value)} type="text"></input> <br />
        Email: <input value={email} onChange={(e) => setEmail(e.target.value)} type="text"></input> <br />
        Password: <input value={password} onChange={(e) => setPassword(e.target.value)} type="password"></input> <br />
        <button onClick={register}>Register</button>
      </div>
    </>
  )
}

export default Register
