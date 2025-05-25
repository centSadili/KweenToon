import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/MainHome.css";
import TitleHeader from "../custom/TitleHeader";

const mainGenreMap = {
  "Action": 1,
  "Adventure": 2,
  "Avant Garde": 5,
  "Award Winning": 46,
  "Boys Love": 28,
  "Comedy": 4,
  "Drama": 8,
  "Fantasy": 10,
  "Girls Love": 26,
  "Gourmet": 47,
  "Horror": 14,
  "Mystery": 7,
  "Romance": 22,
  "Sci-Fi": 24,
  "Slice of Life": 36,
  "Sports": 30,
  "Supernatural": 37,
  "Suspense": 41,
};

const explicitGenreMap = {
  "Ecchi": 9,
  "Erotica": 49,
  "Hentai": 12,
};

const MainHome = () => {
  TitleHeader('Home');
  const [topManga, setTopManga] = useState([]);
  const [topPage, setTopPage] = useState(1);
  const [isTopLoading, setIsTopLoading] = useState(false);

  const [manga, setManga] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [genreMenuOpen, setGenreMenuOpen] = useState(false);

  // Track window width for responsive features
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setGenreMenuOpen(true);
      } else {
        setGenreMenuOpen(false);
      }
    };
    
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchManga = async (currentPage, genreId = null) => {
    try {
      setIsLoading(true);
      let url = genreId
        ? `https://api.jikan.moe/v4/manga?genres=${genreId}&page=${currentPage}`
        : `https://api.jikan.moe/v4/manga?page=${currentPage}`;

      const response = await axios.get(url);
      const mangaData = response.data.data;

      if (currentPage === 1) {
        setManga(mangaData);
      } else {
        setManga((prev) => [...prev, ...mangaData]);
      }
    } catch (error) {
      console.error("Error fetching manga:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopManga = async (currentPage) => {
    try {
      setIsTopLoading(true);
      const response = await axios.get(
        `https://api.jikan.moe/v4/top/manga?sfw&page=${currentPage}`
      );
      const newManga = response.data.data.slice(0, 10);

      setTopManga((prev) => {
        const existingIds = new Set(prev.map((manga) => manga.mal_id));
        const filteredNew = newManga.filter(
          (manga) => !existingIds.has(manga.mal_id)
        );
        return [...prev, ...filteredNew];
      });
    } catch (error) {
      console.error("Failed to fetch top manga:", error);
    } finally {
      setIsTopLoading(false);
    }
  };

  const handleSeeMore = () => {
    if (!isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleTopSeeMore = () => {
    if (!isTopLoading) {
      setTopPage((prev) => prev + 1);
    }
  };

  const handleGenreClick = (e, genreName, isExplicit = false) => {
    e.preventDefault();
    if (genreName === "All") {
      setSelectedGenre(null);
      setPage(1);
      fetchManga(1, null);
    } else {
      const genreId = isExplicit ? explicitGenreMap[genreName] : mainGenreMap[genreName];
      setSelectedGenre(genreName);
      setPage(1);
      fetchManga(1, genreId);
    }
    
    // On mobile, collapse the genre menu after selection
    if (windowWidth <= 768) {
      setGenreMenuOpen(false);
    }
  };

  const toggleGenreMenu = () => {
    setGenreMenuOpen(!genreMenuOpen);
  };

  useEffect(() => {
    const genreId = selectedGenre
      ? mainGenreMap[selectedGenre] || explicitGenreMap[selectedGenre]
      : null;
    fetchManga(page, genreId);
  }, [page, selectedGenre]);

  useEffect(() => {
    fetchTopManga(topPage);
  }, [topPage]);

  // Show top manga section in main grid for small screens
  const showTopMangaInGrid = windowWidth <= 992 && windowWidth > 480;

  return (
    <div className="main-home-layout">
      <aside className="genre-section">
        {windowWidth <= 768 && (
          <button className="genre-toggle" onClick={toggleGenreMenu}>
            {genreMenuOpen ? "Hide Genres ▲" : "Show Genres ▼"}
          </button>
        )}
        
        <div className={`genre-content ${genreMenuOpen ? 'open' : ''}`}>
          <h3>Genres</h3>
          <ul className="genre-list">
            <li key="All">
              <a href="#" onClick={(e) => handleGenreClick(e, "All")}>
                All
              </a>
            </li>
            {Object.keys(mainGenreMap).map((genre) => (
              <li key={genre}>
                <a 
                  href="#" 
                  onClick={(e) => handleGenreClick(e, genre)}
                  className={selectedGenre === genre ? 'active' : ''}
                >
                  {genre}
                </a>
              </li>
            ))}
          </ul>

          <h3>Explicit Genre</h3>
          <ul className="genre-list">
            {Object.keys(explicitGenreMap).map((genre) => (
              <li key={genre}>
                <a 
                  href="#" 
                  onClick={(e) => handleGenreClick(e, genre, true)}
                  className={selectedGenre === genre ? 'active' : ''}
                >
                  {genre}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="manga-feed-section">
        <h3 className="feed-title">
          {selectedGenre ? `${selectedGenre} Manga` : "All Manga"}
        </h3>
        <div className="manga-grid">
          {manga.length > 0 ? manga.map((item) => (
            <Link to={`/manga/${item.mal_id}`} key={item.mal_id} className="manga-card">
              <img src={item.images.jpg.image_url} alt={item.title} />
              <h4>{item.title}</h4>
            </Link>
          )) : (
            <div className="loading-message">
              {isLoading ? "Loading manga..." : "No manga found"}
            </div>
          )}
        </div>

        {manga.length > 0 && (
          <div className="see-more-top" onClick={handleSeeMore}>
            {isLoading ? "Loading..." : "See More"}
          </div>
        )}

        {/* Show top manga for medium screens inline */}
        {showTopMangaInGrid && topManga.length > 0 && (
          <div className="mobile-top-manga">
            <h3 className="feed-title">Top Manga</h3>
            <div className="manga-grid">
              {topManga.slice(0, 6).map((item) => (
                <Link to={`/manga/${item.mal_id}`} key={item.mal_id} className="manga-card">
                  <img src={item.images.jpg.image_url} alt={item.title} />
                  <h4>{item.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Extra small screens show a compact version */}
        {windowWidth <= 480 && topManga.length > 0 && (
          <div className="mobile-top-manga">
            <h3 className="feed-title">Top Manga</h3>
            <div className="top-manga-list-mobile">
              {topManga.slice(0, 4).map((manga, index) => (
                <Link to={`/manga/${manga.mal_id}`} key={manga.mal_id} className="manga-card">
                  <img src={manga.images.jpg.image_url} alt={manga.title} />
                  <h4>{manga.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <aside className="top-manga-section small">
        <h3 className="top-title">Top Manga</h3>
        <ol className="top-manga-list small-list">
          {topManga.map((manga, index) => (
            <li key={manga.mal_id + index} className="top-manga-item small-item">
              <Link to={`/manga/${manga.mal_id}`} style={{ display: 'flex', textDecoration: 'none' }}>
                <img src={manga.images.jpg.image_url} alt={manga.title} />
                <span className="manga-title">{manga.title}</span>
              </Link>
            </li>
          ))}
        </ol>
        {topManga.length > 0 && (
          <div className="see-more-top" onClick={handleTopSeeMore}>
            {isTopLoading ? "Loading..." : "See More"}
          </div>
        )}
      </aside>
    </div>
  );
};

export default MainHome;