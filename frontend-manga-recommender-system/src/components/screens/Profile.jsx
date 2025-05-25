import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleHeader from '../custom/TitleHeader';
import axios from 'axios';
import "../styles/Profile.css";

const Profile = () => {
  TitleHeader("Profile");
  const navigate = useNavigate();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [favorites, setFavorites] = useState([]);
  const [mangaDetails, setMangaDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    if (!user) {
      alert("Please login to view your profile.");
      navigate("/");
    } else {
      fetchFavorites();
    }
  }, [user, navigate]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/favorite/?user_id=${user.id}`);
      if (response.status === 200) {
        setFavorites(response.data);
        fetchMangaDetails(response.data);
      } else {
        setError("Failed to fetch favorites");
      }
    } catch (error) {
      setError("Error connecting to server");
      console.error("Error fetching favorites:", error);
      setIsLoading(false);
    }
  };

  const fetchMangaDetails = async (favorites) => {
    try {
      const mangaData = {};
      for (const favorite of favorites) {
        const response = await axios.get(`http://127.0.0.1:8000/api/manga/getbyid/?id=${favorite.mal_id}`);
        if (response.status === 200) {
          mangaData[favorite.mal_id] = response.data;
        }
      }
      setMangaDetails(mangaData);
    } catch (error) {
      console.error("Error fetching manga details:", error);
      setError("Failed to load manga details");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  // Get unique favorites by mal_id, sorted by date
  const uniqueFavorites = favorites
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((favorite, index, self) => 
      index === self.findIndex((f) => f.mal_id === favorite.mal_id)
    );

  // Get registration date in readable format
  const registrationDate = user.date_joined 
    ? new Date(user.date_joined).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "Unknown";

  // Calculate some user stats
  const totalFavorites = uniqueFavorites.length;
  const memberDays = user.date_joined 
    ? Math.floor((new Date() - new Date(user.date_joined)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner">
          <div className="banner-overlay"></div>
        </div>
        <div className="profile-header-content">
          <div className="profile-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-user-info">
            <h1>{user.username}</h1>
            <p className="joined-date">Joined {registrationDate}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-details-card">
            <h3>Profile Details</h3>
            <div className="profile-detail-item">
              <span className="material-symbols-outlined">mail</span>
              <span>{user.email}</span>
            </div>
            <div className="profile-detail-item">
              <span className="material-symbols-outlined">calendar_today</span>
              <span>Member for {memberDays} days</span>
            </div>
            <div className="profile-bio">
              <h4>About Me</h4>
              <p>{user.bio || "No bio yet. Tell us about yourself!"}</p>
            </div>
          </div>
          
          <div className="profile-stats-card">
            <h3>Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{totalFavorites}</span>
                <span className="stat-label">Favorites</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-main-content">
          <div className="content-tabs">
            <button 
              className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <span className="material-symbols-outlined">favorite</span>
              Favorites
            </button>
            <button 
              className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              <span className="material-symbols-outlined">check_circle</span>
              Completed
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'favorites' && (
              <>
                <h2 className="section-title">
                  <span className="material-symbols-outlined">favorite</span>
                  My Favorite Manga
                  <span className="count-badge">{uniqueFavorites.length}</span>
                </h2>
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading favorites...</p>
                  </div>
                ) : error ? (
                  <div className="error-message">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                  </div>
                ) : uniqueFavorites.length === 0 ? (
                  <div className="empty-state">
                    <span className="material-symbols-outlined">favorite_border</span>
                    <p>You haven't added any favorites yet.</p>
                    <button className="action-button" onClick={() => navigate('/home')}>
                      Browse Manga
                    </button>
                  </div>
                ) : (
                  <div className="manga-grid">
                    {uniqueFavorites.map((favorite) => {
                      const manga = mangaDetails[favorite.mal_id];
                      if (!manga) return null;
                      
                      return (
                        <div 
                          key={favorite.favorite_id} 
                          className="manga-card"
                          onClick={() => navigate(`/manga/${manga.mal_id}`)}
                        >
                          <div className="manga-cover">
                            <img
                              src={manga.images?.jpg?.image_url || "default-image.jpg"}
                              alt={manga.title}
                              loading="lazy"
                            />
                            <div className="manga-badges">
                              {manga.score && (
                                <span className="badge score-badge">
                                  <span className="material-symbols-outlined">star</span>
                                  {manga.score}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="manga-info">
                            <h3 className="manga-title">{manga.title}</h3>
                            <div className="manga-meta">
                              <span className="manga-type">{manga.type || "Manga"}</span>
                              {manga.chapters && (
                                <span className="manga-chapters">{manga.chapters} ch</span>
                              )}
                            </div>
                            <div className="manga-genres">
                              {manga.genres?.slice(0, 2).map(genre => (
                                <span key={genre.mal_id} className="genre-tag">{genre.name}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === 'reading' && (
              <div className="empty-state">
                <span className="material-symbols-outlined">book_2</span>
                <p>You're not currently reading any manga.</p>
                <button className="action-button" onClick={() => navigate('/home')}>
                  Find Something to Read
                </button>
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="empty-state">
                <span className="material-symbols-outlined">check_circle</span>
                <p>You haven't completed any manga yet.</p>
                <button className="action-button" onClick={() => navigate('/home')}>
                  Browse Manga
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;