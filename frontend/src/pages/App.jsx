import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import BookingPage from "./pages/BookingPage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/movie/:id/order" element={<BookingPage />} />
        </Routes>
    );
}

export default App;
