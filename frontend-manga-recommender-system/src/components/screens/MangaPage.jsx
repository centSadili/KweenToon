import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MangaPage = () => {
  const { mal_id } = useParams();
  const [getManga, setManga] = useState({});

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/manga/getbyid/?id=${mal_id}`)
      .then((response) => {
        setManga(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch manga:", error);
      });
  }, [mal_id]); // Only runs when mal_id changes

  return (
    <div>
      <div className="card" style={{ width: "18rem" }}>
        <img
          src={getManga?.images?.jpg?.image_url}
          className="card-img-top"
          alt={getManga?.title}
        />
        <div className="card-body">
          <h5 className="card-title">{getManga?.title}</h5>
            <p className="card-text">{getManga?.synopsis}</p>
        </div>
      </div>
    </div>
  );
};

export default MangaPage;
