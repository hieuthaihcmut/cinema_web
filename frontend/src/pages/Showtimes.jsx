import { useEffect, useState } from 'react'
import { getShowtimes } from '../api'

export default function Showtimes() {
    const [data, setData] = useState([])
    const [cinemaId, setCinemaId] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getShowtimes(cinemaId ? Number(cinemaId) : undefined)
            .then(setData)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [cinemaId])

    return (
        <div>
            <h2>Showtimes</h2>
            <div style={{ marginBottom: 12 }}>
                <label>
                    Filter by CinemaID:
                    <input
                        value={cinemaId}
                        onChange={(e) => setCinemaId(e.target.value)}
                        placeholder="e.g. 1"
                        style={{ marginLeft: 8 }}
                    />
                </label>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : data.length === 0 ? (
                <p>No showtimes.</p>
            ) : (
                <ul>
                    {data.map((s) => (
                        <li key={s.ShowtimeID}>
                            {s.Date} {s.StartTime}-{s.EndTime} — {s.CinemaName} — {s.MovieTitle}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
