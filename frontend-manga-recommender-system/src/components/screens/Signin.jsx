import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../custom/Header";
import TitleHeader from "../custom/TitleHeader";
import { useAuth } from "../../context/AuthContext";
import '../styles/Signin.css';

const Signin = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useAuth();
  
  // Form data state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  // Validation errors state
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // General error state
  const [generalError, setGeneralError] = useState("");

  TitleHeader("Login");

  // Validation functions
  const validateUsername = (username) => {
    if (!username.trim()) {
      return "Username is required";
    }
    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (username.length > 30) {
      return "Username must be less than 30 characters";
    }
    // Check for invalid characters (optional - adjust based on your requirements)
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(username)) {
      return "Username can only contain letters, numbers, dots, hyphens, and underscores";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation on field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError("");
    }

    // Real-time validation
    const newErrors = { ...errors };
    
    if (name === "username") {
      const usernameError = validateUsername(value);
      if (usernameError) {
        newErrors.username = usernameError;
      } else {
        delete newErrors.username;
      }
    }
    
    if (name === "password") {
      const passwordError = validatePassword(value);
      if (passwordError) {
        newErrors.password = passwordError;
      } else {
        delete newErrors.password;
      }
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setGeneralError("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

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

      const data = res.data;
      console.log("Response data:", data);

      // Validate response data
      if (!data.user || !data.token) {
        throw new Error("Invalid response from server");
      }

      setUser(data.user);
      console.log("User found in localStorage:", data.user);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("User found in localStorage:", localStorage.getItem("user"));
      localStorage.setItem("token", data.token);
      console.log("Token found in localStorage:", data.token);

      console.log(data);
      navigate("/MainHome");
      alert("User Login successfully!");
      
    } catch (error) {
      console.error(error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 401) {
          setGeneralError("Invalid username or password");
        } else if (status === 400) {
          setGeneralError(errorData.message || "Invalid input provided");
        } else if (status === 500) {
          setGeneralError("Server error. Please try again later");
        } else {
          setGeneralError("An unexpected error occurred");
        }
      } else if (error.request) {
        // Network error
        setGeneralError("Network error. Please check your connection and try again");
      } else {
        // Other error
        setGeneralError(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Signin-Container">
      <div className="div-design">
        <h2>Welcome to KwenToon</h2>
        <hr className="divider" />
        
        {/* General error message */}
        {generalError && (
          <div className="error-message general-error">
            {generalError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "error" : ""}
              disabled={isLoading}
              required
            />
            {errors.username && (
              <div className="error-message">{errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              disabled={isLoading}
              required
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <h6>
          Don't have an account? <a href="/register-user">Register</a>
        </h6>
      </div>
    </div>
  );
};

export default Signin;