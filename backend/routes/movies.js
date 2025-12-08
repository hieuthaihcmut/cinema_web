const express = require("express");
// const sql = require("mssql");
const { sql, poolPromise } = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT *
            FROM Movie
            ORDER BY MovieID
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error /api/movies:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET movie detail by ID
router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM Movie WHERE MovieID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Movie not found" });
        }

        res.json(result.recordset[0]);

    } catch (err) {
        console.error("Error fetching movie detail:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
