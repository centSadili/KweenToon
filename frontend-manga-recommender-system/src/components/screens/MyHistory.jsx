import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MyHistory.css";

const MyHistory = () => {
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchHistoryList = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/history/");
        const history = response.data;
    
        // Sort history from latest to oldest by date
        const sortedHistory = history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
        // Fetch full manga info for each mal_id
        const mangaPromises = sortedHistory.map((item) =>
          axios.get(`http://localhost:8000/api/manga/getbyid/?id=${item.mal_id}`)
        );
    
        const mangaResponses = await Promise.all(mangaPromises);
        const fullMangaList = mangaResponses.map((res, index) => ({
          ...res.data,
          viewedDate: sortedHistory[index].date // Add the date from history
        }));
    
        setMyList(fullMangaList);
      } catch (error) {
        console.error("Failed to fetch history:", error);
        setError("Failed to load your history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryList();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="history-loader">
        <div className="spinner"></div>
        <p>Loading your history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-error">
        <span className="material-symbols-outlined">error</span>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>My Reading History</h1>
        <p className="history-subtitle">
          {myList.length > 0 
            ? `You have viewed ${myList.length} manga titles` 
            : "Your history is empty"}
        </p>
      </div>
      
      {myList.length === 0 ? (
        <div className="empty-history">
          <span className="material-symbols-outlined history-icon">
            history_toggle_off
          </span>
          <p>You haven't viewed any manga yet.</p>
          <a href="/home" className="browse-button">Browse Manga</a>
        </div>
      ) : (
        <div className="history-content">
          {myList.map((item, index) => (
            <div key={`${item.mal_id}-${index}`} className="history-card">
              <div className="history-card-image">
                <img 
                  src={item.images?.jpg?.image_url || 'https://via.placeholder.com/150x225?text=No+Image'} 
                  alt={item.title} 
                  loading="lazy" 
                />
              </div>
              <div className="history-card-details">
                <h3>{item.title}</h3>
                <div className="history-card-info">
                  <span className="history-card-date">
                    <span className="material-symbols-outlined">calendar_today</span>
                    {formatDate(item.viewedDate)}
                  </span>
                  {item.score && (
                    <span className="history-card-score">
                      <span className="material-symbols-outlined">star</span>
                      {item.score}
                    </span>
                  )}
                </div>
                <p className="history-card-genre">
                  {item.genres?.slice(0, 3).map(genre => genre.name).join(', ')}
                </p>
                <a href={`/manga/${item.mal_id}`} className="view-button">View Again</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHistory;