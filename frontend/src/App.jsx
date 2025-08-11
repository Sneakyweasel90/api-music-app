import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Import the custom CSS file

function App() {
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set());

  const getPlaylist = async () => {
    if (!mood.trim() || !genre.trim()) return;
    
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "https://api-music-app-30ic.onrender.com/";
      const res = await fetch(`${API_BASE}/playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, genre })
      });
      const data = await res.json();
      setPlaylist(data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
    setLoading(false);
  };

  const toggleLike = (index) => {
    const newLiked = new Set(likedSongs);
    if (newLiked.has(index)) {
      newLiked.delete(index);
    } else {
      newLiked.add(index);
    }
    setLikedSongs(newLiked);
  };

  const moodSuggestions = ["Chill", "Energetic", "Happy", "Sad", "Romantic", "Motivated"];
  const genreSuggestions = ["Lo-fi", "Rock", "Pop", "Jazz", "Electronic", "Indie", "Folk", "Hip-hop"];

  return (
    <div className="app-background">
      {/* Animated background orbs */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="container-fluid px-3 py-5" style={{position: 'relative', zIndex: 10}}>
        {/* Header */}
        <div className="app-header">
          <div className="d-flex justify-content-center align-items-center mb-4">
            <div className="title-icon">
              <i className="fas fa-music" style={{fontSize: '24px', color: 'white'}}></i>
            </div>
            <h1 className="app-title">AI Playlist Generator</h1>
            <i className="fas fa-sparkles sparkle-icon" style={{fontSize: '24px'}}></i>
          </div>
          <p className="app-subtitle">
            Discover your perfect soundtrack powered by AI. Tell us your mood and genre, and we'll craft the ultimate playlist just for you.
          </p>
        </div>

        {/* Input Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="glass-card">
              <div className="row">
                {/* Mood Input */}
                <div className="col-md-6 mb-4">
                  <label className="form-label h5 text-white mb-3">
                    How are you feeling?
                  </label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    placeholder="Enter your mood..."
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  />
                  <div className="suggestion-pills">
                    {moodSuggestions.map((suggestion) => (
                      <span
                        key={suggestion}
                        className="pill"
                        onClick={() => setMood(suggestion)}
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Genre Input */}
                <div className="col-md-6 mb-4">
                  <label className="form-label h5 text-white mb-3">
                    What's your vibe?
                  </label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    placeholder="Enter genre..."
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                  <div className="suggestion-pills">
                    {genreSuggestions.map((suggestion) => (
                      <span
                        key={suggestion}
                        className="pill genre"
                        onClick={() => setGenre(suggestion)}
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center mt-4">
                <button
                  onClick={getPlaylist}
                  disabled={loading || !mood.trim() || !genre.trim()}
                  className="btn btn-lg generate-btn"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner d-inline-block"></div>
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sparkles me-2"></i>
                      Generate My Playlist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Results */}
        {playlist.length > 0 && (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="playlist-header">
                <h2 className="playlist-title">Your Perfect Playlist</h2>
                <p className="playlist-subtitle">
                  Curated specially for your {mood} mood in {genre} style
                </p>
              </div>

              <div className="playlist-container">
                {playlist.map((song, index) => (
                  <div key={index} className="song-card">
                    <div className="d-flex align-items-center">
                      {/* Play Button */}
                      <button className="play-btn">
                        <i className="fas fa-play"></i>
                      </button>

                      {/* Song Info */}
                      <div className="song-info">
                        <h3 className="song-title mb-1">{song.title}</h3>
                        <p className="song-artist mb-2">by {song.artist}</p>
                        <p className="song-description mb-0">{song.description}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="song-actions">
                        <button
                          className={`action-btn ${likedSongs.has(index) ? 'liked' : ''}`}
                          onClick={() => toggleLike(index)}
                        >
                          <i className={`fas fa-heart${likedSongs.has(index) ? '' : '-o'}`}></i>
                        </button>
                        
                        <button className="action-btn">
                          <i className="fas fa-share"></i>
                        </button>
                        
                        <button className="action-btn">
                          <i className="fas fa-volume-up"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Playlist Actions */}
              <div className="playlist-actions">
                <button className="btn btn-lg save-btn">
                  <i className="fas fa-save me-2"></i>
                  Save Playlist
                </button>
                <button className="btn btn-lg share-btn">
                  <i className="fas fa-users me-2"></i>
                  Share with Friends
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="app-footer">
          <p>Powered by AI • Made with ❤️ for music lovers</p>
        </div>
      </div>
    </div>
  );
}

export default App;