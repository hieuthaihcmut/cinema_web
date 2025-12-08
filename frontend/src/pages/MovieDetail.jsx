import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJSON } from "../api";

function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await fetchJSON(`/movies/${id}`);
                setMovie(data);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) {
        return <h2 style={{ color: "white", padding: "20px" }}>Loading...</h2>;
    }

    if (!movie) {
        return (
            <h2 style={{ color: "white", padding: "20px" }}>
                Movie not found.
            </h2>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0f172a",
                color: "white",
                padding: "40px",
                display: "flex",
                gap: "40px",
            }}
        >
            {/* POSTER */}
            <div>
                <img
                    src={movie.PosterURL}
                    alt={movie.Title}
                    style={{
                        width: "350px",
                        height: "500px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                    }}
                />
            </div>

            {/* INFO SECTION */}
            <div style={{ maxWidth: "700px" }}>
                <h1 style={{ marginBottom: "10px", fontSize: "36px", fontWeight: "bold" }}>
                    {movie.Title}
                </h1>

                <p style={{ fontSize: "18px", color: "#f97316" }}>
                    {movie.Genre} • {movie.Language}
                </p>

                <p style={{ marginTop: "10px", fontSize: "16px", color: "#94a3b8" }}>
                    <b>Duration:</b> {movie.Duration} minutes
                    <br />
                    <b>Age Rating:</b> {movie.AgeRating}
                    <br />
                    <b>Rating:</b> ⭐ {movie.CustomerRating}
                </p>

                <h3 style={{ marginTop: "20px", fontSize: "22px" }}>Description</h3>
                <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: "1.6" }}>
                    {movie.Description}
                </p>

                <h3 style={{ marginTop: "20px", fontSize: "22px" }}>Additional Info</h3>
                <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: "1.6" }}>
                    <b>Director:</b> {movie.Director} <br />
                    <b>Studio:</b> {movie.Studio} <br />
                    <b>Country:</b> {movie.Country}
                </p>

                {/* ORDER BUTTON */}
                <button
                    style={{
                        marginTop: "30px",
                        padding: "12px 28px",
                        background:
                            "linear-gradient(to right, #f97316, #fb923c)",
                        border: "none",
                        borderRadius: "999px",
                        fontSize: "18px",
                        color: "#111827",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate(`/movie/${id}/order`, { state: { movie } })}
                >
                    Order Movie
                </button>
            </div>
        </div>
    );
}

export default MovieDetail;
