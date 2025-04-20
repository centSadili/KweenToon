import React, { useState } from 'react'

const MangaCard = (props) => {
    const { manga } = props;
    const [getManga, setManga] = useState(manga);

    
  return (
    <div>
        <div className="card" style={{ width: "18rem" }}>
            <img src={getManga?.images.jpg.image_url} className="card-img-top" alt={getManga?.title} onClick={()=>{
              window.location.href=`/manga/${getManga?.mal_id}`
            }}/>
            <div className="card-body">
                <h5 className="card-title">{getManga?.title}</h5>
            </div>
        </div>
    </div>
  )
}

export default MangaCard