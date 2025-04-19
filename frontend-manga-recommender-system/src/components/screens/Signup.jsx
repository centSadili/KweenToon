import React, { useState } from "react";
import axios from 'axios';
import '../styles/Signup.css';
const Signup = () => {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
        "http://127.0.0.1:8000/api/register/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(res.data);
      alert("User created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating user.");
    }
  };
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up Page</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <a href="/">Sign in here!</a></p>
      </div>
    </div>
  );  
};

export default Signup;
