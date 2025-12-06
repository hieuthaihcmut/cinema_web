import { useEffect, useState } from 'react'
import { getMovies } from '../api'

export default function Movies() {
    const [data, setData] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMovies()
            .then(setData)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

    return (
        <div>
            <h2>Movies</h2>
            {data.length === 0 ? (
                <p>No movies.</p>
            ) : (
                <ul>
                    {data.map((m) => (
                        <li key={m.MovieID}>
                            {m.Title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
