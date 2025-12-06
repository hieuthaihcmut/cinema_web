// routes/cinemas.js
const express = require('express');
const { sql, poolPromise } = require('../db');

const router = express.Router();

// GET /api/cinemas
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
      SELECT CinemaID, Name, Location, OpeningHours, ClosingHours
      FROM Cinema
      ORDER BY CinemaID
    `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error /api/cinemas:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
