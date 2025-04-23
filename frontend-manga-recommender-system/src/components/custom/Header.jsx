import React from 'react';
import '../styles/Header.css';
import {useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MangaSearchBar from './MangaSearchBAr';





const Header = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const location = useLocation();

    const isDisabled = location.pathname === '/';


    const Gohome= ()=>{
        navigate('home');
    }

    const toggleMenu = () => {
        if (!isDisabled) {
          setIsOpen(!isOpen);
        }
      };

      const handleNavigate = (path) => {
        navigate(path);
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
                const res = await fetch(`/manga/search_manga/?q=${encodeURIComponent(query)}&limit=5`);
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

    const handleSelect = (title) => {
        setQuery(title);
        setShowDropdown(false);
    };

    

    

    return (
        <div className="header">
            <nav className="nav">
                <div className="nav-container">
                    <a className="nav-logo" href="/MainHome" onClick={Gohome}>KwenToon</a>
                    <button 
                        className="nav-toggle" 
                        type="button"
                        
                    >
                        <span className="toggle-icon"></span>
                    </button>
                    

                    <div className="nav-links">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <a className="nav-link active"  href="MainHome" onClick={Gohome}>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Popular</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link ">Completed</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">MyList</a>
                            </li>
                        </ul>
                    </div>
                    <div >
            <div>
                <MangaSearchBar query={query} setQuery={setQuery} />
            </div>

            {showDropdown && results.length > 0 && (
                <ul className="absolute z-10 bg-white shadow-lg border w-full mt-1 rounded max-h-60 overflow-y-auto">
                    {results.map((manga) => (
                        <li
                            key={manga.mal_id}
                            onMouseDown={() => handleSelect(manga.title)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {manga.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
                                        
                        <div className="burger-menu-container">
                        <span
                            className={`material-symbols-outlined burger-icon ${isDisabled ? 'disabled' : ''}`}
                            onClick={toggleMenu}
                        >
                            menu
                        </span>

                        {isOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => handleNavigate('MainHome')}>
                            <span className="material-symbols-outlined">home</span>
                            <span>Home</span>
                        </div>
                            <div className="dropdown-item" onClick={() => handleNavigate('/profile')}>
                                <span className="material-symbols-outlined">account_circle</span>
                                <span>Check Profile</span>
                            </div>
                            <div className="dropdown-item" onClick={() => handleNavigate('/')}>
                                <span className="material-symbols-outlined">logout</span>
                                <span>Logout</span>
                            </div>
                            </div>
                        )}
                        </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
