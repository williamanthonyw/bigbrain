import { useState } from "react";
import axios from "axios";

function Login(props) {
  const success = props.setfunction;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    console.log(email, password);

    try{
      const response = await axios.post('http://localhost:5005/admin/auth/login', {
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
        <h1>Login</h1>
        Email: <input value={email} onChange={(e) => setEmail(e.target.value)} type="text"></input> <br />
        Password: <input value={password} onChange={(e) => setPassword(e.target.value)} type="password"></input> <br />
        <button onClick={login}>Login</button>
      </div>
    </>
  )
}

export default Login