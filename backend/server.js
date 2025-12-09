// server.js
const express = require('express');
const cors = require('cors');

const movies = require('./routes/movies');
const showtimes = require('./routes/showtimes');
const customers = require("./routes/customers");
const tickets = require("./routes/tickets");
const score = require("./routes/score");
const seat = require("./routes/seat");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/tickets", tickets);
app.use("/api/score", score);
app.use("/api/seat", seat);

const PORT = process.env.PORT || 3000;

// route test
app.get('/', (req, res) => {
    res.json({ message: 'Cinema backend OK' });
});

// gắn các route
app.use('/movies', movies);
app.use('/showtimes', showtimes);
app.use('/customers', customers); // alias for singular form
app.use("/tickets", tickets);
app.use("/score", score);
app.use("/seat", seat);

app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
