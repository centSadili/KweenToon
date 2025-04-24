import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../custom/Header";
import TitleHeader from "../custom/TitleHeader";
import { useAuth } from "../../context/AuthContext";

const Signin = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  TitleHeader("Login");

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
  
      const data = res.data; // ✅ Extract the response data
      console.log("Response data:", data);
      setUser(data.user);
      console.log("User found in localStorage:", data.user);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("User found in localStorage:",localStorage.getItem("user"))
      localStorage.setItem("token", data.token);
      console.log("Token found in localStorage:", data.token);
  
      setResponse(data);
      console.log(data);
      navigate("/MainHome");
      alert("User Login successfully!");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials or server error.");
    }
  };
  return (
    <div className="Signin-Container">
      <div className="div-design">
        <h2>Welcome to KwenToon</h2>
        <hr className="divider" />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
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

          <button type="submit">Login</button>
        </form>
        <h6>
          Don't have an account? <a href="/register-user">Register</a>
        </h6>
      </div>
    </div>
  );
};

export default Signin;
