import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import MangaPage from "./components/screens/MangaPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="register-user" element={<Signup />} />
          <Route path="home" element={<Home />} />
          <Route path="manga/:mal_id" element={<MangaPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
