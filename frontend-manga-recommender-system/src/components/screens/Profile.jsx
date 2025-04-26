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
  const [favorites, setFavorites] = useState([]);  // State to hold favorite mangas
  const [mangaDetails, setMangaDetails] = useState({}); // State to hold manga details

  useEffect(() => {
    if (!user) {
      alert("Please login to view your profile.");
      navigate("/");  // Redirect to homepage if not logged in
    } else {
      // Fetch favorites when the user is logged in
      fetchFavorites();
    }
  }, [user, navigate]);

  // Function to fetch favorites from the API
  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/favorite/?user_id=${user.id}`);
      if (response.status === 200) {
        setFavorites(response.data);  // Update state with the fetched favorites
        // Fetch manga details for each favorite (assuming mal_id corresponds to the manga's ID)
        fetchMangaDetails(response.data);
      } else {
        console.error("Failed to fetch favorites:", response);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Function to fetch manga details by mal_id
  const fetchMangaDetails = async (favorites) => {
    try {
      const mangaData = {};
      for (const favorite of favorites) {
        const response = await axios.get(`http://127.0.0.1:8000/api/manga/getbyid/?id=${favorite.mal_id}`);
        if (response.status === 200) {
          mangaData[favorite.mal_id] = response.data;  // Store manga details by mal_id
        }
      }
      setMangaDetails(mangaData);  // Update state with all fetched manga details
    } catch (error) {
      console.error("Error fetching manga details:", error);
    }
  };

  if (!user) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="container">
      <div className="side-container">
        <h1>{user.username}'s Profile</h1>
        <div>
          <img src={null} alt="Profile Picture" />
        </div>
        <h1>Username: {user.username}</h1>
        <h3>Email: {user.email}</h3>
        <div>
          <h2>Description:</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        </div>
        <h2>Last Joined: <p>Sample year</p></h2>
        <div>
          <h3>Statistics</h3>
          <div>
            <h4>Reading:</h4>
            <h4>Complete:</h4>
            <h4>Dropped:</h4>
            <h4>Plan to Read:</h4>
          </div>
        </div>
      </div>

      <div className="list-container">
        <div>
          <h3>Favorites:</h3>
          {favorites.length > 0 ? (
            <div className="favorites-cards-container">
            {favorites
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date: most recent first
              .filter((favorite, index, self) => 
                index === self.findIndex((f) => f.mal_id === favorite.mal_id) // Remove duplicates based on mal_id
              )
              .map((favorite) => {
                const manga = mangaDetails[favorite.mal_id]; // Get manga details by mal_id
                return (
                  manga && (
                    <div key={favorite.favorite_id} className="favorite-card">
                      <img
                        src={manga.images.jpg.small_image_url || manga.images.webp.small_image_url || "default-image.jpg"}
                        alt={manga.title}
                        className="manga-image"
                      />
                      <h4>{manga.title}</h4>
                    </div>
                  )
                );
              })}
          </div>
          ) : (
            <p>No favorites yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
