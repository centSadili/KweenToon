import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Header from "../custom/Header";
import TitleHeader from "../custom/TitleHeader";



const Signin = () => {

  const navigate = useNavigate();

  const Gohome= ()=>{
    navigate('/MainHome');
  }

  TitleHeader('Login')


  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(res.data);
      alert("User Login successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating user.");
    }
  };
  return (
    <div className="Signin-Container">
      <div className="div-design">
      <h2>Welcome to KwenToon</h2>
      <hr className="divider" />
      <form onSubmit={handleSubmit}>
      <div className="form-group">
      <label >Username</label>
      <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label> Password</label>
      <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
        
        <button type="submit" onClick={Gohome}>Login</button>
      </form>
      <h6>Don't have an account? <a href="/register-user">Register</a></h6>
      </div>
      
      
    </div>
  );
};

export default Signin;
