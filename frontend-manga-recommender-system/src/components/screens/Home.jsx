import axios from "axios";
import React, { useEffect, useState } from "react";
import MangaCard from "../custom/MangaCard";
import "../styles/Home.css";

const Home = () => {
  const [allManga, setManga] = useState([]);
  const [page, setPage] = useState(1);

  const fetchManga = async (currentPage) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/manga/?page=${currentPage}`);
      setManga((prev) => [...prev, ...response.data]);
    } catch (error) {
      console.error("Error fetching manga:", error);
    }
  };

  useEffect(() => {
    fetchManga(page);
  }, [page]);

  const handleSeeMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div>
      <div className="manga-row">
        {allManga.map((item, index) => (
          <div key={index} className="manga-wrapper">
            <MangaCard manga={item} />
          </div>
        ))}
      </div>

      <div className="see-more-container">
        <button className="see-more-btn" onClick={handleSeeMore}>
          See More
        </button>
      </div>
    </div>
  );
};

export default Home;
