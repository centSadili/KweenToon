import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Header.css';

function MangaSearchBar({ query: propQuery, setQuery: propSetQuery }) {
    // Use props if provided, otherwise use local state
    const [localQuery, setLocalQuery] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Determine if we're using props or local state
    const query = propQuery !== undefined ? propQuery : localQuery;
    const setQueryValue = propSetQuery !== undefined ? propSetQuery : setLocalQuery;

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(
                    'http://localhost:8000/api/manga/search_manga/?q=' + encodeURIComponent(query) + '&limit=5'
                );

                const data = await res.json();
                setResults(data || []);
                setShowDropdown(true);
            } catch (err) {
                console.error("Failed to fetch:", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchResults, 400);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSelect = (mangaId) => {
        setQueryValue('');
        setShowDropdown(false);
        navigate(`/manga/${mangaId}`);
    };

    const truncateTitle = (title, maxLength) => {
        if (title.length > maxLength) {
            return title.slice(0, maxLength) + '...';
        }
        return title;
    };

    return (
        <div className="search-bar-wrapper">
            <div className="search-bar-container">
                <span className="material-symbols-outlined search-icon">search</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search manga..."
                    value={query}
                    onChange={(e) => setQueryValue(e.target.value)}
                    onFocus={() => results.length > 0 && setShowDropdown(true)}
                />
            </div>

            {showDropdown && results.length > 0 && (
                <ul className="search-dropdown-list">
                    {results.map((manga) => (
                        <li
                            key={manga.mal_id}
                            onClick={() => handleSelect(manga.mal_id)}
                            className="search-dropdown-item"
                        >
                            <span className="book-icon">📚</span>
                            <span>{truncateTitle(manga.title, 30)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MangaSearchBar;