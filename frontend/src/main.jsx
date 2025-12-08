import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Movie from './pages/Movies.jsx';
import Customer from './pages/Customer.jsx';   // 👈 nhớ đường dẫn đúng

function App() {
    return (
        <BrowserRouter>
            <nav
                style={{
                    display: 'flex',
                    gap: 12,
                    padding: 12,
                    borderBottom: '1px solid #ccc',
                }}
            >
                <Link to="/">Movie</Link>
                <Link to="/customers">Customer</Link>  {/* 👈 THÊM LINK Ở ĐÂY */}
            </nav>

            <Routes>
                <Route path="/" element={<Movie />} />
                <Route path="/customers" element={<Customer />} /> {/* 👈 THÊM ROUTE Ở ĐÂY */}
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')).render(<App />);
