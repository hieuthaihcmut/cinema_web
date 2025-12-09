// routes/seat.js - mounted at /api/seat and /seat
const express = require("express");
const { sql, poolPromise } = require("../db");

const router = express.Router();
router.use(express.json());

// POST /api/seat-availability
router.post("/", async (req, res) => {
    const { cinemaId, showtimeId, roomId } = req.body;

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input("CinemaID", sql.Int, cinemaId);
        request.input("ShowtimeID", sql.Int, showtimeId);
        request.input("RoomID", sql.Int, roomId);

        const result = await request.query(`
            SELECT *
            FROM dbo.ufn_CheckSeatAvailability(@CinemaID, @ShowtimeID, @RoomID);
        `);

        const data = result.recordset || [];

        return res.status(200).json({
            success: true,
            message:
                data.length > 0
                    ? `Lấy trạng thái ${data.length} ghế thành công.`
                    : "Không có dữ liệu ghế.",
            data,
        });
    } catch (err) {
        console.error("POST /api/seat error:", err);

        const dbMsg =
            err?.originalError?.info?.message ||
            err?.message ||
            "Lỗi khi lấy trạng thái ghế.";

        return res.status(400).json({
            success: false,
            message: dbMsg,
        });
    }
});

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Dùng POST /api/seat với cinemaId/showtimeId/roomId để lấy vé.",
    });
});

module.exports = router;
