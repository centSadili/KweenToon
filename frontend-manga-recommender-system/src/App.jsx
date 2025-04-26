import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/custom/Header";
import Footer from "./components/custom/Footer";

import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import MangaPage from "./components/screens/MangaPage";
import MainHome from "./components/screens/MainHome";
import Profile from "./components/screens/Profile";
import MyHistory from "./components/screens/MyHistory";
import MyFavorites from "./components/screens/MyFavorites";

import { AuthProvider, useAuth } from "../src/context/AuthContext";

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-placeholder">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="register-user" element={<Signup />} />
        <Route path="home" element={<Home />} />
        <Route path="manga/:mal_id" element={<MangaPage />} />
        <Route path="MainHome" element={<MainHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="myhistory" element={<MyHistory />} />
        <Route path="myfavorites" element={<MyFavorites />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <AppContent />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
