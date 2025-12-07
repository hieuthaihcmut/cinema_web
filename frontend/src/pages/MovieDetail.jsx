import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/movies/${id}`);
                const data = await res.json();
                setMovie(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        loadMovie();
    }, [id]);

    if (loading) return <h2>Loading...</h2>;
    if (!movie) return <h2>Movie not found.</h2>;

    return (
        <div style={{ padding: "20px", color: "white" }}>
            <h1>{movie.Title}</h1>

            {movie.PosterURL && (
                <img
                    src={movie.PosterURL}
                    alt={movie.Title}
                    style={{ width: "300px", borderRadius: "12px" }}
                />
            )}

            <p><b>Genre:</b> {movie.Genre}</p>
            <p><b>Language:</b> {movie.Language}</p>
            <p><b>Duration:</b> {movie.Duration} minutes</p>
            <p><b>Age Rating:</b> {movie.AgeRating}</p>
            <p><b>Rating:</b> ⭐ {movie.CustomerRating}</p>
            <p><b>Director:</b> {movie.Director}</p>
            <p><b>Studio:</b> {movie.Studio}</p>
            <p><b>Country:</b> {movie.Country}</p>
            <p><b>Description:</b> {movie.Description}</p>
        </div>
    );
}

export default MovieDetail;
