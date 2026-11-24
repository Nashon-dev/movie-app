import { useState, useEffect } from 'react';
import './App.css';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function App() {
  const [allMovies, setAllMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch('https://movie-app-backend-sigma.vercel.app/api/movies/');
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setAllMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  useEffect(() => {
    if (!selectedMovie) return;

    async function fetchDetails() {
      setDetailsLoading(true);
      try {
        const response = await fetch(
  `https://movie-app-backend-sigma.vercel.app/api/movies/${selectedMovie.id}`
);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setDetailsLoading(false);
      }
    }
    fetchDetails();
  }, [selectedMovie]);

  const filteredMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="status">Loading movies...</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  if (selectedMovie) {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setSelectedMovie(null)}>
          ← Back
        </button>

        {detailsLoading || !details ? (
          <p className="status">Loading details...</p>
        ) : (
          <div className="detail">
            <img
              className="detail-poster"
              src={`${IMAGE_BASE}${details.poster_path}`}
              alt={details.title}
            />
            <div className="detail-info">
              <h1>{details.title}</h1>
              <p className="meta">
                {details.release_date?.split('-')[0]} ·{" "}
                {details.runtime} min · ⭐ {details.vote_average?.toFixed(1)}
              </p>
              <p className="overview">{details.overview || "No overview available."}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

    return (
    <div className="app">
      <h1>Popular Movies</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredMovies.length === 0 ? (
        <p className="status">No movies match "{searchTerm}"</p>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => {
                setDetails(null);
                setSelectedMovie(movie);
              }}
            >
              <img
                src={`${IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title}
              />
              <h2>{movie.title}</h2>
              <p>{movie.release_date?.split('-')[0]}</p>
            </div>
          ))}
        </div>
      )}

      <footer className="credit">Movie data from TMDB</footer>
    </div>
  );
  }

export default App;