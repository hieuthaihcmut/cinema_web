import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../api";

function HomePage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Use shared API client (proxied by Vite to backend)
                const data = await getMovies();
                setMovies(data);
            } catch (err) {
                console.error(err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return <div className="home-page">Loading movies...</div>;
    }

    if (error) {
        return <div className="home-page error">Error: {error}</div>;
    }

    return (
        <div className="home-page">
            <header className="home-header">
                <h1>Cinema</h1>
                <h2>Now Showing</h2>
            </header>

            {movies.length === 0 ? (
                <p className="empty-text">No movies currently showing.</p>
            ) : (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <div className="movie-card" key={movie.MovieID}>
                            {movie.PosterURL ? (
                                <img
                                    src={movie.PosterURL}
                                    alt={movie.Title}
                                    className="movie-poster"
                                />
                            ) : (
                                <div className="movie-poster placeholder">
                                    No Poster
                                </div>
                            )}

                            <div className="movie-info">
                                <h3 className="movie-title">{movie.Title}</h3>

                                <div className="movie-meta">
                                    <span className="badge">{movie.AgeRating}</span>
                                    <span>{movie.Duration} min</span>
                                    {movie.CustomerRating != null && (
                                        <span>⭐ {movie.CustomerRating}</span>
                                    )}
                                </div>

                                <p className="movie-genre">
                                    {movie.Genre} · {movie.Language}
                                </p>

                                {movie.Description && (
                                    <p className="movie-description">
                                        {movie.Description.length > 120
                                            ? movie.Description.slice(0, 120) + "..."
                                            : movie.Description}
                                    </p>
                                )}

                                <p className="movie-extra">
                                    <strong>Director:</strong> {movie.Director}
                                    <br />
                                    <strong>Studio:</strong> {movie.Studio}
                                    <br />
                                    <strong>Country:</strong> {movie.Country}
                                </p>

                                {/* Ví dụ nút xem chi tiết / đặt vé */}
                                <button
                                    className="movie-button"
                                    onClick={() => navigate(`/movie/${movie.MovieID}`)}
                                >
                                    View Detail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;
