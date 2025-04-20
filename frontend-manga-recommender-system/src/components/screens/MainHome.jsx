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

  TitleHeader('Home')
  const [topManga, setTopManga] = useState([]);
  const [topPage, setTopPage] = useState(1);

  const [manga, setManga] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const fetchManga = async (currentPage, genreId = null) => {
    try {
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
    }
  };

  const fetchTopManga = async (currentPage) => {
    try {
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
    }
  };

  const handleSeeMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleTopSeeMore = () => {
    setTopPage((prev) => prev + 1);
  };

  const handleGenreClick = (genreName, isExplicit = false) => {
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

  return (
    <div className="main-home-layout">
      <aside className="genre-section">
        <h3>Genres</h3>
        <ul className="genre-list">
          <li key="All">
            <a href="#" onClick={() => handleGenreClick("All")}>
              All
            </a>
          </li>
          {Object.keys(mainGenreMap).map((genre) => (
            <li key={genre}>
              <a href="#" onClick={() => handleGenreClick(genre)}>
                {genre}
              </a>
            </li>
          ))}
        </ul>

        <h3>Explicit Genre</h3>
        <ul className="genre-list">
          {Object.keys(explicitGenreMap).map((genre) => (
            <li key={genre}>
              <a href="#" onClick={() => handleGenreClick(genre, true)}>
                {genre}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <main className="manga-feed-section">
        <h3 className="feed-title">
          {selectedGenre ? `${selectedGenre} Manga` : "All Manga"}
        </h3>
        <div className="manga-grid">
  {manga.map((item) => (
    <Link to={`/manga/${item.mal_id}`} key={item.mal_id} className="manga-card">
      <img src={item.images.jpg.image_url} alt={item.title} />
      <h4>{item.title}</h4>
    </Link>
  ))}
</div>

        <div className="see-more-top" onClick={handleSeeMore}>
          See More
        </div>
      </main>

      <aside className="top-manga-section small">
        <h3 className="top-title">Top Manga</h3>
        <ol className="top-manga-list small-list">
          {topManga.map((manga, index) => (
            <li key={manga.mal_id + index} className="top-manga-item small-item">
              <img src={manga.images.jpg.image_url} alt={manga.title} />
              <span className="manga-title">{manga.title}</span>
            </li>
          ))}
        </ol>
        <div className="see-more-top" onClick={handleTopSeeMore}>
          See More
        </div>
      </aside>
    </div>
  );
};

export default MainHome;
