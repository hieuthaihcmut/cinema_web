import { useEffect, useState } from 'react'
import { getCinemas } from '../api'

export default function Cinemas() {
    const [data, setData] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCinemas()
            .then(setData)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

    return (
        <div>
            <h2>Cinemas</h2>
            {data.length === 0 ? (
                <p>No cinemas.</p>
            ) : (
                <ul>
                    {data.map((c) => (
                        <li key={c.CinemaID}>
                            {c.Name} — {c.Location}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
