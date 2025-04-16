import axios from "axios";
import React, { useEffect, useState } from "react";
import MangaCard from "../custom/MangaCard";

const Home = () => {
  const [allManga, setManga] = useState([]);
  const [numOfManga, setNumOfManga] = useState(10);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/manga/`).then((reponse) => {
      setManga(reponse.data);
      console.log(reponse.data);
    });
  }, [numOfManga]);

  return (
    <div>
      {allManga.map((item, index) => {
        return (
          <div key={index}>
            <MangaCard key={index} manga={item} />
           
          </div>
        );
      })}
    </div>
  );
};

export default Home;
