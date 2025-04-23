import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/custom/Header";

import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import MangaPage from "./components/screens/MangaPage";
import MainHome from "./components/screens/MainHome";
import Profile from "./components/screens/Profile";
import Footer from "./components/custom/Footer";

function App() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timer); 
  }, []);

  
  if (isLoading) {
    return (
      <div className="loading-placeholder">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="register-user" element={<Signup />} />
          <Route path="home" element={<Home />} />
          <Route path="manga/:mal_id" element={<MangaPage />} />
          <Route path="MainHome" element={<MainHome />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
