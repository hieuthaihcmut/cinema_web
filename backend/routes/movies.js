// routes/movies.js
const express = require('express');
const { sql, poolPromise } = require('../db');

const router = express.Router();

// GET /api/movies
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
      SELECT MovieID, Title, Genre, Duration, Director, ReleaseDate
      FROM Movie
      ORDER BY MovieID
    `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error /api/movies:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
