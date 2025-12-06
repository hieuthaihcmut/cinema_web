// server.js
const express = require('express');
const cors = require('cors');

const cinemaRoutes = require('./routes/cinemas');
const movieRoutes = require('./routes/movies');
const showtimeRoutes = require('./routes/showtimes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// route test
app.get('/', (req, res) => {
    res.json({ message: 'Cinema backend OK' });
});

// gắn các route
app.use('/cinemas', cinemaRoutes);
app.use('/movies', movieRoutes);
app.use('/showtimes', showtimeRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
