import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/HomePage.jsx'

function App() {
    return (
        <BrowserRouter>
            <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
                <Link to="/">Home</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}

createRoot(document.getElementById('root')).render(<App />)
