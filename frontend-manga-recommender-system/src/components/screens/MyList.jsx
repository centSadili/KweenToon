import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleHeader from '../custom/TitleHeader';
import axios from 'axios';
import "../styles/MyList.css";

const MyList = () => {
  TitleHeader("My List");
  const navigate = useNavigate();
  
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [favorites, setFavorites] = useState([]);
  const [mangaDetails, setMangaDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('');
  const [deletingItemIds, setDeletingItemIds] = useState([]);

  useEffect(() => {
    if (!user) {
      alert("Please login to view your list.");
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
        setError("Failed to fetch your list");
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

 const handleRemoveFavorite = async (favoriteId) => {
  try {
    // Add this ID to the deleting items
    setDeletingItemIds(prev => [...prev, favoriteId]);
    
    console.log(`Attempting to delete favorite with ID: ${favoriteId}`);
    
    const response = await axios.delete(`http://127.0.0.1:8000/api/favorite/${favoriteId}/`);
    console.log('Delete response:', response);
    
    if (response.status === 204) {
      console.log('Successfully deleted favorite');
      // Update the favorites state to remove the deleted item
      setFavorites(prevFavorites => 
        prevFavorites.filter(fav => fav.favorite_id !== favoriteId)
      );
    } else {
      console.error('Unexpected status code:', response.status);
      setError("Failed to remove from list");
    }
  } catch (error) {
    console.error("Error removing from list:", error);
    // Show more detailed error information
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
      setError(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      setError("Server did not respond. Please try again later.");
    } else {
      console.error("Request setup error:", error.message);
      setError(`Request error: ${error.message}`);
    }
  } finally {
    // Remove this ID from the deleting items
    setDeletingItemIds(prev => prev.filter(id => id !== favoriteId));
  }
};
  // Use useMemo to calculate uniqueFavorites and filteredFavorites
  const uniqueFavorites = useMemo(() => {
    return favorites
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter((favorite, index, self) => 
        index === self.findIndex((f) => f.mal_id === favorite.mal_id)
      );
  }, [favorites]); // Only recalculate when favorites changes

  // Filter by type if selected
  const filteredFavorites = useMemo(() => {
    return filterType 
      ? uniqueFavorites.filter(favorite => {
          const manga = mangaDetails[favorite.mal_id];
          return manga && manga.type === filterType;
        })
      : uniqueFavorites;
  }, [uniqueFavorites, mangaDetails, filterType]); // Recalculate when dependencies change

  // Get manga types for filter options
  const mangaTypes = useMemo(() => {
    return [...new Set(
      Object.values(mangaDetails)
        .filter(manga => manga && manga.type)
        .map(manga => manga.type)
    )];
  }, [mangaDetails]);

  return (
    <div className="mylist-container">
      <div className="mylist-header">
        <div className="header-content">
          <div className="header-titles">
            <h1>My Manga List</h1>
            <p className="subtitle">
              {uniqueFavorites.length > 0 
                ? `You have ${uniqueFavorites.length} manga in your collection` 
                : "Your list is empty"}
            </p>
          </div>
        </div>
      </div>

      <div className="mylist-content">
        <div className="list-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your list...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="material-symbols-outlined">error</span>
              <p>{error}</p>
              <button className="action-button" onClick={() => {
                setError(null);
                fetchFavorites();
              }}>
                Try Again
              </button>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="empty-state">
              <span className="material-symbols-outlined">bookmarks</span>
              <h3>
                {filterType 
                  ? `No ${filterType} manga found in your list` 
                  : "Your list is empty"}
              </h3>
              <p>Add manga to your collection to keep track of what you're reading</p>
              <button className="action-button" onClick={() => navigate('/home')}>
                Browse Manga
              </button>
            </div>
          ) : (
            <>
              <div className="list-header-row">
                <div className="manga-count">
                  Showing <span>{filteredFavorites.length}</span> manga
                  {filterType && <span> of type {filterType}</span>}
                </div>
              </div>
              
              <div className="manga-list">
                {filteredFavorites.map((favorite) => {
                  const manga = mangaDetails[favorite.mal_id];
                  if (!manga) return null;
                  
                  return (
                    <div key={favorite.favorite_id} className="manga-list-item">
                      <div 
                        className="manga-list-cover"
                        onClick={() => navigate(`/manga/${manga.mal_id}`)}
                      >
                        <img
                          src={manga.images?.jpg?.image_url || "default-image.jpg"}
                          alt={manga.title}
                          loading="lazy"
                        />
                      </div>
                      <div 
                        className="manga-list-details"
                        onClick={() => navigate(`/manga/${manga.mal_id}`)}
                      >
                        <h3 className="manga-list-title">{manga.title}</h3>
                        <div className="manga-list-info">
                          <span className="manga-type-badge">{manga.type || "Manga"}</span>
                          {manga.score && (
                            <span className="manga-score">
                              <span className="material-symbols-outlined">star</span>
                              {manga.score}
                            </span>
                          )}
                          {manga.chapters && (
                            <span className="manga-chapters">{manga.chapters} chapters</span>
                          )}
                        </div>
                        <div className="manga-list-genres">
                          {manga.genres?.slice(0, 3).map(genre => (
                            <span key={genre.mal_id} className="genre-chip">{genre.name}</span>
                          ))}
                        </div>
                        <p className="manga-list-synopsis">
                          {manga.synopsis 
                            ? manga.synopsis.length > 150 
                              ? manga.synopsis.substring(0, 150) + "..." 
                              : manga.synopsis
                            : "No synopsis available"
                          }
                        </p>
                      </div>
                      <div className="manga-list-actions">
                        <button 
                          className="action-icon-button remove-button" 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation when clicking delete
                            handleRemoveFavorite(favorite.favorite_id);
                          }}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyList;