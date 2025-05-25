import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleHeader from '../custom/TitleHeader';
import axios from 'axios';
import styles from "../styles/Profile.module.css"; // Changed to CSS module

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
  
  // Removed activeTab since we're only showing favorites now

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
      // Use Promise.all for parallel requests to improve performance
      const promises = favorites.map(async (favorite) => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/manga/getbyid/?id=${favorite.mal_id}`);
          if (response.status === 200) {
            mangaData[favorite.mal_id] = response.data;
          }
        } catch (err) {
          console.error(`Error fetching details for manga ID ${favorite.mal_id}:`, err);
        }
      });
      
      await Promise.all(promises);
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

  // User level based on favorites count
  const getUserLevel = (count) => {
    if (count >= 50) return "Manga Master";
    if (count >= 20) return "Avid Reader";
    if (count >= 10) return "Manga Enthusiast";
    if (count >= 5) return "Regular Reader";
    return "Casual Reader";
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileBanner}>
          <div className={styles.bannerOverlay}></div>
        </div>
        <div className={styles.profileHeaderContent}>
          <div className={styles.profileAvatar}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileUserInfo}>
            <h1>{user.username}</h1>
            <div className={styles.userLevel}>
              <span className={styles.levelBadge}>{getUserLevel(totalFavorites)}</span>
              <span className={styles.joinedDate}>Member since {registrationDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileSidebar}>
          <div className={styles.profileDetailsCard}>
            <h3>Profile Details</h3>
            <div className={styles.profileDetailItem}>
              <span className="material-symbols-outlined">mail</span>
              <span>{user.email}</span>
            </div>
            <div className={styles.profileDetailItem}>
              <span className="material-symbols-outlined">calendar_today</span>
              <span>Member for {memberDays} days</span>
            </div>
            <div className={styles.profileActions}>
              <button className={styles.profileActionButton} onClick={() => navigate("/mylist")}>
                <span className="material-symbols-outlined">bookmarks</span>
                My List
              </button>
              <button className={styles.profileActionButton} onClick={() => navigate("/myhistory")}>
                <span className="material-symbols-outlined">history</span>
                History
              </button>
            </div>
          </div>
          
          <div className={styles.profileStatsCard}>
            <h3>Stats</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{totalFavorites}</span>
                <span className={styles.statLabel}>Favorites</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{memberDays}</span>
                <span className={styles.statLabel}>Days</span>
              </div>
            </div>
            <div className={styles.statProgress}>
              <div className={styles.progressInfo}>
                <span>Level Progress</span>
                <span>{totalFavorites}/50</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${Math.min(totalFavorites/50*100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.profileMainContent}>
          {/* Changed from button tabs to centered heading */}
          <div className={styles.contentTabsCenter}>
            <div className={styles.favoritesHeading}>
              <span className="material-symbols-outlined">favorite</span>
              Favorites
            </div>
          </div>

          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className="material-symbols-outlined">favorite</span>
                My Favorite Manga
              </h2>
              <span className={styles.countBadge}>{uniqueFavorites.length}</span>
            </div>
            
            {isLoading ? (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                <p>Loading favorites...</p>
              </div>
            ) : error ? (
              <div className={styles.errorMessage}>
                <span className="material-symbols-outlined">error</span>
                <p>{error}</p>
                <button className={styles.retryButton} onClick={fetchFavorites}>
                  Try Again
                </button>
              </div>
            ) : uniqueFavorites.length === 0 ? (
              <div className={styles.emptyState}>
                <span className="material-symbols-outlined">favorite_border</span>
                <h3>No favorites yet</h3>
                <p>Start adding manga to your favorites to see them here</p>
                <button className={styles.actionButton} onClick={() => navigate('/MainHome')}>
                  Browse Manga
                </button>
              </div>
            ) : (
              <div className={styles.mangaGrid}>
                {uniqueFavorites.map((favorite) => {
                  const manga = mangaDetails[favorite.mal_id];
                  if (!manga) return null;
                  
                  return (
                    <div 
                      key={favorite.favorite_id} 
                      className={styles.mangaCard}
                      onClick={() => navigate(`/manga/${manga.mal_id}`)}
                    >
                      <div className={styles.mangaCover}>
                        <img
                          src={manga.images?.jpg?.image_url || "default-image.jpg"}
                          alt={manga.title}
                          loading="lazy"
                        />
                        {/* Moved badges outside the image for better visibility */}
                        <div className={styles.mangaBadges}>
                          {manga.score && (
                            <span className={`${styles.badge} ${styles.scoreBadge}`}>
                              <span className="material-symbols-outlined">star</span>
                              {manga.score}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.mangaInfo}>
                        <h3 className={styles.mangaTitle}>{manga.title}</h3>
                        <div className={styles.mangaMeta}>
                          <span className={styles.mangaType}>{manga.type || "Manga"}</span>
                          {manga.chapters && (
                            <span className={styles.mangaChapters}>{manga.chapters} ch</span>
                          )}
                        </div>
                        <div className={styles.mangaGenres}>
                          {manga.genres?.slice(0, 2).map(genre => (
                            <span key={genre.mal_id} className={styles.genreTag}>{genre.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;