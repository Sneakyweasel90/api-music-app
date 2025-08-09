import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");
  const [playlist, setPlaylist] = useState([]);

  const getPlaylist = async () => {
    const res = await fetch("http://localhost:5000/playlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, genre })
    });
    const data = await res.json();
    setPlaylist(data);
  };

  return (
    <div className="container mt-5">
      <h1>🎵 AI Music Playlist Generator</h1>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Enter mood (e.g., chill, energetic)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Enter genre (e.g., rock, lo-fi)"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={getPlaylist}>
        Generate Playlist
      </button>

      <ul className="list-group mt-4">
        {playlist.map((song, i) => (
          <li key={i} className="list-group-item">
            <strong>{song.title}</strong> by {song.artist}  
            <p>{song.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
