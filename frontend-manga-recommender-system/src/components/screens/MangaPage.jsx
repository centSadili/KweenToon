import axios from "axios";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MangaCard from "../custom/MangaCard";
import "../styles/MangaPage.css";
import { useRef } from "react";

const MangaPage = () => {
  const { mal_id } = useParams();
  const [getManga, setManga] = useState({});
  const [allManga, setAllManga] = useState([]);
  const [page, setPage] = useState(1);
  const favoriteButtonRef = useRef(null); // Create a ref for the button

  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const fetchManga = async (currentPage) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/manga/?page=${currentPage}`
      );
      setAllManga((prev) => [...prev, ...response.data]);
    } catch (error) {
      console.error("Error fetching manga:", error);
    }
  };
  const addMangaHistory = async () => {
    if (!user || !user.id) {
      console.warn("User is not logged in or user ID is missing.");
      return;
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/history/`,
        { user_id: user.id, mal_id: mal_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Manga history added:", response.data);
    } catch (error) {
      console.error("Error adding manga history:", error);
    }
  };
  const addMangaFavorite = async () => {
    if (!user || !user.id) {
      console.warn("User is not logged in or user ID is missing.");
      alert("Please log in to add to favorites.");
      return;
    }

    // Disable the button using the ref
    if (favoriteButtonRef.current) {
      favoriteButtonRef.current.disabled = true;
    }

    try {
      // Send the request to add the manga to favorites
      const response = await axios.post(
        `http://127.0.0.1:8000/api/favorite/`,
        { user_id: user.id, mal_id: mal_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API response:", response); // Log full response for debugging

      // Check if the response contains the favorite_id to confirm success
      if (response.status === 200 && response.data.favorite_id) {
        // If the favorite_id is present, proceed with the state update
        alert("Manga added to favorites!");

        // Update state or list with the added favorite (assumes response.data contains the added manga)
        setAllManga((prevManga) => [
          ...prevManga,
          response.data, // Add the new favorite manga (response.data is the full data returned)
        ]);
      } else {
        console.error("API did not return expected data:", response.data);
        alert("Failed to add manga to favorites.");
      }

    } catch (error) {
      console.error("Error adding manga favorite:", error);
      alert("There was an issue adding this manga to favorites.");
    } finally {
      // Re-enable the button using the ref
      if (favoriteButtonRef.current) {
        favoriteButtonRef.current.disabled = false;
      }
    }
  };
  
  useEffect(() => {
    fetchManga(page);
  }, [page]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/manga/getbyid/?id=${mal_id}`)
      .then((response) => {
        setManga(response.data);
        addMangaHistory();
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch manga:", error);
      });
  }, [mal_id]); // Only runs when mal_id changes

  return (
    <div className="manga-page">
      <div className="left-container">
        <img
          src={getManga?.images?.jpg?.large_image_url}
          className="card-img-top"
          alt={getManga?.title}
        />
        <p>
          Authors:{" "}
          {getManga?.authors?.length > 0 ? (
            getManga.authors.map((author, index) => (
              <span key={index} style={{ color: "gold", fontWeight: "bold" }}>
                {author.name}
                {index < getManga.authors.length - 1 && ", "}
              </span>
            ))
          ) : (
            <span style={{ color: "orange", fontStyle: "italic" }}>
              No authors available ⚠️
            </span>
          )}
        </p>
        <p>
          Rank:{" "}
          {getManga?.rank != null ? (
            <span style={{ color: getManga.rank <= 100 ? "gold" : "gold" }}>
              👑 {getManga.rank}
            </span>
          ) : (
            <span style={{ color: "orange", fontStyle: "italic" }}>
              Rank not available ⚠️
            </span>
          )}
        </p>
        <p>
          Popularity:{" "}
          {getManga?.popularity != null ? (
            <span
              style={{ color: getManga.favorites > 1000 ? "gold" : "gray" }}
            >
              🔥 {getManga.popularity}
            </span>
          ) : (
            <span style={{ color: "orange", fontStyle: "italic" }}>
              Popularity info not available ⚠️
            </span>
          )}
        </p>
        <p>
          Favorites:{" "}
          {getManga?.favorites != null ? (
            <span
              style={{ color: getManga.favorites > 1000 ? "gold" : "gray" }}
            >
              ❤️ {getManga.favorites}
            </span>
          ) : (
            <span style={{ color: "orange", fontStyle: "italic" }}>
              Favorites info not available ⚠️
            </span>
          )}
        </p>
        <p>
          Serializations:{" "}
          {getManga?.serializations?.length > 0 ? (
            getManga.serializations.map((serialization, index) => (
              <span
                key={index}
                style={{ color: "#ffcc00", fontWeight: "bold" }}
              >
                {serialization.name}
                {index < getManga.serializations.length - 1 && ", "}
              </span>
            ))
          ) : (
            <span style={{ color: "orange", fontStyle: "italic" }}>
              No serialization info available ⚠️
            </span>
          )}
        </p>{" "}
      </div>

      <div className="right-container">
      <div className="upper-container">
      <div className="left-section">
        <h1>{getManga?.title_japanese}</h1>
        <h4>English Title: {getManga?.title}</h4> 
        <p>Score: {"⭐".repeat(Math.round(getManga?.score || 0))} ({getManga?.score})</p>
      </div>
      <div className="right-section">
      <div className="action-icons-container">
            <span
              className="material-symbols-outlined action-icon"
              onClick={addMangaFavorite} // Trigger function for adding to favorites
            >
              favorite
            </span>
            <span
              className="material-symbols-outlined action-icon playlist"
              onClick={addMangaHistory} // Trigger function for adding to playlist (history)
            >
              playlist_add
            </span>
            <button ref={favoriteButtonRef} onClick={addMangaFavorite}>Add to Favorites</button>

          </div>
      </div>
    </div>
        
        <div className="manga-info-grid">
          <p>
            Status:{" "}
            {getManga?.status === "Finished" ? (
              <span
                style={{
                  color: "white",
                  backgroundColor: "#28a745",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "12px",
                  fontWeight: "bold",
                }}
              >
                ✅ Finished
              </span>
            ) : getManga?.status === "Ongoing" ? (
              <span
                style={{
                  color: "white",
                  backgroundColor: "#ff9900",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "12px",
                  fontWeight: "bold",
                }}
              >
                🔄 Ongoing
              </span>
            ) : (
              <span
                style={{
                  color: "white",
                  backgroundColor: "#6c757d",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "12px",
                  fontWeight: "bold",
                }}
              >
                ❓ {getManga?.status}
              </span>
            )}
          </p>
          <p>Published: {getManga?.published?.string}</p>
          <p>
            Type:{" "}
            {getManga?.type ? (
              <>
                {getManga.type === "Manga" && "📖 Manga"}
                {getManga.type === "One-shot" && "🗒️ One-shot"}
                {getManga.type === "Novel" && "📚 Novel"}
                {getManga.type === "Doujinshi" && "🖌️ Doujinshi"}
                {getManga.type === "Manhwa" && "🇰🇷 Manhwa"}
                {getManga.type === "Manhua" && "🇨🇳 Manhua"}
                {[
                  "Manga",
                  "One-shot",
                  "Novel",
                  "Doujinshi",
                  "Manhwa",
                  "Manhua",
                ].includes(getManga.type) || `📘 ${getManga.type}`}
              </>
            ) : (
              <span style={{ color: "orange", fontStyle: "italic" }}>
                Type info not available ⚠️
              </span>
            )}
          </p>
          <p>
            Chapters:{" "}
            {getManga?.chapters != null ? (
              getManga.chapters
            ) : (
              <span style={{ color: "orange", fontStyle: "italic" }}>
                Woops! Chapters still updating ⚠️
              </span>
            )}
          </p>
          <p>
            Volumes:{" "}
            {getManga?.volumes != null ? (
              getManga.volumes
            ) : (
              <span style={{ color: "orange", fontStyle: "italic" }}>
                Volume count not available! ⚠️
              </span>
            )}
          </p>
          <p>
            Anime:{" "}
            <a
              style={{ fontWeight: "bold", fontStyle: "italic" }}
              href={getManga?.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {getManga?.title}
            </a>
          </p>
          <p>
            Genres:{" "}
            {getManga?.genres?.length > 0 ? (
              getManga.genres.map((genre, index) => (
                <span
                  key={index}
                  style={{ fontWeight: "bold", fontStyle: "italic" }}
                >
                  {genre.name}
                  {index < getManga.genres.length - 1 && ", "}
                </span>
              ))
            ) : (
              <span style={{ color: "orange", fontStyle: "italic" }}>
                No genres available ⚠️
              </span>
            )}
          </p>

          <p>
            Themes:{" "}
            {getManga?.themes?.length > 0 ? (
              getManga.themes.map((theme, index) => (
                <span
                  key={index}
                  style={{ fontWeight: "bold", fontStyle: "italic" }}
                >
                  {theme.name}
                  {index < getManga.themes.length - 1 && ", "}
                </span>
              ))
            ) : (
              <span style={{ color: "orange", fontStyle: "italic" }}>
                No themes available ⚠️
              </span>
            )}
          </p>
          <p>
            Demographics:{" "}
            {getManga?.demographics?.length > 0 ? (
              getManga.demographics
                .map((demo) => {
                  switch (demo.name) {
                    case "Shounen":
                      return "🧑‍🎤 Shounen";
                    case "Shoujo":
                      return "👧 Shoujo";
                    case "Seinen":
                      return "🧔 Seinen";
                    case "Josei":
                      return "👩 Josei";
                    default:
                      return `📘 ${demo.name}`;
                  }
                })
                .join(", ")
            ) : (
              <span style={{ color: "orange", fontStyle: "italic" }}>
                No demographic info ⚠️
              </span>
            )}
          </p>
        </div>
        <div className="synopsis-container">
          <h4>Synopsis{" 📝 "}</h4>
          <p>
            {getManga?.synopsis ? (
              <span>{getManga.synopsis}</span>
            ) : (
              <span style={{ color: "orange", fontStyle: "italic" }}>
                No synopsis available ⚠️
              </span>
            )}
          </p>
        </div>

        <div className="background-container">
          <h4>Background </h4>
          <p>
            {getManga?.background ? (
              <span>{getManga.background}</span>
            ) : (
              <span style={{ color: "orange", fontStyle: "italic" }}>
                No background information available ⚠️
              </span>
            )}
          </p>
        </div>

        <div className="reco-container">
          <h3>More Like This</h3>
          <div className="reco-grid">
            <div className="manga-row">
              {allManga.slice(0, 6).map((item, index) => (
                <div key={index} className="manga-wrapper">
                  <MangaCard manga={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaPage;
