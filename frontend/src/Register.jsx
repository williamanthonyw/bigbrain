import { useState } from "react";
import axios from "axios";


function Register() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const register = async () => {
    console.log(email, password);

    try{
      const response = await axios.post('http://localhost:5005/admin/auth/register', {
        name: username,
        email: email,
        password: password,
      });
        
      const token = response.data.token;
      console.log(token);
    }
    catch(err){
      console.log(err.response.data.error);
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
