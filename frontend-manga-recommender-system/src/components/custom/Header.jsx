import React, { useState, useEffect, useRef } from "react";
import "../styles/Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import MangaSearchBar from "./MangaSearchBAr";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUser, setIsLoggedIn } = useAuth();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isDisabled = location.pathname === "/";

  const goHome = (e) => {
    e.preventDefault();
    navigate("/MainHome");
  };

  const toggleMenu = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigate = (path, e) => {
    if (e) e.preventDefault();
    navigate(path);
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Clear auth context
    setUser(null);
    setIsLoggedIn(false);

    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to login
    navigate("/");
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/manga/search_manga/?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Failed to fetch:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 400); // Delay typing
    return () => clearTimeout(debounce); // Clean up
  }, [query]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.nav-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (title) => {
    setQuery(title);
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-container">
          <a className="nav-logo" href="/MainHome" onClick={goHome}>
            KwenToon
          </a>

          <button 
            className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
            type="button"
            onClick={toggleMobileMenu}
          >
            <span className="toggle-icon"></span>
            <span className="toggle-icon"></span>
            <span className="toggle-icon"></span>
          </button>

          <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`} ref={mobileMenuRef}>
            <ul className="nav-list">
              <li className="nav-item">
                <a 
                  className={`nav-link ${location.pathname === '/MainHome' ? 'active' : ''}`} 
                  href="/MainHome"
                  onClick={(e) => handleNavigate('/MainHome', e)}
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${location.pathname === '/mylist' ? 'active' : ''}`} 
                  href="/mylist"
                  onClick={(e) => handleNavigate('/mylist', e)}
                >
                  MyList
                </a>
              </li>
            </ul>
            
            <div className="search-container-mobile">
              <MangaSearchBar query={query} setQuery={setQuery} />
              {showDropdown && results.length > 0 && (
                <ul className="search-dropdown">
                  {results.map((manga) => (
                    <li
                      key={manga.mal_id}
                      onClick={() => handleSelect(manga.title)}
                      className="search-dropdown-item"
                    >
                      {manga.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="search-container-desktop">
            <MangaSearchBar query={query} setQuery={setQuery} />
            {showDropdown && results.length > 0 && (
              <ul className="search-dropdown">
                {results.map((manga) => (
                  <li
                    key={manga.mal_id}
                    onClick={() => handleSelect(manga.title)}
                    className="search-dropdown-item"
                  >
                    {manga.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="user-menu" ref={dropdownRef}>
            <button 
              className={`user-menu-button ${isDisabled ? "disabled" : ""}`}
              onClick={toggleMenu}
              disabled={isDisabled}
            >
              <span className="material-symbols-outlined">
                menu
              </span>
            </button>

            {isOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => handleNavigate("/home")}
                >
                  <span className="material-symbols-outlined">home</span>
                  <span>Home</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => handleNavigate("/profile")}
                >
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>
                  <span>Profile</span>
                </div>

                <div
                  className="dropdown-item"
                  onClick={() => handleNavigate("/myhistory")}
                >
                  <span className="material-symbols-outlined">
                    history
                  </span>
                  <span>History</span>
                </div>
                
                <div className="dropdown-item" onClick={handleLogout}>
                  <span className="material-symbols-outlined">logout</span>
                  <span>{user === null ? "Login" : "Logout"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;