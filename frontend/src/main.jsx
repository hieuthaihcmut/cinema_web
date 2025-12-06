import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Cinemas from './pages/Cinemas.jsx'
import Movies from './pages/Movies.jsx'
import Showtimes from './pages/Showtimes.jsx'

function App() {
    return (
        <BrowserRouter>
            <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
                <Link to="/">Home</Link>
                <Link to="/cinemas">Cinemas</Link>
                <Link to="/movies">Movies</Link>
                <Link to="/showtimes">Showtimes</Link>
            </nav>
            <div style={{ padding: 16 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cinemas" element={<Cinemas />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/showtimes" element={<Showtimes />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

createRoot(document.getElementById('root')).render(<App />)
