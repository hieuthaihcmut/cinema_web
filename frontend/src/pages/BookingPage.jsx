import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

function BookingPage() {
    const { id } = useParams();
    const location = useLocation();
    const [movie, setMovie] = useState(location.state?.movie || null);

    const [showtime, setShowtime] = useState("");
    const [tickets, setTickets] = useState(1);

    // If user enters this page directly (no state), fetch movie again
    useEffect(() => {
        if (!movie) {
            (async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/movies/${id}`);
                    const data = await res.json();
                    setMovie(data);
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }, [id, movie]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // later: call backend POST /api/orders
        alert(
            `Order success!\nMovie: ${movie?.Title}\nShowtime: ${showtime}\nTickets: ${tickets}`
        );
    };

    if (!movie) return <h2 style={{ color: "white" }}>Loading...</h2>;

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#020617",
                color: "white",
                padding: "24px",
            }}
        >
            <h1 style={{ marginBottom: "8px" }}>Order Movie</h1>
            <h2 style={{ marginBottom: "20px", color: "#f97316" }}>
                {movie.Title}
            </h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    maxWidth: "400px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                <label>
                    Showtime
                    <select
                        value={showtime}
                        onChange={(e) => setShowtime(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    >
                        <option value="">-- Select showtime --</option>
                        {/* later bạn có thể load showtimes từ DB */}
                        <option value="2025-01-01 10:00">10:00</option>
                        <option value="2025-01-01 14:00">14:00</option>
                        <option value="2025-01-01 19:00">19:00</option>
                    </select>
                </label>

                <label>
                    Number of tickets
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={tickets}
                        onChange={(e) => setTickets(Number(e.target.value))}
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </label>

                <button
                    type="submit"
                    style={{
                        marginTop: "12px",
                        padding: "10px 20px",
                        borderRadius: "999px",
                        border: "none",
                        background:
                            "linear-gradient(to right, #22c55e, #a3e635)",
                        color: "#022c22",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    Confirm Order
                </button>
            </form>
        </div>
    );
}

export default BookingPage;
