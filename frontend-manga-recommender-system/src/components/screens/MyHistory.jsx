import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MyHistory.css"; 

const MyHistory = () => {
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchHistoryList = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/history/");
        const history = response.data;
    
        // Sort history from latest to oldest by date
        const sortedHistory = history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
        // Fetch full manga info for each mal_id
        const mangaPromises = sortedHistory.map((item) =>
          axios.get(`http://localhost:8000/api/manga/getbyid/?id=${item.mal_id}`)
        );
    
        const mangaResponses = await Promise.all(mangaPromises);
        const fullMangaList = mangaResponses.map((res) => res.data);
    
        setMyList(fullMangaList);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch history:", error);
        setLoading(false);
      }
    };

    fetchHistoryList();
  }, []);

  if (loading) {
    return (
      <div className="mylist-loader">
        <div className="spinner"></div>
        <p>Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="mylist-container">
      <h2>My History</h2>
      {myList.length === 0 ? (
        <div className="empty-mylist">
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ccc" }}>
            playlist_remove
          </span>
          <p>Your history is empty.</p>
        </div>
      ) : (
        <div className="mylist-content">
          {myList.map((item, index) => (
            <div key={index} className="mylist-item">
              <h3>{item.title}</h3>
              <img src={item.images?.jpg?.image_url} alt={item.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHistory;
