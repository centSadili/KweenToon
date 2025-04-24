import React, { useState } from 'react'
import TitleHeader from '../custom/TitleHeader'
import "../styles/Profile.css"

const Profile = () => {
    TitleHeader("Profile")
    const [user] = useState(JSON.parse(localStorage.getItem("user")));
    console.log("User found in localStorage:", user);
  return (
    <div className='container'>
      <div className='side-container'>
        {/*Username's to be changed to real username later */}
        <h1>Username's Profile</h1>
        <div>
            <img src={null} alt="Profile Picture" />
        </div>
        <h1>{user.username}</h1>
        <h3>{user.email}</h3>
        <div>
            <h2>Description:</h2>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                Ratione assumenda temporibus dolorum at praesentium? 
                Rerum ab laudantium, recusandae dolores blanditiis odit harum eius repellendus perspiciatis 
                quasi in vitae commodi necessitatibus?</p>
        </div>
        {/*Sample year to be changed in real years later*/}
        <h2>Last Joined: <p>Sample year</p></h2>
        <div>
            <h3>Statistics</h3>
            <div>
                <h4>Reading: </h4>
                <h4>Complete:</h4>
                <h4>Dropped:</h4>
                <h4>Plan to Read:</h4>
            </div>
        </div>
      </div>
      <div className='list-container'>
        <div>
            <h3>Currently Reading:</h3>
        </div>
        <div>
            <h3>Reading List:</h3>
        </div>
        <div>
            <h3>Favorites:</h3>
        </div>
      </div>
    </div>
  )
}

export default Profile
