const BASE_URL = import.meta.env.VITE_API_BASE_URL || '' // proxied to backend via vite.config

export async function fetchJSON(path) {
    const res = await fetch(`${BASE_URL}${path}`)
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return res.json()
}

export const getCinemas = () => fetchJSON('/cinemas')
export const getMovies = () => fetchJSON('/movies')
export const getShowtimes = (cinemaId) => fetchJSON(cinemaId ? `/showtimes?cinemaId=${cinemaId}` : '/showtimes')
