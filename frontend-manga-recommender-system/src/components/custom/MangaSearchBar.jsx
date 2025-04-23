import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import '../styles/Header.css';

function MangaSearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

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
                setResults(data || []); // Set empty array if no data
                setShowDropdown(true);
            } catch (err) {
                console.error("Failed to fetch:", err);
                setResults([]); // Clear results on error
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchResults, 400); // Delay typing to avoid too many requests
        return () => clearTimeout(debounce); // Clean up on component unmount or query change
    }, [query]);

    const handleSelect = (mangaId) => {
        setQuery(''); // Clear query after selection
        setShowDropdown(false); // Close dropdown
        navigate(`/manga/${mangaId}`); // Navigate to MangaPage with the selected manga's ID
    };

    // Function to truncate the manga title
    const truncateTitle = (title, maxLength) => {
        if (title.length > maxLength) {
            return title.slice(0, maxLength) + '...';
        }
        return title;
    };

    return (
        <div className="search-bar-wrapper relative w-full max-w-md mx-auto">
            <div className="search-bar-container">
                <span className="material-symbols-outlined search-icon">search</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search manga..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // Delay hiding to allow click
                />
            </div>

            {showDropdown && results.length > 0 && (
                <ul className="search-dropdown-list">
                    {results.map((manga) => (
                        <li
                            key={manga.mal_id}
                            onMouseDown={() => handleSelect(manga.mal_id)} // Use manga.mal_id as the identifier
                            className="search-dropdown-item"
                        >
                            <span className="book-icon">📚</span> {/* Book icon */}
                            <span>{truncateTitle(manga.title, 30)}</span> {/* Truncate title to 30 characters */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MangaSearchBar;
