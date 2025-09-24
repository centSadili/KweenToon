import React, { useState } from "react";
import axios from 'axios';
import '../styles/Signup.css';
import TitleHeader from "../custom/TitleHeader";
import {useNavigate} from 'react-router-dom';

const Signup = () => {
  TitleHeader('Sign Up');
  
  // Form data state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // General error state
  const [generalError, setGeneralError] = useState("");
  
  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    if (email.length > 254) {
      return "Email address is too long";
    }
    return "";
  };

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
    // Check for invalid characters
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(username)) {
      return "Username can only contain letters, numbers, dots, hyphens, and underscores";
    }
    // Check if username starts with a letter or number
    if (!/^[a-zA-Z0-9]/.test(username)) {
      return "Username must start with a letter or number";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (password.length > 128) {
      return "Password must be less than 128 characters";
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character";
    }
    
    return "";
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change with real-time validation
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
    
    if (name === "email") {
      const emailError = validateEmail(value);
      if (emailError) {
        newErrors.email = emailError;
      } else {
        delete newErrors.email;
      }
    }
    
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
        "http://127.0.0.1:8000/api/register/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if response is successful
      if (res.status === 200 || res.status === 201) {
        setIsSuccess(true);
        alert("User created successfully!");
        
        // Reset form
        setFormData({
          username: "",
          email: "",
          password: "",
        });
        setErrors({});
        
        // Redirect after short delay
        setTimeout(() => {
           navigate("/");
        }, 1500);
      }
      
    } catch (error) {
      console.error(error);
      
      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          // Handle field-specific errors from server
          if (errorData.username) {
            setErrors(prev => ({ ...prev, username: errorData.username[0] || "Username already exists" }));
          }
          if (errorData.email) {
            setErrors(prev => ({ ...prev, email: errorData.email[0] || "Email already exists" }));
          }
          if (errorData.password) {
            setErrors(prev => ({ ...prev, password: errorData.password[0] || "Password does not meet requirements" }));
          }
          
          // If no specific field errors, show general message
          if (!errorData.username && !errorData.email && !errorData.password) {
            setGeneralError(errorData.message || "Invalid input provided");
          }
        } else if (status === 409) {
          setGeneralError("User already exists with this email or username");
        } else if (status === 500) {
          setGeneralError("Server error. Please try again later");
        } else {
          setGeneralError("An unexpected error occurred");
        }
      } else if (error.request) {
        setGeneralError("Network error. Please check your connection and try again");
      } else {
        setGeneralError(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 'none', text: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    
    if (score < 3) return { strength: 'weak', text: 'Weak' };
    if (score < 4) return { strength: 'medium', text: 'Medium' };
    return { strength: 'strong', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up Page</h2>
        
        {/* Success message */}
        {isSuccess && (
          <div className="success-message">
            Account created successfully! Redirecting to login...
          </div>
        )}
        
        {/* General error message */}
        {generalError && (
          <div className="error-message general-error">
            {generalError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              disabled={isLoading}
              required
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          {/* Username Field */}
          <div className="form-group">
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

          {/* Password Field */}
          <div className="form-group">
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
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className={`password-strength ${passwordStrength.strength}`}>
                Password strength: {passwordStrength.text}
              </div>
            )}
            
            {/* Password requirements */}
            {formData.password && errors.password && (
              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li className={formData.password.length >= 8 ? 'valid' : ''}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                    One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                    One lowercase letter
                  </li>
                  <li className={/\d/.test(formData.password) ? 'valid' : ''}>
                    One number
                  </li>
                  <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'valid' : ''}>
                    One special character
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || Object.keys(errors).length > 0}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <p>Already have an account? <a href="/">Sign in here!</a></p>
      </div>
    </div>
  );  
};

export default Signup;