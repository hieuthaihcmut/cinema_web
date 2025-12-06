// routes/showtimes.js
const express = require('express');
const { sql, poolPromise } = require('../db');

const router = express.Router();

// GET /api/showtimes[?cinemaId=1]
router.get('/', async (req, res) => {
    try {
        const cinemaId = req.query.cinemaId;
        const pool = await poolPromise;

        let query = `
      SELECT ShowtimeID, CinemaID, RoomID, MovieID,
             Date, StartTime, EndTime, BasePriceMultiplier
      FROM Showtime
    `;

        const request = pool.request();
        if (cinemaId) {
            query += ' WHERE CinemaID = @cinemaId';
            request.input('cinemaId', sql.Int, parseInt(cinemaId));
        }

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error /api/showtimes:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
