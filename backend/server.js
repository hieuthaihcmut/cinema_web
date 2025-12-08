// server.js
const express = require('express');
const cors = require('cors');

const cinemaRoutes = require('./routes/cinemas');
const movieRoutes = require('./routes/movies');
const showtimeRoutes = require('./routes/showtimes');
const movieDetailRoutes = require("./routes/movies");
const customers = require("./routes/customer");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/movies", movieDetailRoutes);
app.use("/api/customers", customers);
app.use("/api/customer", customers); // alias to avoid 404 if singular path is used

const PORT = process.env.PORT || 3000;

// route test
app.get('/', (req, res) => {
    res.json({ message: 'Cinema backend OK' });
});

// gắn các route
app.use('/cinemas', cinemaRoutes);
app.use('/movies', movieRoutes);
app.use('/showtimes', showtimeRoutes);
app.use('/customers', customers);
app.use('/customer', customers); // alias for singular form

app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
