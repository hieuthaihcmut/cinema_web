// src/pages/Movie.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Movie() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function fetchMovies() {
            const res = await fetch("http://localhost:3000/api/movies");
            const data = await res.json();
            setMovies(data);
        }
        fetchMovies();
    }, []);

    return (
        <div>
            <h1>Movie List</h1>

            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>MovieID</th>
                        <th>Title</th>
                        <th>AgeRating</th>
                        <th>ReleaseDate</th>
                        <th>Duration</th>
                        <th>CustomerRating</th>
                        <th>Genre</th>
                        <th>Language</th>
                        <th>Description</th>
                        <th>Studio</th>
                        <th>Country</th>
                        <th>Director</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((m) => (
                        <tr key={m.MovieID}>
                            <td>{m.MovieID}</td>
                            <td>{m.Title}</td>
                            <td>{m.AgeRating}</td>
                            <td>{m.ReleaseDate?.slice(0, 10)}</td>
                            <td>{m.Duration}</td>
                            <td>{m.CustomerRating}</td>
                            <td>{m.Genre}</td>
                            <td>{m.Language}</td>
                            <td>{m.Description}</td>
                            <td>{m.Studio}</td>
                            <td>{m.Country}</td>
                            <td>{m.Director}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Movie;
