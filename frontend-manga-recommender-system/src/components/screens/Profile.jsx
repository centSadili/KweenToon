import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleHeader from '../custom/TitleHeader';
import "../styles/Profile.css";

const Profile = () => {
  TitleHeader("Profile");
  const navigate = useNavigate();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (!user) {
      alert("Please login to view your profile.");
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className='container'>
      <div className='side-container'>
        <h1>{user.username}'s Profile</h1>
        <div>
          <img src={null} alt="Profile Picture" />
        </div>
        <h1>{user.username}</h1>
        <h3>{user.email}</h3>
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
      <div className='list-container'>
        <div><h3>Currently Reading:</h3></div>
        <div><h3>Reading List:</h3></div>
        <div><h3>Favorites:</h3></div>
      </div>
    </div>
  );
};

export default Profile;
