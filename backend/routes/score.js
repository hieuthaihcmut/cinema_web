// routes/topMoviesReport.js
const express = require("express");
const { sql, poolPromise } = require("../db");

const router = express.Router();
router.use(express.json());

// POST /api/top-movies-report
router.post("/", async (req, res) => {
    const { minRatingsCount } = req.body;

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input("MinRatingsCount", sql.Int, minRatingsCount);

        const result = await request.execute("usp_GetTopPerformingMoviesReport");

        const data = result.recordset || [];

        return res.status(200).json({
            success: true,
            message:
                data.length > 0
                    ? `Lấy ${data.length} phim thỏa điều kiện.`
                    : "Không có phim nào thỏa điều kiện.",
            data,
        });
    } catch (err) {
        console.error("POST /api/score error:", err);

        const dbMsg =
            err?.originalError?.info?.message ||
            err?.message ||
            "Lỗi khi lấy báo cáo top phim.";

        return res.status(400).json({
            success: false,
            message: dbMsg,
        });
    }
});

module.exports = router;
