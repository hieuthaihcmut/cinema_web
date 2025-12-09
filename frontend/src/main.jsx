import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Movie from './pages/Movies.jsx';
import Customer from './pages/Customer.jsx';   // 👈 nhớ đường dẫn đúng
import RoomTicketsReport from './pages/tickets.jsx';
import TopMoviesReportPage from './pages/score.jsx';
import SeatAvailabilityPage from './pages/seat.jsx';

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
                <Link to="/tickets">Tickets</Link>
                <Link to="/score">TopMovie</Link>
                <Link to="/seat">Seat</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Movie />} />
                <Route path="/customers" element={<Customer />} />
                <Route path="/tickets" element={<RoomTicketsReport />} />
                <Route path="/score" element={<TopMoviesReportPage />} />
                <Route path="/seat" element={<SeatAvailabilityPage />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')).render(<App />);
